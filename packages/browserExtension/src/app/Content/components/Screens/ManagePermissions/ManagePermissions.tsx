import Button from "@app/Content/components/Button";
import BasicModal from "@app/Content/components/Modals/BasicModal";
import { useStyles } from "@app/Content/components/Screens/ManagePermissions/ManagePermissions.style";
import Switch from "@app/Content/components/Switch";
import { ExternalCoreGateway } from "@app/coreGateways";
import { Box, FormControlLabel, Typography } from "@material-ui/core";
import { EWalletDataType } from "@snickerdoodlelabs/objects";
import React, { useEffect, useState, FC } from "react";

const PERMISSION_NAMES = {
  [EWalletDataType.Gender]: "Gender",
  [EWalletDataType.Birthday]: "Birthday",
  [EWalletDataType.Location]: "Location",
  [EWalletDataType.SiteVisits]: "Sites Visited",
  [EWalletDataType.EVMTransactions]: "Transaction History",
  [EWalletDataType.AccountBalances]: "Token Balances",
  [EWalletDataType.AccountNFTs]: "NFTs",
  // [EWalletDataType.LatestBlockNumber]: "Latest Block Number",
};

const PERMISSIONS = [
  {
    title: "Web2 Data",
    dataTypes: [
      EWalletDataType.Gender,
      EWalletDataType.Birthday,
      EWalletDataType.Location,
      EWalletDataType.SiteVisits,
    ],
  },
  {
    title: "Web3 Data",
    dataTypes: [
      EWalletDataType.EVMTransactions,
      EWalletDataType.AccountBalances,
      EWalletDataType.AccountNFTs,
      // EWalletDataType.LatestBlockNumber,
    ],
  },
];

interface IManagePermissionsProps {
  emptyReward: () => void;
  coreGateway: ExternalCoreGateway;
  onSaveClick: (dataTypes: EWalletDataType[]) => void;
}

const ManagePermissions: FC<IManagePermissionsProps> = ({
  emptyReward,
  coreGateway,
  onSaveClick,
}: IManagePermissionsProps) => {
  const [permissionForm, setPermissionForm] = useState<EWalletDataType[]>([]);
  const classes = useStyles();
  useEffect(() => {
    coreGateway.getDefaultPermissions().map((permissions) => {
      setPermissionForm(permissions.filter((item) => !!PERMISSION_NAMES[item]));
    });
  }, []);
  return (
    <>
      <BasicModal
        title="Manage Your Data  Permissions"
        onCloseButtonClick={emptyReward}
        content={
          <>
            <Box>
              <Typography className={classes.contentSubtitle}>
                Choose your data permissions to control what information you
                share.
              </Typography>
            </Box>
            <Box mt={4} display="flex">
              {PERMISSIONS.map((item, index) => {
                return (
                  <Box
                    display="flex"
                    flexDirection="column"
                    flex={1}
                    key={index}
                  >
                    <Box mb={2}>
                      <Typography className={classes.sectionTitle}>
                        {item.title}
                      </Typography>
                    </Box>
                    {item.dataTypes.map((dataType, index) => {
                      return (
                        <Box key={index}>
                          <FormControlLabel
                            className={classes.switchLabel}
                            control={
                              <Switch
                                checked={permissionForm.includes(dataType)}
                                value={permissionForm.includes(dataType)}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    setPermissionForm([
                                      ...(permissionForm ?? []),
                                      dataType,
                                    ]);
                                  } else {
                                    setPermissionForm(
                                      permissionForm?.filter(
                                        (_dataType) => _dataType != dataType,
                                      ),
                                    );
                                  }
                                }}
                              />
                            }
                            label={PERMISSION_NAMES[dataType]}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
            <Box mt={4} display="flex">
              <Box marginLeft="auto">
                <Button
                  buttonType="primary"
                  onClick={() => {
                    onSaveClick(permissionForm);
                  }}
                >
                  Save & Claim Reward
                </Button>
              </Box>
            </Box>
          </>
        }
      />
    </>
  );
};

export default ManagePermissions;
