import browserHistoryIcon from "@extension-onboarding/assets/icons/browser-history.png";
import countryIcon from "@extension-onboarding/assets/icons/country.png";
import dappsIcon from "@extension-onboarding/assets/icons/dapps.png";
import discordIcon from "@extension-onboarding/assets/icons/discord.png";
import dobIcon from "@extension-onboarding/assets/icons/dob.png";
import nftsIcon from "@extension-onboarding/assets/icons/nft.png";
import tickIcon from "@extension-onboarding/assets/icons/tick-primary.png";
import tokensIcon from "@extension-onboarding/assets/icons/tokens.png";
import transactionsIcon from "@extension-onboarding/assets/icons/transactions.png";
import genderIcon from "@extension-onboarding/assets/icons/gender.png";
import {
  PERMISSION_NAMES,
  UI_SUPPORTED_PERMISSIONS,
} from "@extension-onboarding/constants/permissions";
import { Box, Tooltip, Typography } from "@material-ui/core";
import { EWalletDataType } from "@snickerdoodlelabs/objects";
import React, { FC, Fragment } from "react";

const PERMISSIONS: Partial<
  Record<
    EWalletDataType,
    { name: string; icon: string; dataType: EWalletDataType }
  >
> = {
  [EWalletDataType.Gender]: {
    name: PERMISSION_NAMES[EWalletDataType.Gender],
    icon: genderIcon,
    dataType: EWalletDataType.Gender,
  },
  [EWalletDataType.Age]: {
    name: PERMISSION_NAMES[EWalletDataType.Age],
    icon: dobIcon,
    dataType: EWalletDataType.Age,
  },
  [EWalletDataType.Location]: {
    name: PERMISSION_NAMES[EWalletDataType.Location],
    icon: countryIcon,
    dataType: EWalletDataType.Location,
  },
  [EWalletDataType.SiteVisits]: {
    name: PERMISSION_NAMES[EWalletDataType.SiteVisits],
    icon: browserHistoryIcon,
    dataType: EWalletDataType.SiteVisits,
  },
  [EWalletDataType.EVMTransactions]: {
    name: PERMISSION_NAMES[EWalletDataType.EVMTransactions],
    icon: transactionsIcon,
    dataType: EWalletDataType.EVMTransactions,
  },
  [EWalletDataType.AccountBalances]: {
    name: PERMISSION_NAMES[EWalletDataType.AccountBalances],
    icon: tokensIcon,
    dataType: EWalletDataType.AccountBalances,
  },
  [EWalletDataType.AccountNFTs]: {
    name: PERMISSION_NAMES[EWalletDataType.AccountNFTs],
    icon: nftsIcon,
    dataType: EWalletDataType.AccountNFTs,
  },
  [EWalletDataType.Discord]: {
    name: PERMISSION_NAMES[EWalletDataType.Discord],
    icon: discordIcon,
    dataType: EWalletDataType.Discord,
  },
};

interface IPermissionsProps {
  displayType: "row" | "column";
  onClick?: (permission: EWalletDataType) => void;
  rowItemProps?: {
    width: number;
    mr: number;
  };
  permissions?: EWalletDataType[];
}

const Permissions: FC<IPermissionsProps> = ({
  displayType,
  permissions = [],
  onClick = (permission: EWalletDataType) => {},
  rowItemProps = {
    width: 20,
    mr: 1,
  },
}) => {
  const itemsToRender = () => {
    if (displayType === "row") {
      return (
        <Box display="flex" flexWrap="wrap">
          {Array.from(new Set(permissions)).map((permission, index) => (
            <Fragment key={index}>
              {!!PERMISSIONS[permission] ? (
                <Box style={{ cursor: "pointer" }}>
                  <Box mr={1}>
                    <Tooltip title={PERMISSIONS[permission]!.name}>
                      <img
                        width={rowItemProps.width}
                        src={PERMISSIONS[permission]!.icon}
                      />
                    </Tooltip>
                  </Box>
                </Box>
              ) : null}
            </Fragment>
          ))}
        </Box>
      );
    }
    if (displayType === "column") {
      return UI_SUPPORTED_PERMISSIONS.map((permission, index) => {
        const isSelected = permissions.includes(
          PERMISSIONS[permission]!.dataType,
        );
        return (
          <Box
            bgcolor="#F2F2F8"
            border={`1px solid ${isSelected ? "#C5C1DD" : "transparent"}`}
            {...(isSelected && {
              boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.043)",
            })}
            borderRadius={8}
            key={index}
            display="flex"
            alignItems="center"
            mb={2}
            py={0.5}
            px={1.25}
            style={{ cursor: "pointer" }}
            onClick={() => {
              onClick(PERMISSIONS[permission]!.dataType);
            }}
          >
            <Box display="flex" alignItems="center">
              <img width={27} src={PERMISSIONS[permission]!.icon} />
              <Box ml={1.25}>
                <Typography
                  style={{
                    fontFamily: "'Roboto'",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "20px",
                    color: "#262626",
                  }}
                >
                  {PERMISSIONS[permission]!.name}
                </Typography>
              </Box>
            </Box>
            {isSelected && (
              <Box ml="auto">
                <img width={12} src={tickIcon} />
              </Box>
            )}
          </Box>
        );
      });
    }
    return null;
  };

  return <>{itemsToRender()}</>;
};

export default Permissions;
