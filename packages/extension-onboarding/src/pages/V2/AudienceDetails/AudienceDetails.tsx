import BackButton from "@extension-onboarding/components/BackButton";
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import AccountItem from "@extension-onboarding/components/v2/AccountItem";
import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";
import Container from "@extension-onboarding/components/v2/Container";
import Table, { IColumn } from "@extension-onboarding/components/v2/Table";
import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import {
  Box,
  Divider,
  Container as MuiContainer,
  Radio,
  Tooltip,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  AccountAddress,
  DirectReward,
  EChain,
  ERewardType,
  EVMContractAddress,
  EarnedReward,
  IOldUserAgreement,
  IUserAgreement,
  IpfsCID,
  LazyReward,
  LinkedAccount,
  URLString,
  Web2Reward,
} from "@snickerdoodlelabs/objects";
import {
  SDButton,
  SDTypography,
  getChainImageSrc,
} from "@snickerdoodlelabs/shared-components";
import { ResultUtils } from "neverthrow-result-utils";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

enum EOptedInStatus {
  UNKNOWN,
  OPTED_IN,
  NOT_OPTED_IN,
}

interface IContractInfo {
  metadata: IOldUserAgreement | IUserAgreement;
  urls: URLString[];
}

const AudienceDetails = () => {
  const { consentAddress } = useParams<{
    consentAddress: EVMContractAddress;
  }>();

  const location = useLocation();
  const navigate = useNavigate();
  const [ipfsCID, setIpfsCID] = useState<IpfsCID>();
  const [receivingAccount, setReceivingAccount] = useState<AccountAddress>();
  const {
    optedInContracts,
    linkedAccounts,
    earnedRewards,
    updateOptedInContracts,
    apiGateway,
  } = useAppContext();
  const { sdlDataWallet } = useDataWalletContext();
  const { setAlert } = useNotificationContext();
  const { setModal, setLoadingStatus } = useLayoutContext();
  const [contractInfo, setContractInfo] = useState<IContractInfo>();
  const [contractEarnedRewards, setContractEarnedReward] =
    useState<EarnedReward[]>();

  const userOptedIn = useMemo(() => {
    if (!optedInContracts || !consentAddress) {
      return EOptedInStatus.UNKNOWN;
    }
    return optedInContracts.has(consentAddress)
      ? EOptedInStatus.OPTED_IN
      : EOptedInStatus.NOT_OPTED_IN;
  }, [optedInContracts, consentAddress]);

  const navigateBack = (replace = true) => {
    navigate(EPathsV2.DATA_PERMISSIONS, { replace });
  };

  const getInitialData = () => {
    if (!consentAddress) {
      return navigateBack();
    }
    sdlDataWallet
      .getConsentContractCID(consentAddress)
      .andThen((_ipfsCID) => {
        setIpfsCID(ipfsCID);
        return ResultUtils.combine([
          sdlDataWallet.getInvitationMetadataByCID(_ipfsCID),
          sdlDataWallet.getConsentContractURLs(consentAddress),
        ]).map(([metadata, urls]) => {
          setContractInfo({ metadata, urls });
        });
      })
      .mapErr((err) => {
        console.error(err);
        navigateBack();
      })
      .map(() => {});
  };

  const getReceivingAccount = () => {
    if (!consentAddress) {
      return;
    }
    sdlDataWallet.getReceivingAddress(consentAddress).map((address) => {
      setReceivingAccount(address);
    });
  };

  useEffect(() => {
    if (userOptedIn === EOptedInStatus.OPTED_IN) {
      getReceivingAccount();
    }
  }, [userOptedIn]);

  const routeValidated = useMemo(() => {
    return Boolean(ipfsCID && contractInfo);
  }, [ipfsCID, contractInfo]);

  useEffect(() => {
    if (!routeValidated || earnedRewards.length === 0) {
      return;
    }
    getContractEarnedRewards();
  }, [routeValidated, earnedRewards.length]);

  const getContractEarnedRewards = () => {
    if (!consentAddress) {
      return;
    }
    sdlDataWallet
      .getEarnedRewardsByContractAddress([consentAddress])
      .map((res) => {
        const rewadsMap = res.get(consentAddress);
        if (rewadsMap) {
          const rewardsArr = Array.from(rewadsMap.values()).flat();
          setContractEarnedReward(rewardsArr);
        }
      })
      .mapErr((err) => {
        console.log(err);
      });
  };

  const { directRewards, lazyRewards, web2Rewards } = useMemo(() => {
    if (!contractEarnedRewards) {
      return {
        directRewards: [] as DirectReward[],
        lazyRewards: [] as LazyReward[],
        web2Rewards: [] as Web2Reward[],
      };
    }
    return contractEarnedRewards.reduce(
      (acc, rewardItem) => {
        switch (rewardItem.type) {
          case ERewardType.Direct:
            acc.directRewards = [
              ...acc.directRewards,
              rewardItem as DirectReward,
            ];
            break;
          case ERewardType.Lazy:
            acc.lazyRewards = [...acc.lazyRewards, rewardItem as LazyReward];
            break;
          case ERewardType.Web2:
            acc.web2Rewards = [...acc.web2Rewards, rewardItem as Web2Reward];
            break;
        }
        return acc;
      },
      { directRewards: [], lazyRewards: [], web2Rewards: [] } as {
        directRewards: DirectReward[];
        lazyRewards: LazyReward[];
        web2Rewards: Web2Reward[];
      },
    );
  }, [contractEarnedRewards]);

  console.log({ directRewards }, { lazyRewards }, { web2Rewards });

  useEffect(() => {
    if (
      location.state &&
      location.state._contractInfo &&
      location.state._ipfsCID
    ) {
      setContractInfo(location.state._contractInfo);
      setIpfsCID(location.state._ipfsCID);
    } else {
      getInitialData();
    }
  }, [consentAddress, location.state]);

  const updateReceivingAddress = (address: AccountAddress) => {
    if (!consentAddress) {
      return;
    }

    sdlDataWallet
      .setReceivingAddress(consentAddress, address)
      .map(() => {
        setReceivingAccount(address);
        setAlert({
          severity: EAlertSeverity.SUCCESS,
          message: "Receiving account updated successfully.",
        });
      })
      .mapErr((err) => {
        setAlert({
          severity: EAlertSeverity.ERROR,
          message: "Error updating receiving account!",
        });
      });
  };

  const handleLeaveAudience = () => {
    if (!consentAddress) {
      return;
    }
    setModal({
      modalSelector: EModalSelectors.LEAVE_AUDIENCE_MODAL,
      onPrimaryButtonClick: () => {
        setLoadingStatus(true);
        sdlDataWallet
          .leaveCohort(consentAddress)
          .map(() => {
            setLoadingStatus(false);
            updateOptedInContracts();
            setAlert({
              severity: EAlertSeverity.SUCCESS,
              message: "Unsubscribed successfully.",
            });
          })
          .mapErr(() => {
            setLoadingStatus(false);
            setAlert({
              severity: EAlertSeverity.ERROR,
              message: "Error unsubscribing!",
            });
          });
      },
    });
  };

  const columns = useMemo(() => {
    const columns: IColumn<LinkedAccount>[] = [
      {
        label: "Account Address",
        render: (row: LinkedAccount) => (
          <AccountItem abbreviationSize={3} account={row} />
        ),
      },
      {
        label: "Chain",
        render: (row: LinkedAccount) => (
          <img src={getChainImageSrc(row.sourceChain)} width={40} height={40} />
        ),
        align: "center" as const,
        hideOn: ["xs"],
      },
      {
        label: "Receiving Account",
        align: "right" as const,
        render: (row: LinkedAccount) => {
          const disabled = row.sourceChain != EChain.EthereumMainnet;

          if (disabled) {
            return (
              <Tooltip title="Currently only EVM accounts are selectable as receiving account.">
                <span>
                  <Radio disabled />
                </span>
              </Tooltip>
            );
          }
          return (
            <Radio
              onClick={() => {
                if (row.sourceAccountAddress != receivingAccount) {
                  updateReceivingAddress(row.sourceAccountAddress);
                }
              }}
              checked={row.sourceAccountAddress === receivingAccount}
            />
          );
        },
      },
    ];
    return columns;
  }, [linkedAccounts, receivingAccount]);

  const { title, image } = useMemo(() => {
    if (!contractInfo) {
      return {
        title: <Skeleton width={200} />,
        image: <Skeleton width="100%" height="100%" />,
      };
    }
    const image = (
      <img
        src={(contractInfo.metadata.image || "").replace(
          "ipfs://",
          apiGateway.config.ipfsFetchBaseUrl,
        )}
        style={{
          maxWidth: "100%",
          height: "100%",
          aspectRatio: 1,
          objectFit: "cover",
        }}
      />
    );
    const urls = (
      <>
        {contractInfo.urls.map((url, index) => (
          <Box key={index} display="flex">
            <SDTypography
              variant="bodyLg"
              fontWeight="medium"
              color="textHeading"
            >
              {url}
            </SDTypography>
            {index !== contractInfo.urls.length - 1 && (
              <>
                <Box ml={0.5} />
                <Divider orientation="vertical" flexItem />
                <Box ml={0.5} />
              </>
            )}
          </Box>
        ))}
      </>
    );

    const getTitle = (name: string) => (
      <Box display="flex" alignItems="center">
        <SDTypography variant="headlineSm" fontWeight="medium">
          {name}
        </SDTypography>
        <Box ml={2} />
        {urls}
      </Box>
    );

    if (contractInfo.metadata["attributes"]) {
      return {
        title: getTitle((contractInfo.metadata as IUserAgreement).name || ""),
        image: image,
      };
    }
    return {
      title: getTitle((contractInfo.metadata as IOldUserAgreement).title),
      image: image,
    };
  }, [contractInfo]);

  return (
    <>
      <Box
        width="100%"
        px={{ xs: 2, sm: 4 }}
        pt={1.5}
        pb={3}
        bgcolor={"cardBgColor"}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Box mr={3}>
              <BackButton
                onClick={() => {
                  navigate(-1);
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box width="100%" display="flex" pr={{ xs: 0, sm: 5, md: 8 }}>
          {userOptedIn === EOptedInStatus.OPTED_IN ? (
            <Box ml="auto">
              <SDButton
                onClick={() => {
                  handleLeaveAudience();
                }}
                color="danger"
                variant="outlined"
              >
                Unsubscribe
              </SDButton>
            </Box>
          ) : (
            <Box mt={3.5} />
          )}
        </Box>
        <MuiContainer maxWidth="lg">
          <Box display="flex" alignItems="center" width="100%">
            <Box
              mr={3}
              width={{ xs: 80, sm: 90, md: 100, lg: 140 }}
              height={{ xs: 80, sm: 90, md: 100, lg: 140 }}
            >
              {image}
            </Box>
            <Box>
              <SDTypography
                variant="headlineSm"
                color="textHeading"
                fontWeight="medium"
              >
                {title}
              </SDTypography>
            </Box>
          </Box>
        </MuiContainer>
      </Box>
      <Container>
        <>
          {userOptedIn === EOptedInStatus.OPTED_IN && receivingAccount && (
            <>
              <Box mt={3} />
              <Card>
                <CardTitle
                  title="Your Web3 Accounts"
                  subtitle="Your accounts to receive airdrops from."
                />
                <Box mt={3} />
                <Table columns={columns} data={linkedAccounts} />
              </Card>
            </>
          )}
        </>
      </Container>
    </>
  );
};

export default AudienceDetails;
