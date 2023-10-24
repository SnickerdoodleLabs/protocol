import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useCoreContext } from "./CoreContext";
import {
  EVMContractAddress,
  IOldUserAgreement,
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

const LayoutProvider: React.FC<ILayoutContextProps> = ({ children }: any) => {
  const { snickerdoodleCore } = useCoreContext();
  const [invitation, setInvitation] = React.useState<Invitation | null>(null);
  const [showPopup, setShowPopup] = React.useState<boolean>(false);
  const [invitationMetadata, setInvitationMetadata] =
    React.useState<IOldUserAgreement | null>(null);

  useEffect(() => {
    if (showPopup && invitation) {
      snickerdoodleCore
        ?.getConsentContractCID(
          invitation?.consentContractAddress as EVMContractAddress
        )
        .andThen((cid) => {
          return snickerdoodleCore.invitation
            .getInvitationMetadataByCID(cid)
            .map((metaData) => {
              setInvitationMetadata(metaData);
            });
        })
        .mapErr((error) => {
          console.log("Error getting invitation metadata", error);
        });
    }
  }, [showPopup, invitation]);

  const invitationPopup = useMemo(() => {
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
    setShowPopup(invitationParams.status);
    setInvitation(invitationParams.invitation);
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
