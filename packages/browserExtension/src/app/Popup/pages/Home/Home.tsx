import { SPA_PATHS } from "@app/Popup/constants";
import LinkCard from "@app/Popup/pages/Home/components/LinkCard";
import { useStyles } from "@app/Popup/pages/Home/Home.style";
import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";
import Browser from "webextension-polyfill";

const Home: FC = () => {
  const classes = useStyles();
  return (
    <>
      <Box px={3} display="flex" flexDirection="column">
        <Box>
          <Box mt={1.5}>
            <Typography className={classes.title}>
              Welcome to Your Data Wallet
            </Typography>
          </Box>
          <Box mt={1}>
            <LinkCard
              navigateTo={SPA_PATHS.rewardsMarketplace}
              icon={Browser.runtime.getURL("assets/icons/portfolio.svg")}
              title="Rewards Martketplace"
            />
            <LinkCard
              navigateTo={SPA_PATHS.dashboard}
              icon={Browser.runtime.getURL("assets/icons/rewards.svg")}
              title="My Data Dashboard"
            />
            <LinkCard
              navigateTo={SPA_PATHS.settings}
              icon={Browser.runtime.getURL("assets/icons/settings.svg")}
              title="Settings"
            />
            <Box mt={3} width="100%">
              <img
                style={{ width: "100%", height: "auto" }}
                src={Browser.runtime.getURL("assets/img/home-bottom.svg")}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
