import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Typography from "@extension-onboarding/components/Typography";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { DashboardContextProvider } from "@extension-onboarding/context/DashboardContext";
import DashboardTitle from "@extension-onboarding/components/v2/DashboardTitle";
import Container from "@extension-onboarding/components/v2/Container";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
const useStyles = makeStyles((theme) => ({
  link: {
    textAlign: "center",
  },
  selected: {
    fontWeight: 700,
  },
  linkWrapper: {
    cursor: "pointer",
  },
}));

interface ILink {
  path: EPaths;
  title: string;
  subTitle?: string;
}

const LINKS: ILink[] = [
  {
    path: EPaths.TRANSACTION_HISTORY,
    title: "Transaction History",
    subTitle:
      "Track your transactions for linked web3 accounts. Stay updated on your token, NFT, and airdrop activity.",
  },
  {
    path: EPaths.TOKENS,
    title: "Tokens",
    subTitle:
      "See your fungible token statistics across your linked web3 accounts.",
  },
  {
    path: EPaths.NFTS,
    title: "NFTs",
    subTitle: "See the NFTs you own across all of your linked web3 accounts.",
  },
  { path: EPaths.POAP_NFTS, title: "POAPs" },
  {
    path: EPaths.BROWSER_ACTIVITY,
    title: "Browser Activity",
    subTitle: "See which sites you are spending the most time on.",
  },
  {
    path: EPaths.SOCIAL_MEDIA_DATA,
    title: "Social Media Data",
    subTitle:
      "Share what kinds of Discord channels you are subscribed to. No one will ever know your discord handle.",
  },
  // { path: EPaths.PERSONAL_INFO, title: "Personal Info" },
];

const DataDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();

  const navContainerRef = React.useRef(null);

  React.useEffect(() => {
    if (navContainerRef.current) {
      // Find the selected link element by its path
      const selectedLinkElement = navContainerRef.current.querySelector(
        `[data-path="${location.pathname}"]`,
      );

      if (selectedLinkElement) {
        // Scroll to the selected link element's position within the container
        navContainerRef.current.scrollLeft =
          selectedLinkElement.offsetLeft - navContainerRef.current.offsetLeft;
      }
    }
  }, [location.pathname]);

  return (
    <Box style={{ background: "#FAFAFA" }}>
      {/* TODO: DELETE */}
      {/*       <Typography variant="pageTitle">My Data Dashboard</Typography>
      <Box mt={1}>
        <Typography variant="pageDescription">
          The dashboard is your command center. View, manage, and monetize your
          information from linked accounts. Link new accounts for more rewards.
          No one can see or access your personal Data Wallet information but
          you.
        </Typography>
      </Box> */}
      <Box>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 8,
            width: "100%",
            height: 68,
            boxShadow:
              "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)",
            background: "#FAFAFA",
            overflowX: "auto",
            overflowY: "hidden",
          }}
          ref={navContainerRef}
        >
          {LINKS.map((link) => (
            <Box
              mt={4}
              mb={3}
              className={classes.linkWrapper}
              key={link.path}
              data-path={link.path} // Add a data attribute with the link path
              onClick={() => {
                navigate(link.path);
              }}
              style={{ whiteSpace: "nowrap" }} // Add this style
            >
              <Box px={4} mb={1}>
                <SDTypography
                  variant="titleSm"
                  fontWeight="medium"
                  className={clsx(classes.link, {
                    [classes.selected]: location.pathname === link.path,
                  })}
                >
                  {link.title}
                </SDTypography>
              </Box>
              <Box
                display="flex"
                width="80%"
                margin="auto"
                height="1px"
                bgcolor={
                  location.pathname === link.path ? "black" : "transparent"
                }
              />
            </Box>
          ))}
        </div>
      </Box>
      <Container>
        <DashboardTitle
          title={
            LINKS.find((link) => link.path === location.pathname)?.title ?? ""
          }
          description={
            LINKS.find((link) => link.path === location.pathname)?.subTitle ??
            ""
          }
        />

        <DashboardContextProvider>
          <Outlet />
        </DashboardContextProvider>
      </Container>
    </Box>
  );
};

export default DataDashboardLayout;
