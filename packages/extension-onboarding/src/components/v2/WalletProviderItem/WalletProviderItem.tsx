import { Box, Grid } from "@material-ui/core";
import { SDButton, SDTypography } from "@snickerdoodlelabs/shared-components";
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
          <SDButton onClick={onClick} variant="outlined">
            {buttonText}
          </SDButton>
        </Box>
      </Box>
    </Grid>
  );
};

export default WalletProviderItem;
