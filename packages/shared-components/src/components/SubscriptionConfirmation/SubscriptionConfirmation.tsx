import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Divider,
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import { AccountIdentIcon } from "@shared-components/components/AccountIdentIcon";
import { AccountsCard } from "@shared-components/components/AccountsCard";
import { Button } from "@shared-components/components/Button";
import { Carousel } from "@shared-components/components/Carousel";
import { useStyles } from "@shared-components/components/SubscriptionConfirmation/SubscriptionConfirmation.style";
import {
  PERMISSION_NAMES,
  PERMISSION_TEXT_NAMES,
} from "@shared-components/constants/permissions";
import { getAccountAddressText } from "@shared-components/utils/AccountAddressUtils";
import {
  AccountAddress,
  EVMContractAddress,
  EWalletDataType,
  PossibleReward,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import React, { useEffect, FC, useState } from "react";

interface ISubscriptionConfirmationProps {
  campaignImage: string;
  eligibleRewards: PossibleReward[];
  missingRewards: PossibleReward[];
  dataTypes: EWalletDataType[];
  campaignName: string;
  consentAddress: EVMContractAddress;
  onCloseClick: () => void;
  onConfirmClick: (receivingAccount: AccountAddress | undefined) => void;
  ipfsBaseUrl: string;
  getReceivingAddress: (
    consentAddress: EVMContractAddress,
  ) => ResultAsync<AccountAddress, unknown>;
  accounts: AccountAddress[];
}

export const SubscriptionConfirmation: FC<ISubscriptionConfirmationProps> = ({
  campaignImage,
  eligibleRewards,
  missingRewards,
  dataTypes,
  campaignName,
  consentAddress,
  onCloseClick,
  onConfirmClick,
  ipfsBaseUrl,
  getReceivingAddress,
  accounts,
}) => {
  const [receivingAccount, setReceivingAccount] = useState<AccountAddress>();
  const [expandAccounts, setExpandAccounts] = useState<boolean>(false);

  const getPermissionsText = () => {
    let arr: string[];
    if (dataTypes) {
      arr = (dataTypes as EWalletDataType[]).reduce((acc, dataType) => {
        const name = PERMISSION_NAMES[dataType] as string;
        if (name) {
          acc = [...acc, name];
        }
        return acc;
      }, [] as string[]);
    } else {
      arr = Object.values(PERMISSION_TEXT_NAMES);
    }

    return arr.length > 1 ? (
      <>
        <span>{arr.slice(0, -1).join(", ")}</span> and{" "}
        <span>{arr.slice(-1)[0]}</span>
      </>
    ) : (
      <span>{arr[0]}</span>
    );
  };

  useEffect(() => {
    getRecievingAccount();
  }, []);

  const getRecievingAccount = () => {
    getReceivingAddress(consentAddress).map(setReceivingAccount);
  };
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 5,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 5,
    },
  };
  const classes = useStyles();
  return (
    <>
      <Box
        display="flex"
        mb={4}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography
          className={classes.title}
        >{`Subscribe to ${campaignName} Rewards Program`}</Typography>
        <IconButton
          disableFocusRipple
          disableRipple
          disableTouchRipple
          aria-label="close"
          onClick={onCloseClick}
        >
          <CloseIcon style={{ fontSize: 24 }} />
        </IconButton>
      </Box>
      <>
        <Box alignItems="center" display="flex">
          <Box mr={4}>
            <img
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: "50%",
              }}
              src={campaignImage}
            />
          </Box>
          <Box>
            <Box mb={4}>
              <Typography className={classes.content}>
                <span className={classes.subtitle}>Subscription:</span>
                {` ${campaignName} rewards`}
              </Typography>
            </Box>
            <Typography className={classes.content}>
              <span className={classes.subtitle}>Price: </span>
              {getPermissionsText()}
            </Typography>
          </Box>
        </Box>
        <Box my={3} display="flex" width="100%" borderTop="1px solid #F2F2F8" />
        <Box mb={2}>
          <Typography className={classes.subtitle}>
            Rewards Confirmation
          </Typography>
          <Typography className={classes.content}>
            It may take a few moments for your rewards to process and appear in
            your Data Wallet.
          </Typography>
        </Box>
        <Carousel responsive={responsive}>
          {eligibleRewards.map((eligibleReward) => (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              border="1px solid rgba(22, 22, 26, 0.08)"
              borderRadius={16}
              p={0.75}
              mb={0.5}
              mr={1.5}
              key={JSON.stringify(eligibleReward)}
            >
              <img
                style={{
                  width: "100%",
                  aspectRatio: "108 / 90",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
                src={`${ipfsBaseUrl}${eligibleReward.image}`}
              />
              <Box mt={1.5}>
                <Typography className={classes.rewardTitle}>
                  {eligibleReward.name}
                </Typography>
              </Box>
            </Box>
          ))}
        </Carousel>
        {missingRewards.length > 0 && (
          <>
            <Box mt={2} />
            <Divider />
            <Box mb={1.5} />
            <Typography className={classes.subtitle}>Missed Rewards</Typography>
            <Typography className={classes.content} style={{ color: "#D32F2F" }}>
              Attention: You won't get a chance to earn these rewards again. You
              can change your data permission setting to get this reward.
            </Typography>
            <Box mt={2} />
            <Carousel responsive={responsive}>
              {missingRewards.map((missingRewards) => (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  border="1px solid #D32F2F"
                  p={0.75}
                  mr={1.5}
                  mb={0.5}
                  borderRadius={16}
                  key={JSON.stringify(missingRewards)}
                >
                  <Box width="100%" display="flex">
                    <img
                      style={{
                        width: "100%",
                        aspectRatio: "108 / 90",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                      src={`${ipfsBaseUrl}${missingRewards.image}`}
                    />
                  </Box>
                  <Box mt={1.5}>
                    <Typography className={classes.rewardTitle}>
                      {missingRewards.name}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Carousel>
          </>
        )}
        <Box py={2} mt={2} border="1px solid #C5C1DD" bgcolor="#F2F2F8">
          <Box
            onClick={() => {
              setExpandAccounts(!expandAccounts);
            }}
            style={{ cursor: "pointer" }}
          >
            <Collapse in={!expandAccounts}>
              <Box
                mb={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box mr={2}>
                  <Typography className={classes.accountInfoText}>
                    Your current receiving account:
                  </Typography>
                </Box>
                {receivingAccount && (
                  <Box display="flex" alignItems="center">
                    <AccountIdentIcon
                      accountAddress={receivingAccount}
                      size={17}
                    />
                    <Box ml={1}>
                      <Typography className={classes.account}>
                        {getAccountAddressText(receivingAccount)}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Collapse>
            <Box
              px={3}
              mb={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box flex={1} alignItems="center">
                <Typography className={classes.changeRecievingAccountText}>
                  Change Receiving Account
                </Typography>
              </Box>
              <Box ml="auto">
                {expandAccounts ? (
                  <KeyboardArrowUp style={{ color: "#8079B4" }} />
                ) : (
                  <KeyboardArrowDown style={{ color: "#8079B4" }} />
                )}
              </Box>
            </Box>
          </Box>
          <Box>
            <Collapse in={expandAccounts}>
              <AccountsCard
                receivingAddress={receivingAccount}
                accounts={accounts}
                onSelect={(account) => {
                  setReceivingAccount(account);
                  setExpandAccounts(false);
                }}
              />
            </Collapse>
          </Box>
        </Box>

        <Box mt={4} display="flex">
          <Box marginLeft="auto" mr={1}>
            <Button
              buttonType="secondary"
              onClick={() => {
                onCloseClick();
              }}
            >
              Cancel
            </Button>
          </Box>

          <Button
            buttonType="primary"
            onClick={() => {
              onConfirmClick(receivingAccount);
            }}
          >
            Confirm
          </Button>
        </Box>
      </>
    </>
  );
};
