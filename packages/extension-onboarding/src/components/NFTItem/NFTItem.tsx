import { IEVMBalance, IEVMNFT } from "@snickerdoodlelabs/objects";
import ethereumCircle from "@extension-onboarding/assets/icons/ethereum-circle.svg";
import avaxCircle from "@extension-onboarding/assets/images/avax-circle.png";
import { useStyles } from "@extension-onboarding/components/BalanceItem/BalanceItem.style";
import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";
import { ethers } from "ethers";

export interface INFTItemProps {
  item: IEVMNFT;
}

const NFTItem: FC<INFTItemProps> = ({ item }: INFTItemProps) => {
  const classes = useStyles();
  const test = JSON.parse(item.metadata);

  return (
    <Box display="flex" justifyContent="space-between" mt={2}>
      <Box>
        <img
          style={{ width: "175px", height: "175px" }}
          src={test.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
        />
      </Box>
    </Box>
  );
};
export default NFTItem;
