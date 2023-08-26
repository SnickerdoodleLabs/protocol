import { EWalletDataType, PageInvitation } from "@snickerdoodlelabs/objects";
import { AcnowledgmentBanner } from "@web-integration/implementations/app/ui/components/AcknowledgmentBanner/index.js";
import { CloseButton } from "@web-integration/implementations/app/ui/components/CloseButton/index.js";
import { permissions } from "@web-integration/implementations/app/ui/constants.js";
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
} from "@web-integration/implementations/app/ui/lib/index.js";
import React, { FC, useMemo } from "react";

interface IPermissionSelectionProps {
  onCancelClick: () => void;
  onSaveClick: (dataTypes: EWalletDataType[]) => void;
  pageInvitation: PageInvitation;
}
export const PermissionSelection: FC<IPermissionSelectionProps> = ({
  onSaveClick,
  onCancelClick,
  pageInvitation,
}) => {
  const [dataTypes, setDataTypes] = React.useState<EWalletDataType[]>(
    permissions.map((item) => item.key),
  );

  const theme = useTheme<ITheme>() || defaultDarkTheme;
  const media = useMedia();
  const isMobile = useMemo(() => media === "xs", [media]);

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
          <Typography variant="title">Share Data & Get This NFT!</Typography>
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
            src={pageInvitation.domainDetails.nftClaimedImage}
          />
        </Box>
        {!isMobile && (
          <Typography variant="bodyBold">
            {pageInvitation.domainDetails.rewardName}
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
            Shape the future of web3! Share anonymous data with brands and use
            your on-chain data (tokens, NFTs, dApps) for a personalized
            experience. You're not just enhancing your journey, but also
            pioneering digital innovation. Learn more about this unique
            opportunity.
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
