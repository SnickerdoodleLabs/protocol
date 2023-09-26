import {
  EVMContractAddress,
  EWalletDataType,
  IOpenSeaMetadata,
  ISnickerdoodleCore,
  PossibleReward,
} from "@snickerdoodlelabs/objects";
import { AcnowledgmentBanner } from "@core-iframe/app/ui/components/AcknowledgmentBanner";
import { CloseButton } from "@core-iframe/app/ui/components/CloseButton";
import { permissions } from "@core-iframe/app/ui/constants";
import {
  Box,
  Typography,
  Button,
  Grid,
  Switch,
  useTheme,
  ITheme,
  defaultDarkTheme,
  useMedia,
} from "@core-iframe/app/ui/lib";
import React, { FC, useState, useMemo, useEffect } from "react";
import { IFrameConfig } from "@core-iframe/interfaces/objects";

interface IPermissionSelectionProps {
  onCancelClick: () => void;
  onSaveClick: (dataTypes: EWalletDataType[]) => void;
  core: ISnickerdoodleCore;
  invitationData: IOpenSeaMetadata;
  consentAddress: EVMContractAddress;
  coreConfig: IFrameConfig;
}
export const PermissionSelection: FC<IPermissionSelectionProps> = ({
  onSaveClick,
  onCancelClick,
  invitationData,
  core,
  consentAddress,
  coreConfig,
}) => {
  const [dataTypes, setDataTypes] = React.useState<EWalletDataType[]>(
    permissions.map((item) => item.key),
  );

  const theme = useTheme<ITheme>() || defaultDarkTheme;
  const media = useMedia();
  const isMobile = useMemo(() => media === "xs", [media]);
  const [possibleRewards, setPossibleRewards] = useState<PossibleReward[]>([]);
  const [rewardsLoading, setRewardsLoading] = useState<boolean>(true);

  useEffect(() => {
    getPossibleRewards();
  }, []);

  const getPossibleRewards = () => {
    core.marketplace
      .getPossibleRewards([consentAddress])
      .map((rewards) => {
        setPossibleRewards(rewards.get(consentAddress) || []);
        setRewardsLoading(false);
      })
      .mapErr((e) => {
        setRewardsLoading(false);
      });
  };

  const updateDataTypes = (key: EWalletDataType) => {
    if (dataTypes.includes(key)) {
      setDataTypes(dataTypes.filter((item) => item != key));
    } else {
      setDataTypes([...dataTypes, key]);
    }
  };
  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      bg={theme.palette.background}
      m="auto"
      p={isMobile ? 3 : 4}
      width={isMobile ? "calc(95% - 48px)" : "60%"}
      overflow="auto"
      borderRadius={isMobile ? 12 : 0}
      justifyContent="center"
    >
      <Box
        display="flex"
        flexDirection="column"
        width={isMobile ? "100%" : "45%"}
        {...(!isMobile && { pr: 1, alignItems: "center", textAlign: "center" })}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography variant="title">
            Unlock Exclusive NFTs With Your Data
          </Typography>
          {isMobile && <CloseButton onClick={onCancelClick} />}
        </Box>
        <Box
          width="-webkit-fill-available"
          display="flex"
          justifyContent="center"
          mt={isMobile ? 3 : 12}
          mb={isMobile ? 3 : 8}
        >
          <img
            style={{
              width: "40%",
              height: "auto",
              aspectRatio: 2 / 3,
              objectFit: "cover",
            }}
            src={invitationData.nftClaimedImage}
          />
        </Box>
        {!isMobile && (
          <Typography variant="bodyBold">
            {invitationData.rewardName}
          </Typography>
        )}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        width={isMobile ? "100%" : "55%"}
        {...(!isMobile && { pl: 1 })}
        textAlign="left"
      >
        <Typography variant={isMobile ? "title" : "subtitle"}>
          Data Permissions
        </Typography>
        <Box mt={isMobile ? 3 : 0.5} mb={3}>
          <Typography variant="body">
            Share anonymous data and use your on-chain information to generate
            rewards.
            <strong> Snickerdoodle anonymizes & protects your data</strong>, so
            you're in control. Now that's how privacy should be - Goodbye
            Cookies. Hello Snickerdoodle.
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          mb={isMobile ? 3 : 5.5}
          {...(!isMobile && {
            py: 2,
            px: 1.5,
            border: `1px solid ${theme.palette.border}`,
          })}
          width="-webkit-fill-available"
        >
          {permissions.map((item, index) => {
            return (
              <React.Fragment key={item.key}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="title2">{item.name}</Typography>
                  <Switch
                    onChange={() => {
                      updateDataTypes(item.key);
                    }}
                    checked={dataTypes.includes(item.key)}
                  />
                </Box>
                <Box mb={1}>
                  <Typography variant="body">{item.description}</Typography>
                </Box>
                {permissions.length - 1 != index && (
                  <Box width="100%" height={1} bg={theme.palette.border} />
                )}
                <Box mb={1} />
              </React.Fragment>
            );
          })}
        </Box>
        <Grid
          container
          spacing={2}
          {...(isMobile && { flexFlow: "column-reverse" })}
        >
          {!isMobile && (
            <Grid item sm={6}>
              <Button
                onClick={onCancelClick}
                fullWidth
                variant="outlined"
                color="primary"
              >
                Cancel
              </Button>
            </Grid>
          )}
          <Grid item sm={6}>
            <Button
              onClick={() => {
                onSaveClick(dataTypes);
              }}
              fullWidth
              variant="contained"
              color="primary"
            >
              Save & Continue
            </Button>
          </Grid>
        </Grid>
        <AcnowledgmentBanner />
      </Box>
    </Box>
  );
};
