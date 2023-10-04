// src/DeepLinkContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  EVMContractAddress,
  BigNumberString,
  Signature,
  Invitation,
  EInvitationStatus,
} from "@snickerdoodlelabs/objects";
import { useCoreContext } from "./CoreContext";
import { InvitationPopupProps, useLayoutContext } from "./LayoutContext";

export interface IInvitationParams {
  consentAddress: EVMContractAddress | undefined;
  tokenId: BigNumberString | undefined;
  signature: Signature | undefined;
}

// Define the context and its default values
export interface InvitationContextType {
  invitation: Invitation | null;
  handleInvitation: (invitation: Invitation | null) => void;
}

const InvitationContext = createContext<InvitationContextType>(
  {} as InvitationContextType
);

// Deep link handling component
const InvitationProvider: React.FC = ({ children }:any) => {
  const { snickerdoodleCore , isUnlocked } = useCoreContext();
  const { handlePopup } = useLayoutContext();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  useEffect(() => {
    if (invitation && isUnlocked) {
      snickerdoodleCore?.invitation
        .checkInvitationStatus(invitation)
        .map((invitationStatus) => {
          console.log('INVITATION STATUS', invitationStatus)
          if (invitationStatus === EInvitationStatus.New) {
            handlePopup({ status: true, invitation: invitation } as InvitationPopupProps);
          }
        })
        .mapErr((error) => {
          console.log("Error checking invitation status", error);
        });
    }
  }, [invitation,isUnlocked]);

  const handleInvitation = (invitation: Invitation | null) => {
    if (invitation) {
      setInvitation(invitation);
    }
  };

  return (
    <InvitationContext.Provider value={{ invitation, handleInvitation }}>
      {children}
    </InvitationContext.Provider>
  );
};
export const useInvitationContext = () => useContext(InvitationContext);

export default InvitationProvider;
