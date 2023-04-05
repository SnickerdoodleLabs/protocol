import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { memo, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";

const useStyles = makeStyles((theme) => ({
  subtitle: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    color: "#232039",
  },
  title: {
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "38px",
    color: "#101828",
  },
  link: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "28px",
    textAlign: "center",
    color: "#000000",
  },
  linkWrapper: {
    cursor: "pointer",
  },
}));

interface ILink {
  path: EPaths;
  title: string;
}

const LINKS: ILink[] = [
  { path: EPaths.TOKENS, title: "Tokens" },
  { path: EPaths.NFTS, title: "NFTs" },
  { path: EPaths.BROWSER_ACTIVITY, title: "Browser Activity" },
  { path: EPaths.SOCIAL_MEDIA_DATA, title: "Social Media Data" },
  { path: EPaths.PERSONAL_INFO, title: "Personal Info" },
];

const DataDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <>
      <Typography className={classes.title}>My Data Dashboard</Typography>
      <Box mt={2}>
        <Typography className={classes.subtitle}>
          The dashboard is your command center. View, manage, and monetize your
          information from linked accounts. Link new accounts for more rewards.
          No one can see or access your personal Data Wallet information but
          you.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center">
        {LINKS.map((link) => (
          <Box
            mt={4}
            mb={3}
            className={classes.linkWrapper}
            key={link.path}
            onClick={() => {
              navigate(link.path);
            }}
          >
            <Box px={4} mb={1}>
              <Typography className={classes.link}>{link.title}</Typography>
            </Box>
            <Box
              display="flex"
              width="100%"
              height="3px"
              bgcolor={
                location.pathname === link.path ? "black" : "transparent"
              }
            />
          </Box>
        ))}
      </Box>
      <Outlet />
    </>
  );
};

export default DataDashboardLayout;
