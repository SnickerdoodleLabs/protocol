// @TODO move EAlertSeverity to objects
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { PERMS } from "@extension-onboarding/constants/permissionsV2";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Hidden,
  Switch,
  SwitchClassKey,
  SwitchProps,
  Theme,
  createStyles,
  makeStyles,
  withStyles,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Skeleton } from "@material-ui/lab";
import {
  EVMContractAddress,
  EWalletDataType,
  IOpenSeaMetadata,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import {
  SDButton,
  SDTypography,
  colors,
} from "@snickerdoodlelabs/shared-components";
import clsx from "clsx";
import React, { useEffect, useRef, useState, FC, useCallback } from "react";

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}
const CustomSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: 10,
      width: 44,
      height: 24,
      padding: 0,
    },
    switchBase: {
      padding: 2,
      "&$checked": {
        transform: "translateX(20px)",
        color: theme.palette.common.white,
        "& + $track": {
          backgroundColor: colors.MAINPURPLE900,
          opacity: 1,
          border: "none",
        },
      },
      "&$focusVisible $thumb": {},
    },
    thumb: {
      width: 20,
      height: 20,
      backgroundColor: colors.WHITE,
    },
    track: {
      borderRadius: 12,
      backgroundColor: colors.MAINPURPLE50,
      border: `0.5px solid ${colors.MAINPURPLE100}`,
      opacity: 1,
    },
    checked: {},
    focusVisible: {},
  }),
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const useStyles = makeStyles((theme) => ({
  accordionRoot: {
    border: `1px solid ${theme.palette.borderColor}`,
    transition: "border 0.2s ease-in-out",
    borderRadius: "8px !important",
    "&:before": {
      display: "none",
    },
  },
  warn: {
    border: `1px solid ${colors.SUNRISE100}`,
    transition: "all 0.2s ease-in-out",
  },
  accordion: {
    "& .MuiPaper-rounded": {
      boxShadow: "none",
    },
    "& .MuiAccordionDetails-root": {
      padding: 0,
      paddingLeft: 32,
      paddingRight: 32,
    },
    "& .MuiAccordionSummary-root": {
      flexDirection: "row-reverse",
      padding: 0,
      paddingLeft: 32,
      paddingRight: 32,
    },
    "& .MuiIconButton-edgeEnd": {
      margin: 0,
      padding: 0,
      marginRight: 24,
      "& .Mui-expanded": {
        marginRight: 24,
        margin: 0,
        padding: 0,
      },
    },
    "& .MuiAccordionSummary-content": {
      alignItems: "center",
      marginRight: 0,
      "& .Mui-expanded": {
        margin: 0,
        marginRight: 0,
      },
    },
  },
}));

interface IAudienceItemProps {
  contractAddress: EVMContractAddress;
  ipfsCID: IpfsCID;
}
const AudienceItem: FC<IAudienceItemProps> = ({
  ipfsCID,
  contractAddress,
}: IAudienceItemProps) => {
  const classes = useStyles();
  const { sdlDataWallet } = useDataWalletContext();

  const lastSetPermissions = useRef<EWalletDataType[]>();
  const [metadata, setMetadata] = useState<IOpenSeaMetadata>();
  const [permissions, setPermissions] = useState<EWalletDataType[]>();
  const [saveRequired, setSaveRequired] = useState<boolean>(false);
  const { setAlert } = useNotificationContext();
  const { setLoadingStatus } = useLayoutContext();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    if (permissions) {
      if (!lastSetPermissions.current) {
        lastSetPermissions.current = permissions;
      } else {
        if (permissions.length !== lastSetPermissions.current.length) {
          setSaveRequired(true);
        } else {
          if (
            Array.from(new Set(permissions.concat(lastSetPermissions.current)))
              .length !== permissions.length
          ) {
            setSaveRequired(true);
          } else {
            setSaveRequired(false);
          }
        }
      }
    }
  }, [permissions]);

  const onSaveClick = useCallback(() => {
    if (!lastSetPermissions.current) {
      return;
    }
    if (!permissions) {
      return;
    }
    const dataTypeDiff = [
      ...new Set([...permissions, ...lastSetPermissions.current]),
    ].filter(
      (item) =>
        permissions.includes(item) !==
        (lastSetPermissions.current || []).includes(item),
    );
    setLoadingStatus(true);
    sdlDataWallet
      .updateAgreementPermissions(contractAddress, dataTypeDiff)
      .map(() => {
        setSaveRequired(false);
        setLoadingStatus(false);
        lastSetPermissions.current = permissions;
        setAlert({
          severity: EAlertSeverity.SUCCESS,
          message: "Data Permissions updated successfully.",
        });
      })
      .mapErr((err) => {
        console.log(err);
        setAlert({
          severity: EAlertSeverity.ERROR,
          message: "Error updating data permissions!",
        });
        setLoadingStatus(false);
      });
  }, [permissions]);

  const getInitialData = () => {
    return sdlDataWallet
      .getInvitationMetadataByCID(ipfsCID)
      .andThen((metadata) => {
        setMetadata(metadata);
        return sdlDataWallet
          .getAgreementPermissions(contractAddress)
          .map((permissions) => {
            setPermissions(permissions);
          })
          .mapErr((err) => {
            console.log(err);
          });
      });
  };

  return (
    <Accordion
      expanded={isExpanded}
      onChange={() => {
        setIsExpanded(!isExpanded);
      }}
      classes={{
        root: clsx(classes.accordionRoot, saveRequired && classes.warn),
      }}
      elevation={0}
      className={classes.accordion}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <SDTypography variant="titleMd" color="textHeading" fontWeight="medium">
          {!metadata ? <Skeleton width={100} /> : metadata.rewardName}
        </SDTypography>
        <Box ml="auto" />
        {saveRequired ? (
          <SDButton
            onClick={(e) => {
              e.stopPropagation();
              onSaveClick();
            }}
            color="warn"
          >
            Apply Changes
          </SDButton>
        ) : (
          <SDButton
            onClick={(e) => {
              e.stopPropagation();
            }}
            variant="outlined"
          >
            Manage
          </SDButton>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {PERMS.map((permission, index) => {
            return (
              <Box key={permission.key}>
                <Box
                  mb={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <SDTypography
                      variant="titleSm"
                      fontWeight="medium"
                      color="textHeading"
                    >
                      {permission.name}
                    </SDTypography>
                    <Hidden xsDown>
                      <Box mt={1}>
                        <SDTypography variant="titleXs" color="textBody">
                          {permission.description}
                        </SDTypography>
                      </Box>
                    </Hidden>
                  </Box>
                  <CustomSwitch
                    onClick={() => {
                      permissions?.includes(permission.key)
                        ? setPermissions((p) =>
                            p?.filter((perm) => perm !== permission.key),
                          )
                        : setPermissions((p) => [...(p ?? []), permission.key]);
                    }}
                    checked={
                      permissions ? permissions.includes(permission.key) : false
                    }
                  />
                </Box>
                {index !== PERMS.length - 1 && (
                  <>
                    <Divider />
                    <Box mt={2} />
                  </>
                )}
              </Box>
            );
          })}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default AudienceItem;
