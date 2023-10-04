// src/DeepLinkContext.tsx
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useCoreContext } from "./CoreContext";
import {
  EVMContractAddress,
  IOpenSeaMetadata,
  Invitation,
} from "@snickerdoodlelabs/objects";
import CenteredModal from "../components/CenteredModal";
interface ILayoutContextProps {}

interface ILayoutContextType {
  handlePopup: (invitationParams: InvitationPopupProps) => void;
}
export interface InvitationPopupProps {
  status: boolean;
  invitation: Invitation;
}

const LayoutContext = createContext<ILayoutContextType>(
  {} as ILayoutContextType
);

// Deep link handling component
const LayoutProvider: React.FC<ILayoutContextProps> = ({ children }: any) => {
  const { snickerdoodleCore } = useCoreContext();
  const [invitation, setInvitation] = React.useState<Invitation | null>(null);
  const [showPopup, setShowPopup] = React.useState<boolean>(false);
  const [invitationMetadata, setInvitationMetadata] =
    React.useState<IOpenSeaMetadata | null>(null);

  useEffect(() => {
    if (showPopup && invitation) {
      console.log("showPopup", showPopup);
      snickerdoodleCore
        ?.getConsentContractCID(
          invitation?.consentContractAddress as EVMContractAddress
        )
        .map((cid) => {
          console.log("cid", cid);
          snickerdoodleCore.invitation
            .getInvitationMetadataByCID(cid)
            .map((metaData) => {
              console.log("metaData", metaData);
              setInvitationMetadata(metaData);
            });
        })
        .mapErr((error) => {
          console.log("Error getting invitation metadata", error);
        });
    }
  }, [showPopup, invitation]);

  const invitationPopup = useMemo(() => {
    console.log("invitationPopup", invitationMetadata);
    if (showPopup && invitationMetadata) {
      return (
        <CenteredModal
          invitation={invitation!}
          invitationMetadata={invitationMetadata}
          handleVisible={function (visible: boolean): void {
            setShowPopup(visible);
          }}
        />
      );
    } else {
      return null;
    }
  }, [showPopup, invitationMetadata]);

  const handlePopup = (invitationParams: InvitationPopupProps) => {
    console.log("handlePopup", invitationParams);
    setShowPopup(invitationParams.status);
    setInvitation(invitationParams.invitation);
    console.log("popupend");
  };
  return (
    <LayoutContext.Provider value={{ handlePopup }}>
      {invitationPopup}
      {children}
    </LayoutContext.Provider>
  );
};
export const useLayoutContext = () => useContext(LayoutContext);

export default LayoutProvider;
