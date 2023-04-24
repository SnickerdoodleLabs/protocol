import AccountIdentIcon from "@synamint-extension-sdk/content/components/AccountIdentIcon";
import Radio from "@synamint-extension-sdk/content/components/Radio";
import { useStyles } from "@synamint-extension-sdk/content/components/Screens/RewardCard/RewardCard.style";
import { EAPP_STATE, IRewardItem } from "@synamint-extension-sdk/content/constants";
import { ExternalCoreGateway } from "@synamint-extension-sdk/gateways";
import {
  Box,
  Typography,
  Dialog,
  IconButton,
  Button,
  Collapse,
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import { IInvitationDomainWithUUID } from "@synamint-extension-sdk/shared/interfaces/actions";
import {
  AccountAddress,
  EVMContractAddress,
  LinkedAccount,
  UUID,
} from "@snickerdoodlelabs/objects";
import React, { useEffect, useState } from "react";
import Browser from "webextension-polyfill";
interface IRewardCardProps {
  emptyReward: () => void;
  acceptInvitation: () => void;
  rejectInvitation: () => void;
  changeAppState: (state: EAPP_STATE) => void;
  rewardItem: IRewardItem;
  invitationDomain: IInvitationDomainWithUUID | undefined;
  coreGateway: ExternalCoreGateway;
}

const RewardCard: React.FC<IRewardCardProps> = ({
  emptyReward,
  changeAppState,
  acceptInvitation,
  rewardItem,
  invitationDomain,
  coreGateway,
}: IRewardCardProps) => {
  const classes = useStyles();
  const [accounts, setAccounts] = useState<LinkedAccount[]>();
  const [receivingAccount, setReceivingAccount] = useState<AccountAddress>();
  const [expandAccounts, setExpandAccounts] = useState<boolean>(false);

  useEffect(() => {
    getAccounts();
    getRecievingAccount(invitationDomain!.consentAddress!);
  }, []);

  const getAccounts = () => {
    coreGateway.getAccounts().map((linkedAccounts) => {
      setAccounts(linkedAccounts);
    });
  };

  const getRecievingAccount = (contractAddress: EVMContractAddress) => {
    coreGateway.getReceivingAddress(contractAddress).map(setReceivingAccount);
  };

  const setReceivingAccountForConsent = (accountAddress) => {
    setExpandAccounts(false);
    coreGateway
      .setReceivingAddress(invitationDomain!.consentAddress!, accountAddress)
      .map(() => {
        getRecievingAccount(invitationDomain!.consentAddress!);
      });
  };

  const onPrimaryButtonClick = () => {
    coreGateway.getApplyDefaultPermissionsOption().map((option) => {
      if (option) {
        acceptInvitation();
        return;
      }
      changeAppState(EAPP_STATE.PERMISSION_SELECTION);
    });
  };

  const onSecondaryButtonClick = () => {
    coreGateway.rejectInvitation(invitationDomain?.id as UUID).map(() => {
      emptyReward();
    });
  };

  return (
    <Dialog
      PaperProps={{
        square: true,
      }}
      open={true}
      disablePortal
    >
      <Box width={480} bgcolor="#FDF3E1">
        <Box bgcolor="#F8D798">
          <Box display="flex" justifyContent="space-between">
            <Box pt={3} pl={4}>
              <img
                width="auto"
                height={20}
                src="https://storage.googleapis.com/dw-assets/extension/sdl-horizontal-logo.svg"
              />
            </Box>
            <Box>
              <IconButton
                disableFocusRipple
                disableRipple
                disableTouchRipple
                aria-label="close"
                onClick={emptyReward}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={0.75}
            mb={2}
          >
            <Box>
              <img width="auto" height={145} src={rewardItem.image} />
            </Box>
            <Box
              padding="3px 12px"
              bgcolor="rgba(255, 255, 255, 0.5)"
              borderRadius={4}
              mt={0.75}
              mb={2}
            >
              <Typography variant="body1" align="center">
                {rewardItem.rewardName}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box mb={14} display="flex" flexDirection="column">
          <Box display="flex" flexDirection="column" px={8} pt={4} mb={2}>
            <Typography className={classes.title} variant="h4" align="center">
              {rewardItem.title}
            </Typography>
            <Typography
              className={classes.description}
              variant="body1"
              align="center"
            >
              {rewardItem.description}
            </Typography>
          </Box>
          <Box px={6} mb={3} display="flex" justifyContent="space-between">
            <Button
              variant="text"
              className={classes.secondaryButton}
              onClick={onSecondaryButtonClick}
            >
              {rewardItem.secondaryButtonText}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={onPrimaryButtonClick}
              className={classes.primaryButton}
            >
              {rewardItem.primaryButtonText}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 17 16"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="square"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
                className={classes.primaryButtonIcon}
              >
                <path d="M1.808 14.535 14.535 1.806" className="arrow-body" />
                <path
                  d="M3.379 1.1h11M15.241 12.963v-11"
                  className="arrow-head"
                />
              </svg>
            </Button>
          </Box>
        </Box>
        <Box
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: "white",
          }}
          boxShadow="0px -17px 10px -8px rgba(0,0,0,0.05)"
        >
          <Box
            onClick={() => {
              setExpandAccounts(!expandAccounts);
            }}
            style={{ cursor: "pointer" }}
          >
            <Box
              bgcolor="#FEF6E7"
              py={1}
              px={5}
              display="flex"
              alignItems="center"
            >
              <Typography className={classes.accountInfoText}>
                Your current recieving address
              </Typography>
              {receivingAccount && (
                <>
                  <AccountIdentIcon
                    size={17}
                    accountAddress={receivingAccount}
                  />
                  <Typography className={classes.account}>
                    {receivingAccount.slice(0, 5)} ................
                    {receivingAccount.slice(-4)}
                  </Typography>
                </>
              )}
            </Box>
            <Box py={1} px={6} display="flex" flexDirection="column">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-end"
              >
                <Typography className={classes.changeRecievingAccountText}>
                  Change Receiving Account
                </Typography>
                {expandAccounts ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </Box>
              <Typography className={classes.changeAccountDescription}>
                Select the account where you would like to receive your reward.
              </Typography>
            </Box>
          </Box>
          <Collapse in={expandAccounts}>
            <Box maxHeight={400} overflow="auto">
              {accounts?.map((account, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  pl={3.75}
                  py={2}
                  {...(index % 2 === 0 && {
                    bgcolor: "#F2F2F8",
                  })}
                >
                  <AccountIdentIcon
                    accountAddress={account.sourceAccountAddress}
                  />
                  <Typography className={classes.accountAddressText}>
                    {account.sourceAccountAddress.slice(0, 5)} ................
                    {account.sourceAccountAddress.slice(-4)}
                  </Typography>
                  <Box
                    marginLeft="auto"
                    px={5}
                    alignItems="center"
                    display="flex"
                  >
                    <Radio
                      checked={
                        account.sourceAccountAddress === receivingAccount
                      }
                      onClick={() =>
                        setReceivingAccountForConsent(
                          account.sourceAccountAddress,
                        )
                      }
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Dialog>
  );
};

export default RewardCard;
