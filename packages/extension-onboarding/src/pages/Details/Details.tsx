import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import { useStyles } from "@extension-onboarding/pages/Details/Details.style";
import OnChainInfo from "@extension-onboarding/pages/Details/screens/OnChainIfo";
import PersonalInfo from "@extension-onboarding/pages/Details/screens/PersonalInfo";
import { Box, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { useLocation } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const screens = {
  "on-chain": 1,
  profile: 0,
  rewards: 2,
};

const Details = () => {
  const { search } = useLocation();
  const classes = useStyles();
  const screen = new URLSearchParams(search).get("screen");

  const [currentScreenIndex, setCurrentScreenIndex] = React.useState(
    screen != undefined && screens[screen] != undefined ? screens[screen] : 0,
  );
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentScreenIndex(newValue);
  };
  return (
    <Box pt={8} px={15} className={classes.container}>
      <img src={snickerDoodleLogo} />
      <Box mb={5}>
        <Tabs value={currentScreenIndex} onChange={handleChange}>
          <Tab disableTouchRipple label="Personal Info" />
          <Tab disableTouchRipple label="On-chain Info" />
          <Tab disableTouchRipple label="Rewards" />
        </Tabs>
      </Box>
      <TabPanel value={currentScreenIndex} index={0}>
        <PersonalInfo />
      </TabPanel>
      <TabPanel value={currentScreenIndex} index={1}>
        <OnChainInfo />
      </TabPanel>
      <TabPanel value={currentScreenIndex} index={2}></TabPanel>
    </Box>
  );
};

export default Details;
