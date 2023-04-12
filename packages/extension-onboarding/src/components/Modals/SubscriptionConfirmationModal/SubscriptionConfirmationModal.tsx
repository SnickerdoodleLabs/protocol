import AccountIdentIcon from "@extension-onboarding/components/AccountIdentIcon";
import AccountsCard from "@extension-onboarding/components/AccountsCard";
import Button from "@extension-onboarding/components/Button";
import { useStyles } from "@extension-onboarding/components/Modals/SubscriptionConfirmationModal/SubscriptionConfirmationModal.style";
import {
  PERMISSION_NAMES,
  PERMISSION_TEXT_NAMES,
} from "@extension-onboarding/constants/permissions";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  Box,
  Dialog,
  Typography,
  IconButton,
  Grid,
  Collapse,
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import {
  AccountAddress,
  EWalletDataType,
  PossibleReward,
} from "@snickerdoodlelabs/objects";
import React, { useEffect, FC, useState } from "react";

declare const window: IWindowWithSdlDataWallet;

const SubscriptionConfirmationModal: FC = () => {
  const { apiGateway } = useAppContext();
  const { modalState, closeModal } = useLayoutContext();
  const [receivingAccount, setReceivingAccount] = useState<AccountAddress>();
  const [expandAccounts, setExpandAccounts] = useState<boolean>(false);
  const {
    onPrimaryButtonClick,
    customProps: {
      campaignImage,
      eligibleRewards,
      dataTypes,
      campaignName,
      consentAddress,
    } = {},
  } = modalState;

  useEffect(() => {
    getRecievingAccount();
  }, []);

  const getRecievingAccount = () => {
    window.sdlDataWallet
      .getReceivingAddress(consentAddress)
      .map(setReceivingAccount);
  };

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

  const classes = useStyles();

  return (
    <Dialog
      PaperProps={{
        square: true,
      }}
      open={true}
      disablePortal
      maxWidth="sm"
      fullWidth
      className={classes.container}
    >
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
          onClick={() => {
            closeModal();
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <>
        <Box alignItems="center" display="flex">
          <Box mr={4}>
            <img
              style={{
                width: 188,
                height: 188,
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
            Rewards Confirmarion
          </Typography>
          <Typography>
            It may take a few moments for your rewards to process and appear in
            your Data Wallet.
          </Typography>
        </Box>
        <Grid spacing={2} container>
          {(eligibleRewards as PossibleReward[]).map((eligibleReward) => (
            <Grid item xs={6}>
              <Box
                display="flex"
                alignItems="center"
                key={eligibleReward.queryCID}
              >
                <Box mr={1.5}>
                  <img
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                    src={`${apiGateway.config.ipfsFetchBaseUrl}${eligibleReward.image}`}
                  />
                </Box>
                <Box>
                  <Box mb={1}>
                    <Typography className={classes.rewardTitle}>
                      {eligibleReward.name}
                    </Typography>
                  </Box>
                  <Typography className={classes.rewardDescription}>
                    {eligibleReward.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
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
                        {receivingAccount.slice(0, 5)} ................
                        {receivingAccount.slice(-4)}
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
                closeModal();
              }}
            >
              Cancel
            </Button>
          </Box>

          <Button
            buttonType="primary"
            onClick={() => {
              onPrimaryButtonClick(receivingAccount);
              closeModal();
            }}
          >
            Confirm
          </Button>
        </Box>
      </>
    </Dialog>
  );
};

export default SubscriptionConfirmationModal;
