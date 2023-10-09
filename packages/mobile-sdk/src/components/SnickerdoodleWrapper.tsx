import React from "react";
import DeepLinkHandler from "../context/DeepLinkContext";
import { IConfigOverrides } from "@snickerdoodlelabs/objects";
import CoreProvider from "../context/CoreContext";
import InvitationProvider from "../context/InvitationContext";
import LayoutProvider from "../context/LayoutContext";
import EventContextProvider from "../context/EventContextProvider";

interface ISnickerDoodleWrapperProps {
  children: React.ReactNode;
  configs?: IConfigOverrides | undefined;
}
const SnickerdoodleWrapper: React.FC<ISnickerDoodleWrapperProps> = ({
  children,
  configs,
}) => {
  return (
    <CoreProvider configs={configs}>
      <EventContextProvider>
        <LayoutProvider>
          <InvitationProvider>
            <DeepLinkHandler />
            {children}
          </InvitationProvider>
        </LayoutProvider>
      </EventContextProvider>
    </CoreProvider>
  );
};

export default SnickerdoodleWrapper;
