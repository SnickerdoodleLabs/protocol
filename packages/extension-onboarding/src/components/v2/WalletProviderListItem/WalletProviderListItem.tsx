import { Box } from "@material-ui/core";
import { SDButton, SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

interface IWalletProviderListItemProps {
  label: string;
  icon: string;
  onClick: () => void;
  buttonText?: string;
}

const WalletProviderListItem: FC<IWalletProviderListItemProps> = ({
  label,
  icon,
  onClick,
  buttonText = "Link Account",
}) => {
  return (
    <Box
      mt={3}
      display="flex"
      alignItems="center"
      border="1px solid"
      borderColor="borderColor"
      p={{ xs: 1.5, sm: 3 }}
      borderRadius={12}
    >
      <img src={icon} width={40} />
      <Box ml={2}>
        <SDTypography variant="bodyLg" color="textHeading" fontWeight="medium">
          {label}
        </SDTypography>
      </Box>
      <Box display="flex" marginLeft="auto">
        <SDButton variant="outlined" onClick={onClick}>
          {buttonText}
        </SDButton>
      </Box>
    </Box>
  );
};

export default WalletProviderListItem;
