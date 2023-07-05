import Typography from "@extension-onboarding/components/Typography";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { DashboardContextProvider } from "@extension-onboarding/context/DashboardContext";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  link: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "28px",
    textAlign: "center",
    color: "#000000",
  },
  selected: {
    fontWeight: 400,
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
  { path: EPaths.POAP_NFTS, title: "POAPs" },
  { path: EPaths.BROWSER_ACTIVITY, title: "Browser Activity" },
  { path: EPaths.SOCIAL_MEDIA_DATA, title: "Social Media Data" },
  // { path: EPaths.PERSONAL_INFO, title: "Personal Info" },
];

const DataDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <>
      <Typography variant="pageTitle">My Data Dashboard</Typography>
      <Box mt={1}>
        <Typography variant="pageDescription">
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
              <Typography
                className={clsx(classes.link, {
                  [classes.selected]: location.pathname === link.path,
                })}
              >
                {link.title}
              </Typography>
            </Box>
            <Box
              display="flex"
              width="100%"
              height="1px"
              bgcolor={
                location.pathname === link.path ? "black" : "transparent"
              }
            />
          </Box>
        ))}
      </Box>
      <DashboardContextProvider>
        <Outlet />
      </DashboardContextProvider>
    </>
  );
};

export default DataDashboardLayout;
