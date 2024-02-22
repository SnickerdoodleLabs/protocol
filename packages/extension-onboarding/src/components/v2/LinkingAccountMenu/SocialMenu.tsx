import LinkingAccountMenu from "@extension-onboarding/components/v2/LinkingAccountMenu/LinkingAccountMenu";
import { Box } from "@material-ui/core";
import {
  SDTypography,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

interface ISocialMenuProps {
  onDiscordConnectClick: () => void;
}

export const SocialMenu: FC<ISocialMenuProps> = ({ onDiscordConnectClick }) => {
  const getResponsiveValue = useResponsiveValue();
  return (
    <LinkingAccountMenu
      title="Connect Account"
      leftRender={
        <img
          src="https://storage.googleapis.com/dw-assets/shared/icons/discord-link.png"
          width={getResponsiveValue({ xs: 22, sm: 40 })}
          height={getResponsiveValue({ xs: 22, sm: 40 })}
        />
      }
      menuItems={[
        {
          render: (
            <Box
              display="flex"
              py={{ xs: 0, sm: 1 }}
              gridGap={12}
              alignItems="center"
            >
              <img
                src="https://storage.googleapis.com/dw-assets/shared/icons/discord-link.png"
                width={24}
                height={24}
              />
              <SDTypography
                variant="bodyLg"
                fontWeight={getResponsiveValue({ xs: "regular", sm: "bold" })}
              >
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
