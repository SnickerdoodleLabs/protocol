import { Box, Grid, Hidden, Theme, useTheme } from "@material-ui/core";
import {
  SDTypography,
  SDButton,
  SDSwitch,
  CloseButton,
  AcnowledgmentBanner,
} from "@shared-components/v2/components";
import { FF_SUPPORTED_PERMISSIONS } from "@shared-components/v2/constants";
import { useMedia } from "@shared-components/v2/hooks";
import { EWalletDataType, IOpenSeaMetadata } from "@snickerdoodlelabs/objects";
import React, { FC, useMemo } from "react";

interface IPermissionSelectionProps {
  onCancelClick: () => void;
  onSaveClick: (dataTypes: EWalletDataType[]) => void;
}
export const PermissionSelectionWidget: FC<IPermissionSelectionProps> = ({
  onSaveClick,
  onCancelClick,
}) => {
  const [dataTypes, setDataTypes] = React.useState<EWalletDataType[]>(
    FF_SUPPORTED_PERMISSIONS.map((item) => item.key),
  );

  const theme = useTheme<Theme>();
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
      flexDirection="column"
      bgcolor="cardBgColor"
      m="auto"
      p={{ xs: 3, sm: 4 }}
      pt={{ xs: 3, sm: 8 }}
      width={{ xs: "calc(95% - 48px)", sm: "40%" }}
      borderRadius={{ xs: 12, sm: 0 }}
      justifyContent="center"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <SDTypography variant={isMobile ? "displaySm" : "titleXl"}>
          Data Permissions
        </SDTypography>
        {isMobile && <CloseButton onClick={onCancelClick} />}
      </Box>
      <Box mt={isMobile ? 3 : 0.5} mb={3}>
        <SDTypography variant="bodyMd">
          Share anonymous data and use your on-chain information to generate
          rewards.
          <strong> Snickerdoodle anonymizes & protects your data</strong>, so
          you're in control. Now that's how privacy should be - Goodbye Cookies.
          Hello Snickerdoodle.
        </SDTypography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        mb={{ xs: 3, sm: 5.5 }}
        py={{ xs: 2, sm: 0 }}
        px={{ xs: 1.5, sm: 0 }}
        border={{ xs: `1px solid ${theme.palette.borderColor}`, sm: "none" }}
      >
        {FF_SUPPORTED_PERMISSIONS.map((item, index) => {
          return (
            <React.Fragment key={item.key}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <SDTypography variant="titleMd" fontWeight="medium">
                  {item.name}
                </SDTypography>
                <SDSwitch
                  onChange={() => {
                    updateDataTypes(item.key);
                  }}
                  checked={dataTypes.includes(item.key)}
                />
              </Box>
              <Box mb={1}>
                <SDTypography variant="bodyMd">{item.description}</SDTypography>
              </Box>
              {FF_SUPPORTED_PERMISSIONS.length - 1 != index && (
                <Box
                  width="100%"
                  height={1}
                  bgcolor={theme.palette.borderColor}
                />
              )}
              <Box mb={1} />
            </React.Fragment>
          );
        })}
      </Box>
      <Grid container spacing={2}>
        <Hidden xsDown>
          <Grid item sm={6}>
            <SDButton
              onClick={onCancelClick}
              fullWidth
              variant="outlined"
              color="primary"
            >
              Cancel
            </SDButton>
          </Grid>
        </Hidden>

        <Grid item xs={12} sm={6}>
          <SDButton
            onClick={() => {
              onSaveClick(dataTypes);
            }}
            fullWidth
            variant="contained"
            color="button"
          >
            Save & Continue
          </SDButton>
        </Grid>
      </Grid>
      <AcnowledgmentBanner />
    </Box>
  );
};
