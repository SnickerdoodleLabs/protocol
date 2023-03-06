import {
  EVMContractAddress,
  BigNumberString,
  DomainName,
  TokenId,
  Signature,
  EInvitationStatus,
  Invitation,
  IOpenSeaMetadata,
  IpfsCID,
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
  const [invitationToDisplay, setInvitationToDisplay] = useState<Invitation>();
  const [invitationMeta, setInvitationMeta] = useState<IOpenSeaMetadata>();
  const { coreContext, isUnlocked } = useAppContext();
  const { setInvitationStatus } = useLayoutContext();

  useEffect(() => {
    if (invitationParams?.consentAddress && isUnlocked) {
      /*    ("CHECKING INVITATION STATUS");
      setTimeout(() => checkInvitationStatus(), 5000); */
      getMetaData();
    }
  }, [JSON.stringify(invitationParams), isUnlocked]);

  useEffect(() => {
    if (invitationToDisplay) {
      getInvitationData();
    }
  }, [
    JSON.stringify(invitationToDisplay, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  ]);

  const setInvitation = (invitation: IInvitationParams) => {
    setInvitationParams(invitation);
  };

  const checkInvitationStatus = () => {
    console.warn("CHECKING INVITATION");
    const invitationService = coreContext.getInvitationService();
    const { consentAddress, signature, tokenId } = invitationParams!;
    let _invitation: Invitation;

    getTokenId(tokenId).andThen((tokenId) => {
      _invitation = {
        consentContractAddress: consentAddress as EVMContractAddress,
        domain: DomainName(""),
        tokenId,
        businessSignature: (signature as Signature) ?? null,
      };

      console.error({ _invitation });
      return invitationService
        .checkInvitationStatus(_invitation)
        .map((status) => {
          console.log("INVITATION STATUS", status);
          if (status === EInvitationStatus.New) {
            setInvitationToDisplay(_invitation);
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

  const getTokenId = (tokenId: BigNumberString | undefined) => {
    if (tokenId) {
      return okAsync(TokenId(BigInt(tokenId)));
    }
    return coreContext.getCyrptoUtils().getTokenId();
  };

  const getInvitationData = () => {
    const invitationService = coreContext.getInvitationService();
    invitationService
      .getConsentContractCID(invitationToDisplay!.consentContractAddress)
      .andThen((cid) => invitationService.getInvitationMetadataByCID(cid))
      .map((invitationMeta) => setInvitationMeta(invitationMeta));
  };
  const getMetaData = () => {
    {
      coreContext
        ?.getInvitationService()
        .checkInvitationStatus(
          new Invitation(
            "" as DomainName,
            invitationParams?.consentAddress as EVMContractAddress,
            //@ts-ignore
            invitationParams?.tokenId,
            invitationParams?.signature,
          ),
        )
        .then((res) => {
          console.log("invitationStatusEnd", res);
          //@ts-ignore
          if (EInvitationStatus.New === res?.value) {
            coreContext
              .getInvitationService()
              .getConsentContractCID(
                invitationParams?.consentAddress as EVMContractAddress,
              )
              .then((res2) => {
                console.log("getConsentContractCIDend2", res2);
                coreContext
                  .getInvitationService()
                  .getInvitationMetadataByCID(res2?.value as IpfsCID)
                  .then((res3) => {
                    console.log("MetaData", res3);
                    setInvitationStatus(true, res3, invitationParams);
                  });
              });
          }
        });
    }
  };
  return (
    <InvitationContext.Provider value={{ setInvitation }}>
      <View style={{ position: "absolute", zIndex: 9999 }}>
      </View>

      {children}
    </InvitationContext.Provider>
  );
};

export default InvitationContextProvider;
export const useInvitationContext = () => useContext(InvitationContext);
