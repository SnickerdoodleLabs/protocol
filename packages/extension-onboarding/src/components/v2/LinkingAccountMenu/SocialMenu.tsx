import LinkingAccountMenu from "@extension-onboarding/components/v2/LinkingAccountMenu/LinkingAccountMenu";
import { Box } from "@material-ui/core";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

interface ISocialMenuProps {
  onDiscordConnectClick: () => void;
}

export const SocialMenu: FC<ISocialMenuProps> = ({ onDiscordConnectClick }) => {
  return (
    <LinkingAccountMenu
      title="Connect Account"
      leftRender={
        <img
          src="https://storage.googleapis.com/dw-assets/shared/icons/discord-link.png"
          width={40}
          height={40}
        />
      }
      menuItems={[
        {
          render: (
            <Box display="flex" py={1} gridGap={12} alignItems="center">
              <img
                src="https://storage.googleapis.com/dw-assets/shared/icons/discord-link.png"
                width={24}
                height={24}
              />
              <SDTypography variant="bodyLg" fontWeight="bold">
                Connect Discord
              </SDTypography>
            </Box>
          ),
          onClick: onDiscordConnectClick,
        },
      ]}
    />
  );
};
