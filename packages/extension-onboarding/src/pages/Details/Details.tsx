import React from "react";
import { useStyles } from "@extension-onboarding/pages/Details/Details.style";
import OnChainInfo from "@extension-onboarding/pages/Details/screens/OnChainIfo";
import PersonalInfo from "@extension-onboarding/pages/Details/screens/PersonalInfo";
import { Box, Tab, Tabs, Typography } from "@material-ui/core";
import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} display="flex" justifyContent="center">
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Details = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box mt={8} px={15} className={classes.container}>
      <img src={snickerDoodleLogo} />
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
      >
        <Tab disableTouchRipple label="Personal Info" {...a11yProps(0)} />
        <Tab disableTouchRipple label="On-chain Info" {...a11yProps(1)} />
        <Tab disableTouchRipple label="Rewards" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <PersonalInfo />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <OnChainInfo />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      ;
    </Box>
  );
};

export default Details;
