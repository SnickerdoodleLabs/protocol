import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import {
  SDTypography,
  SDButton,
  SDSwitch,
  CloseButton,
  AcnowledgmentBanner,
} from "@shared-components/v2/components";
import { FF_SUPPORTED_PERMISSIONS } from "@shared-components/v2/constants";
import { useMedia } from "@shared-components/v2/hooks";
import { EWalletDataType } from "@snickerdoodlelabs/objects";
import React, { FC, useMemo } from "react";

interface IPermissionSelectionProps {
  onCancelClick: () => void;
  onSaveClick: (dataTypes: EWalletDataType[]) => void;
}
export const PermissionSelectionWidget: FC<IPermissionSelectionProps> = ({
  onSaveClick,
  onCancelClick,
}) => {
  const [indexes, setIndexes] = React.useState<number[]>(
    Array.from({ length: FF_SUPPORTED_PERMISSIONS.length }, (_, i) => i),
  );

  const media = useMedia();
  const isMobile = useMemo(() => media === "xs", [media]);

  const updateDataTypes = (key: EWalletDataType) => {
    if (indexes.includes(key)) {
      setIndexes(indexes.filter((item) => item != key));
    } else {
      setIndexes([...indexes, key]);
    }
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor="cardBgColor"
      m="auto"
      p={{ xs: 3, sm: 4 }}
      minWidth={{ xs: "none", sm: "none", md: "680px" }}
      width={{ xs: "calc(95% - 48px)", sm: "70%", md: "40%" }}
      borderRadius={{ xs: 12, sm: 4 }}
      justifyContent="center"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <SDTypography
          variant={isMobile ? "displaySm" : "titleSm"}
          fontWeight="bold"
        >
          Data Permissions
        </SDTypography>
        {isMobile && <CloseButton onClick={onCancelClick} />}
      </Box>
      <Box mt={isMobile ? 3 : 0.75} mb={3}>
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
        py={{ xs: 0, sm: 2 }}
        px={{ xs: 0, sm: 1.5 }}
        border={{ xs: "none", sm: "1px solid" }}
        borderColor={{ sm: "borderColor" }}
        maxHeight={{ xs: "none", sm: "none", md: "40vh" }}
        overflow={{ xs: "none", sm: "none", md: "auto" }}
      >
        {FF_SUPPORTED_PERMISSIONS.map((item, index) => {
          return (
            <React.Fragment key={item.name}>
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
                    updateDataTypes(index);
                  }}
                  checked={indexes.includes(index)}
                />
              </Box>
              <Box mb={1}>
                <SDTypography variant="bodyMd">{item.description}</SDTypography>
              </Box>
              {FF_SUPPORTED_PERMISSIONS.length - 1 != index && <Divider />}
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
              onSaveClick(
                indexes
                  .map((index) => FF_SUPPORTED_PERMISSIONS[index].key)
                  .flat(),
              );
            }}
            fullWidth
            variant="contained"
            color="button"
          >
            Save
          </SDButton>
        </Grid>
      </Grid>
      <AcnowledgmentBanner />
    </Box>
  );
};
