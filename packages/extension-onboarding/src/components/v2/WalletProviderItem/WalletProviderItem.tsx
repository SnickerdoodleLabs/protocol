import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import {
  SDButton,
  SDTypography,
  useMedia,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

interface IWalletProviderItemProps {
  label: string;
  icon: string;
  onClick: () => void;
  buttonText?: string;
}

const WalletProviderItem: FC<IWalletProviderItemProps> = ({
  label,
  icon,
  onClick,
  buttonText = "Link Account",
}) => {
  const currentBreakpoint = useMedia();
  return (
    <Grid xs={12} sm={6} md={4} lg={3} item>
      <Box
        px={3}
        display="flex"
        flexDirection="column"
        py={1.5}
        borderRadius={12}
        border="1px solid"
        borderColor={"borderColor"}
      >
        <Box display="flex" alignItems="center" mb={1.5}>
          <img src={icon} width={40} height={40} />
          <Box ml={2} />
          <SDTypography
            variant="bodyLg"
            fontWeight="medium"
            color="textHeading"
          >
            {label}
          </SDTypography>
        </Box>
        <Box>
          <SDButton
            onClick={onClick}
            {...(currentBreakpoint === "xs" && { fullWidth: true })}
            variant="outlined"
          >
            {buttonText}
          </SDButton>
        </Box>
      </Box>
    </Grid>
  );
};

export default WalletProviderItem;
