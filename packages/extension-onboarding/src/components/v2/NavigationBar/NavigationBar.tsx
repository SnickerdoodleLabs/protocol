import { MobileMenuIcon } from "@extension-onboarding/assets";
import {
  CookieVaultIcon,
  DashboardIcon,
  DataPermissionIcon,
  OffersIcon,
  SettingIcon,
  TrustedBrandsIcon,
} from "@extension-onboarding/components/v2/Icons";
import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ECoreProxyType } from "@snickerdoodlelabs/objects";
import {
  SDTypography,
  colors,
  shadows,
} from "@snickerdoodlelabs/shared-components";
import React, { Fragment, useEffect, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
  appbar: {
    boxShadow: shadows.sm,
  },
  toolbar: {
    backgroundColor: colors.DARKPURPLE500,
    position: "sticky",
    opacity: 1,
    zIndex: 1000,
    top: 0,
  },
  item: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: colors.MAINPURPLE900,
    },
    backgroundColor: "transparent",
  },
  itemActive: {
    backgroundColor: colors.MAINPURPLE800,
  },
  pointer: {
    cursor: "pointer",
  },
  mobileMenu: {
    "& .MuiPaper-root": {
      top: "0 !important",
      left: "40% !important",
      width: "-webkit-fill-available !important",
    },
    "& .MuiMenu-list": {
      backgroundColor: colors.MAINPURPLE900,
    },
    "& .MuiListItem-gutters": {
      all: "unset",
    },
  },
}));
interface INavigationItem {
  displayName: string;
  path: EPathsV2;
  icon: React.JSX.Element;
  initialSubroutePath?: string;
}
const navigationItems: INavigationItem[] = [
  {
    displayName: "Cookie Vault",
    path: EPathsV2.COOKIE_VAULT,
    icon: <CookieVaultIcon color="inherit" />,
  },
  {
    displayName: "Trusted Brands",
    path: EPathsV2.TRUSTED_BRANDS,
    icon: <TrustedBrandsIcon color="inherit" />,
  },
  {
    displayName: "Offers",
    path: EPathsV2.OFFERS,
    icon: <OffersIcon color="inherit" />,
  },
  {
    displayName: "Settings",
    path: EPathsV2.SETTINGS,
    icon: <SettingIcon color="inherit" />,
  },
  {
    displayName: "My Data Dashboard",
    path: EPathsV2.DATA_DASHBOARD,
    initialSubroutePath: EPathsV2.TRANSACTION_HISTORY,
    icon: <DashboardIcon color="inherit" />,
  },
];

const NavigationBar = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = React.useState<number>();

  useEffect(() => {
    const index = navigationItems.findIndex((item) =>
      location.pathname.includes(item.path),
    );
    setActiveIndex(index);
  }, [location.pathname]);

  const [anchorEl, setAnchorEl] = React.useState<
    null | (EventTarget & SVGElement)
  >(null);

  const onMobileMenuClick = (event: React.MouseEvent<SVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = (item: INavigationItem) => {
    if (item.initialSubroutePath) {
      navigate(item.initialSubroutePath);
    } else {
      navigate(item.path);
    }
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <img
          onClick={() => navigate(EPathsV2.HOME)}
          className={classes.pointer}
          src="https://storage.googleapis.com/dw-assets/spa/icons-v2/sdl-circle.svg"
        />
        <Box ml="auto" display="flex">
          <Hidden smDown>
            {navigationItems.map((item, index) => (
              <Fragment key={index}>
                <Box
                  onClick={() => handleClick(item)}
                  alignItems="center"
                  display="flex"
                  borderRadius={8}
                  px={1.5}
                  py={1}
                  className={
                    index === activeIndex ? classes.itemActive : classes.item
                  }
                >
                  <Box color={colors.WHITE} display="flex" alignItems="center">
                    {item.icon}
                    <Box mr={1.5} />
                    <SDTypography
                      color="inherit"
                      variant="bodyMd"
                      fontWeight="medium"
                    >
                      {item.displayName}
                    </SDTypography>
                  </Box>
                </Box>
                <Box ml={3} />
              </Fragment>
            ))}
          </Hidden>
          <Hidden mdUp>
            <MobileMenuIcon
              width={40}
              onClick={(e) => {
                onMobileMenuClick(e);
              }}
            />
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              className={classes.mobileMenu}
            >
              {navigationItems.map((item, index) => (
                <MenuItem key={index} onClick={handleClose}>
                  <Box
                    onClick={() => handleClick(item)}
                    px={1.5}
                    py={0.75}
                    borderRadius={8}
                    mx={1}
                    my={0.75}
                    display="flex"
                    alignItems="center"
                    width="fill-available"
                    color={colors.WHITE}
                    className={
                      index === activeIndex ? classes.itemActive : classes.item
                    }
                  >
                    {item.icon}
                    <Box mr={1.5} />
                    <SDTypography
                      color="inherit"
                      variant="bodyMd"
                      fontWeight="medium"
                    >
                      {item.displayName}
                    </SDTypography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Hidden>
        </Box>
      </Toolbar>
    </>
  );
};

export default memo(NavigationBar);
