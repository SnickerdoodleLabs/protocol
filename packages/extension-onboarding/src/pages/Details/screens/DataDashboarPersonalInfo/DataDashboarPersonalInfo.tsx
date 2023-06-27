import Switch from "@extension-onboarding/components/Switch";
import Typography from "@extension-onboarding/components/Typography";
import { countries } from "@extension-onboarding/constants/countries";
import { useAppContext } from "@extension-onboarding/context/App";
import usePermissionSettingsLogic from "@extension-onboarding/hooks/usePermissionSettingsLogic";
import { useStyles } from "@extension-onboarding/pages/Details/screens/DataDashboarPersonalInfo/DataDashboarPersonalInfo.style";
import { PII } from "@extension-onboarding/services/interfaces/objects";
import { Box } from "@material-ui/core";
import { EWalletDataType } from "@snickerdoodlelabs/objects";
import React, { useEffect, useState } from "react";

interface IProfileItem {
  dataSelector: string;
  title: string;
  dataType: EWalletDataType;
}

const PROFILE_ITEMS: IProfileItem[] = [
  { dataSelector: "age", dataType: EWalletDataType.Age, title: "Age" },
  { dataSelector: "gender", dataType: EWalletDataType.Gender, title: "Gender" },
  {
    dataSelector: "country_code",
    dataType: EWalletDataType.Location,
    title: "Country",
  },
];

export default () => {
  const classes = useStyles();
  const {} = useAppContext();
  const { dataWalletGateway } = useAppContext();
  const [values, setValues] = useState<PII>(new PII());
  const { permissionForm, addPermission, removePermission } =
    usePermissionSettingsLogic();

  useEffect(() => {
    getDataProfileInfo();
  }, []);
  const getDataProfileInfo = () => {
    dataWalletGateway.profileService.getProfile().map((profileInfo) => {
      setValues(profileInfo);
    });
  };

  return (
    <>
      {PROFILE_ITEMS.map((item, index) => (
        <Box
          key={index}
          borderRadius={8}
          px={1.5}
          py={1}
          mb={2}
          bgcolor="#FAFAFA"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Box mb={0.5}>
              <Typography className={classes.itemTitle}>
                {item.title}
              </Typography>
            </Box>
            <Typography className={classes.itemValue}>
              {item.dataSelector === "country_code" && values[item.dataSelector]
                ? countries.find(
                    (country) => country.code === values[item.dataSelector],
                  )?.name ?? "-"
                : values[item.dataSelector] ?? "-"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mr={2}>
            <Switch
              checked={permissionForm.includes(item.dataType)}
              value={permissionForm.includes(item.dataType)}
              onChange={(event) => {
                if (event.target.checked) {
                  addPermission(item.dataType);
                } else {
                  removePermission(item.dataType);
                }
              }}
            />
            <Typography
              className={classes.itemTitle}
              style={{
                visibility: permissionForm.includes(item.dataType)
                  ? "visible"
                  : "hidden",
              }}
            >
              Rented
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
};
