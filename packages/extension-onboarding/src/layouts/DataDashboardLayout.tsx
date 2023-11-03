import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Container from "@extension-onboarding/components/v2/Container";
import DashboardTitle from "@extension-onboarding/components/v2/DashboardTitle";
import { EPathsV2 as EPaths } from "@extension-onboarding/containers/Router/Router.pathsV2";
import { DashboardContextProvider } from "@extension-onboarding/context/DashboardContext";

const useStyles = makeStyles((theme) => ({
  link: {
    textAlign: "center",
  },
  selected: {
    fontWeight: 700,
  },
  linkItemsWrapper: {
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
  },
  linkWrapper: {
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
}));

interface ILink {
  path: EPaths;
  title: string;
  subtitle?: string;
}

const LINKS: ILink[] = [
  {
    path: EPaths.TRANSACTION_HISTORY,
    title: "Transaction History",
    subtitle:
      "Track your transactions for linked web3 accounts. Stay updated on your token, NFT, and airdrop activity.",
  },
  {
    path: EPaths.AIRDROPS,
    title: "Airdrops",
    subtitle:
      "Targeted airdrops you have received through your Snickerdoodle profile to one of your linked web3 accounts.",
  },
  {
    path: EPaths.TOKENS,
    title: "Tokens",
    subtitle:
      "See your fungible token statistics across your linked web3 accounts.",
  },
  {
    path: EPaths.NFTS,
    title: "NFTs",
    subtitle: "See the NFTs you own across all of your linked web3 accounts.",
  },
  {
    path: EPaths.POAP_NFTS,
    title: "POAPs",
    subtitle: "See POAPs you own across all of your linked web3 accounts.",
  },
  {
    path: EPaths.BROWSER_ACTIVITY,
    title: "Browser Activity",
    subtitle: "See which sites you are spending the most time on.",
  },
  {
    path: EPaths.SOCIAL_MEDIA_DATA,
    title: "Social Media Data",
    subtitle:
      "Share what kinds of Discord channels you are subscribed to. No one will ever know your discord handle.",
  },
  {
    path: EPaths.SHOPPING_DATA,
    title: "Shopping Data",
    /* subtitle:
      "Share what kinds of Discord channels you are subscribed to. No one will ever know your discord handle.", */
  },
];

const DataDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();

  const navContainerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (navContainerRef.current) {
      const selectedLinkElement = navContainerRef.current.querySelector(
        `[data-path="${location.pathname}"]`,
      );
      if (selectedLinkElement && selectedLinkElement instanceof HTMLElement) {
        navContainerRef.current.scrollLeft =
          selectedLinkElement.offsetLeft - navContainerRef.current.offsetLeft;
      }
    }
  }, [location.pathname]);

  return (
    <Box style={{ background: "#FAFAFA" }}>
      <Box>
        <div className={classes.linkItemsWrapper} ref={navContainerRef}>
          {LINKS.map((link) => (
            <Box
              mt={4}
              mb={3}
              className={classes.linkWrapper}
              key={link.path}
              data-path={link.path}
              onClick={() => {
                navigate(link.path);
              }}
            >
              <Box px={4} mb={1}>
                <SDTypography
                  variant="titleSm"
                  fontWeight={
                    location.pathname === link.path ? "bold" : "medium"
                  }
                  color={
                    location.pathname === link.path ? "textHeading" : "textBody"
                  }
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
                  location.pathname === link.path
                    ? "textHeading"
                    : "transparent"
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
            LINKS.find((link) => link.path === location.pathname)?.subtitle ??
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
