import {
  EVMContractAddress,
  BigNumberString,
  DomainName,
  TokenId,
  Signature,
  EInvitationStatus,
  Invitation,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";

import { useAppContext } from "./AppContextProvider";
import { useLayoutContext } from "./LayoutContext";

export interface IInvitationContext {
  setInvitation: (params: IInvitationParams) => void;
}

const InvitationContext = React.createContext<IInvitationContext>(
  {} as IInvitationContext,
);
export interface IInvitationParams {
  consentAddress: EVMContractAddress | undefined;
  tokenId: BigNumberString | undefined;
  signature: Signature | undefined;
}

const InvitationContextProvider = ({ children }) => {
  const [invitationParams, setInvitationParams] = useState<IInvitationParams>();
  const { mobileCore, isUnlocked } = useAppContext();
  const { setInvitationStatus } = useLayoutContext();

  useEffect(() => {
    if (invitationParams?.consentAddress && isUnlocked) {
      checkInvitationStatus();
    }
  }, [JSON.stringify(invitationParams), isUnlocked]);

  const setInvitation = (invitation: IInvitationParams) => {
    setInvitationParams(invitation);
  };

  const getTokenId = (tokenId: BigNumberString | undefined) => {
    if (tokenId) {
      return okAsync(TokenId(BigInt(tokenId)));
    }
    return mobileCore.getCyrptoUtils().getTokenId();
  };

  const checkInvitationStatus = () => {
    console.warn("CHECKING INVITATION");
    const invitationService = mobileCore.invitationService;
    const { consentAddress, signature, tokenId } = invitationParams!;
    let _invitation: Invitation;

    getTokenId(tokenId).andThen((tokenId) => {
      _invitation = {
        consentContractAddress: consentAddress as EVMContractAddress,
        domain: DomainName(""),
        tokenId,  
        businessSignature: (signature as Signature) ?? null,
      };
      return invitationService
        .checkInvitationStatus(_invitation)
        .map((status) => {
          if (status === EInvitationStatus.New) {
            mobileCore.invitationService
              .getConsentContractCID(
                invitationParams?.consentAddress as EVMContractAddress,
              )
              .map((ipfsCID) => {
                mobileCore.invitationService
                  .getInvitationMetadataByCID(ipfsCID)
                  .map((metaData) => {
                    setInvitationStatus(true, metaData, _invitation);
                  });
              });
          } else {
            setInvitationParams(undefined);
          }
        })
        .mapErr((e) => {
          console.error("INVITATION STATUS ERROR", e);
          setInvitationParams(undefined);
        });
    });
  };

  return (
    <InvitationContext.Provider value={{ setInvitation }}>
      <View style={{ position: "absolute", zIndex: 9999 }}></View>

      {children}
    </InvitationContext.Provider>
  );
};

export default InvitationContextProvider;
export const useInvitationContext = () => useContext(InvitationContext);
