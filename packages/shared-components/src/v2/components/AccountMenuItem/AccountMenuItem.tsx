import  Box  from "@material-ui/core/Box";
import { EVMAccountAddress } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";
import { SDTypography } from "@shared-components/v2/components/Typograpy";
import { Image } from "@shared-components/v2/components/Image";
import { abbreviateString } from "@shared-components/utils";

interface IAccountMenuItemProps {
  account: EVMAccountAddress;
}
export const AccountMenuItem: FC<IAccountMenuItemProps> = ({ account }) => {
  return (
    <Box display="flex" alignItems="center" gridGap={13}>
      <Image
        src="https://storage.googleapis.com/dw-assets/shared/icons/eth.png"
        width={21}
        height={21}
      />
      <SDTypography fontWeight="medium" variant="bodyMd" color="inherit">
        {abbreviateString(account, 7, 0, 3)}
      </SDTypography>
    </Box>
  );
};
