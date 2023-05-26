import { Box, Fade, Typography } from "@material-ui/core";
import { AccountIdentIcon } from "@shared-components/components/AccountIdentIcon";
import { useStyles } from "@shared-components/components/AccountsCard/components/AccountCardItem/AccountCardItem.style";
import { Radio } from "@shared-components/components/Radio";
import { getAccountAddressText } from "@shared-components/utils/AccountAddressUtils";
import { AccountAddress } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";
interface IAccountCardItemProps {
  accountAddress: AccountAddress;
  onButtonClick?: () => void;
  buttonText?: string;
  onSelect: () => void;
  isSelected: boolean;
  useBg: boolean;
}

const AccountCardItem: FC<IAccountCardItemProps> = ({
  accountAddress,
  isSelected,
  onSelect,
  useBg,
}: IAccountCardItemProps) => {
  const classes = useStyles();
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  }, [isCopied]);
  return (
    <Box
      display="flex"
      alignItems="center"
      pl={3.75}
      py={2}
      {...(useBg && { bgcolor: "#F2F2F8" })}
    >
      <AccountIdentIcon accountAddress={accountAddress} />
      <Typography className={classes.accountAddressText}>
        {getAccountAddressText(accountAddress)}
      </Typography>
      <img
        onClick={() => {
          navigator.clipboard.writeText(accountAddress.toLocaleLowerCase());
          setIsCopied(true);
        }}
        className={classes.copyIcon}
        src={"https://storage.googleapis.com/dw-assets/shared/icons/copy.svg"}
      />
      <Fade in={isCopied}>
        <Typography>copied</Typography>
      </Fade>
      <Box marginLeft="auto" px={8.5} alignItems="center" display="flex">
        <Radio checked={isSelected} onClick={onSelect} />
      </Box>
    </Box>
  );
};

export default AccountCardItem;
