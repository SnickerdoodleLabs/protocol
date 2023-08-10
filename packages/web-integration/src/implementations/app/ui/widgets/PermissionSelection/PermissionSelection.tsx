import {
  Typography,
  Box,
  Divider,
  Grid,
  Button,
  Switch,
} from "@material-ui/core";
import { EWalletDataType } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IPermissionSelectionProps {
  onCancelClick: () => void;
  onRejectClick: () => void;
  onSaveClick: (dataTypes: EWalletDataType[]) => void;
}

const permissions = [
  {
    description: `On-chain transaction history, such as the kinds of dApps you've used in the past and how often you use them`,
    key: EWalletDataType.EVMTransactions,
    name: "Transaction History",
  },
  {
    description: "Fungible tokens you own across different blockchain networks",
    key: EWalletDataType.AccountBalances,
    name: "Token Balances",
  },
  {
    description:
      "NFT projects you interact with and/or currently own accross different blockchain networks",
    key: EWalletDataType.AccountNFTs,
    name: "NFTs",
  },
];

export const PermissionSelection: FC<IPermissionSelectionProps> = ({
  onSaveClick,
  onRejectClick,
  onCancelClick,
}) => {
  const [dataTypes, setDataTypes] = React.useState<EWalletDataType[]>(
    permissions.map((item) => item.key),
  );

  const updateDataTypes = (key: EWalletDataType) => {
    if (dataTypes.includes(key)) {
      setDataTypes(dataTypes.filter((item) => item != key));
    } else {
      setDataTypes([...dataTypes, key]);
    }
  };
  return (
    <>
      <Typography variant="h3" color="textPrimary">
        Data Permissions
      </Typography>
      <Box mt={0.5} mb={3}>
        <Typography variant="body1" color="textPrimary">
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
        mb={5.5}
        px={1.5}
        py={2}
        borderColor="secondary.main"
        border="1px solid"
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
                <Typography variant="h2" color="textPrimary">
                  {item.name}
                </Typography>
                <Switch
                  onClick={() => {
                    updateDataTypes(item.key);
                  }}
                  checked={dataTypes.includes(item.key)}
                />
              </Box>
              <Box mb={1}>
                <Typography variant="body1" color="textPrimary">
                  {item.description}
                </Typography>
              </Box>
              {permissions.length - 1 != index && (
                <Divider style={{ width: "100%" }} />
              )}
              <Box mb={1} />
            </React.Fragment>
          );
        })}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Button
            onClick={onCancelClick}
            fullWidth
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            onClick={onRejectClick}
            fullWidth
            variant="outlined"
            color="primary"
          >
            Reject
          </Button>
        </Grid>
        <Grid item xs={4}>
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
    </>
  );
};
