import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Hidden,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Skeleton } from "@material-ui/lab";
import { SDButton } from "@shared-components/v2/components/Button";
import { SDSwitch } from "@shared-components/v2/components/Switch";
import { SDTypography } from "@shared-components/v2/components/Typograpy";
import { CONSENT_SETTINGS_PERMISSIONS } from "@shared-components/v2/constants";
import { useAccordionStyles } from "@shared-components/v2/styles/accordion.style";
import { colors } from "@shared-components/v2/theme/theme";
import {
  EVMContractAddress,
  EWalletDataType,
  IOldUserAgreement,
  IUserAgreement,
  IpfsCID,
  ProxyError,
  URLString,
} from "@snickerdoodlelabs/objects";
import clsx from "clsx";
import { ResultAsync } from "neverthrow";
import React, {
  useEffect,
  useRef,
  useState,
  FC,
  useCallback,
  useMemo,
} from "react";

interface IContractInfo {
  metadata: IOldUserAgreement | IUserAgreement;
  urls: URLString[];
}
interface IAudienceItemProps {
  contractAddress: EVMContractAddress;
  ipfsCID: IpfsCID;
  getDetails: () => ResultAsync<
    [IOldUserAgreement | IUserAgreement, URLString[]],
    ProxyError | unknown
  >;
  getPermissions: () => ResultAsync<EWalletDataType[], ProxyError | unknown>;
  onManageClick: (
    metadata: IOldUserAgreement | IUserAgreement,
    url: URLString[],
  ) => void;
  onUpdateClick: (
    permissionDiff: EWalletDataType[],
  ) => ResultAsync<void, ProxyError | unknown>;
  switchColor?: string;
}

export const AudienceItem: FC<IAudienceItemProps> = ({
  getDetails,
  getPermissions,
  onUpdateClick,
  onManageClick,
  switchColor,
}: IAudienceItemProps) => {
  const classes = useAccordionStyles();
  const lastSetPermissions = useRef<EWalletDataType[]>();
  const [contractInfo, setContractInfo] = useState<IContractInfo>();
  const [permissions, setPermissions] = useState<EWalletDataType[]>();
  const [saveRequired, setSaveRequired] = useState<boolean>(false);
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
    onUpdateClick(dataTypeDiff)
      .map(() => {
        setSaveRequired(false);
        lastSetPermissions.current = permissions;
      })
      .mapErr((err) => {
        console.log(err);
      });
  }, [permissions]);

  const getInitialData = () => {
    getDetails()
      .andThen(([metadata, urls]) => {
        setContractInfo({ metadata, urls });
        return getPermissions()
          .map((permissions) => {
            setPermissions(permissions);
          })
          .mapErr((err) => {
            console.log(err);
          });
      })
      .mapErr((err) => {
        console.log("Error getting contract initial data", err);
      });
  };

  useEffect(() => {
    if (!contractInfo) {
      return;
    }
    getURLVerificationStatuses();
  }, [contractInfo]);

  const getURLVerificationStatuses = useCallback(() => {
    if (!contractInfo?.urls?.length) {
      return;
    }
    const urls = contractInfo.urls;
    // todo get verification status for each url
  }, [contractInfo?.urls?.length]);

  const title = useMemo(() => {
    if (!contractInfo) {
      return <Skeleton width={100} />;
    }
    if (contractInfo.urls.length) {
      return (
        <Box display="flex">
          {contractInfo.urls.map((url, index) => {
            return (
              <SDTypography
                key={index}
                variant="titleMd"
                color="textHeading"
                fontWeight="medium"
              >
                {url}
              </SDTypography>
            );
          })}
        </Box>
      );
    }
    if (contractInfo.metadata["attributes"]) {
      return (
        <SDTypography variant="titleMd" color="textHeading" fontWeight="medium">
          {(contractInfo.metadata as IUserAgreement).name}
        </SDTypography>
      );
    }
    return (
      <SDTypography variant="titleMd" color="textHeading" fontWeight="medium">
        {(contractInfo.metadata as IOldUserAgreement).title}
      </SDTypography>
    );
  }, [JSON.stringify(contractInfo)]);

  return (
    <Accordion
      expanded={isExpanded}
      onChange={() => {
        setIsExpanded(!isExpanded);
      }}
      classes={{
        root: clsx(classes.accordionRoot),
      }}
      elevation={0}
      className={classes.accordion}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "unset", sm: "center" }}
          width="100%"
        >
          {title}
          <Box ml="auto" mt={{ xs: 3, sm: "unset" }} />
          {saveRequired ? (
            <Box display="flex" alignItems="center">
              <SDButton
                onClick={(e) => {
                  e.stopPropagation();
                  setPermissions(lastSetPermissions.current);
                }}
                variant="outlined"
              >
                Discard
              </SDButton>
              <Box ml={2} />
              <SDButton
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveClick();
                }}
              >
                Apply
              </SDButton>
            </Box>
          ) : (
            <SDButton
              onClick={(e) => {
                e.stopPropagation();
                onManageClick(contractInfo!.metadata, contractInfo!.urls);
              }}
              variant="outlined"
            >
              Manage
            </SDButton>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {CONSENT_SETTINGS_PERMISSIONS.map((permission, index) => {
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
                  <SDSwitch
                    {...(switchColor && {
                      bgColor: switchColor,
                    })}
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
                {index !== CONSENT_SETTINGS_PERMISSIONS.length - 1 && (
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
