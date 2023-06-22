import { Box, Tooltip as MUITooltip, withStyles } from "@material-ui/core";
import { PERMISSIONS_WITH_ICONS } from "@shared-components/constants/permissions";
import { EWalletDataType } from "@snickerdoodlelabs/objects";
import React, { FC, Fragment } from "react";

const Tooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#8079B4",
    color: "white",
    maxWidth: 210,
    padding: 4,
    fontSize: 12,
    fontFamily: "Roboto",
    fontWeight: 400,
    lineHeight: "16px",
    borderRadius: 4,
  },
}))(MUITooltip);

interface IPermissionsProps {
  onClick?: (permission: EWalletDataType) => void;
  rowItemProps?: {
    width: number;
    mr: number;
  };
  permissions?: EWalletDataType[];
}

export const Permissions: FC<IPermissionsProps> = ({
  permissions = [],
  rowItemProps = {
    width: 20,
    mr: 1,
  },
}) => {
  const itemsToRender = () => {
    return (
      <Box display="flex" flexWrap="wrap">
        {Array.from(new Set(permissions)).map((permission, index) => (
          <Fragment key={index}>
            {!!PERMISSIONS_WITH_ICONS[permission] ? (
              <Box style={{ cursor: "pointer" }}>
                <Box mr={1}>
                  <Tooltip
                    PopperProps={{ disablePortal: true }}
                    title={PERMISSIONS_WITH_ICONS[permission]!.name}
                  >
                    <img
                      width={rowItemProps.width}
                      src={PERMISSIONS_WITH_ICONS[permission]!.icon}
                    />
                  </Tooltip>
                </Box>
              </Box>
            ) : null}
          </Fragment>
        ))}
      </Box>
    );
  };

  return <>{itemsToRender()}</>;
};


