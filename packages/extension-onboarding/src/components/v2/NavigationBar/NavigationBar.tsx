import mobileMenu from "@extension-onboarding/assets/icons/mobile-menu.svg";
import sdLogo from "@extension-onboarding/assets/icons/sd-logo-circle.svg";
import HideOnScroll from "@extension-onboarding/components/v2/HideOnScroll";
import {
  DashboardIcon,
  DataPermissionIcon,
  SettingIcon,
} from "@extension-onboarding/components/v2/Icons";
import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import {
  AppBar,
  Box,
  Hidden,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  makeStyles,
} from "@material-ui/core";
import {
  SDTypography,
  colors,
  shadows,
} from "@snickerdoodlelabs/shared-components";
import React, { Fragment, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
  appbar: {
    boxShadow: shadows.sm,
  },
  toolbar: {
    backgroundColor: colors.MAINPURPLE50,
  },
  item: {
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: colors.MAINPURPLE100,
    },
    backgroundColor: "transparent",
    "& svg": {
      fill: colors.MAINPURPLE900,
    },
    "& p": {
      color: colors.MAINPURPLE900,
    },
  },
  itemActive: {
    transition: "all 0.75s ease-in-out",
    backgroundColor: colors.MAINPURPLE900,
    "& svg": {
      fill: colors.WHITE,
    },
    "& p": {
      color: colors.WHITE,
    },
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
    "& .MuiMenu-list": {},
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
    displayName: "Data Permissions",
    path: EPathsV2.DATA_PERMISSIONS,
    icon: <DataPermissionIcon />,
  },
  {
    displayName: "Settings",
    path: EPathsV2.SETTINGS,
    icon: <SettingIcon />,
  },
  {
    displayName: "My Data Dashboard",
    path: "" as EPathsV2,
    initialSubroutePath: EPathsV2.TRANSACTION_HISTORY,
    icon: <DashboardIcon />,
  },
];

const NavigationBar = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  useEffect(() => {
    const index = navigationItems.findIndex((item) =>
      location.pathname.includes(item.path),
    );
    setActiveIndex(index);
  }, [location.pathname]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onMobileMenuClick = (event: React.MouseEvent<HTMLImageElement>) => {
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
      <HideOnScroll>
        <AppBar className={classes.appbar}>
          <Toolbar className={classes.toolbar}>
            <img
              src={sdLogo}
              width={48}
              height={48}
              onClick={() => {
                navigate(EPathsV2.DATA_PERMISSIONS);
              }}
              className={classes.pointer}
            />
            <Box ml="auto" display="flex">
              <Hidden xsDown>
                {navigationItems.map((item, index) => (
                  <Fragment key={index}>
                    <Box
                      onClick={() => handleClick(item)}
                      alignItems="center"
                      display="flex"
                      borderRadius={8}
                      px={1.5}
                      py={0.75}
                      className={
                        index === activeIndex
                          ? classes.itemActive
                          : classes.item
                      }
                    >
                      <Box display="flex" alignItems="center">
                        {item.icon}
                        <Box mr={1.5} />
                        <SDTypography variant="bodyMd" fontWeight="medium">
                          {item.displayName}
                        </SDTypography>
                      </Box>
                    </Box>
                    <Box ml={3} />
                  </Fragment>
                ))}
              </Hidden>
              <Hidden smUp>
                <img onClick={onMobileMenuClick} src={mobileMenu} width={40} />
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
                        className={
                          index === activeIndex
                            ? classes.itemActive
                            : classes.item
                        }
                      >
                        {item.icon}
                        <Box mr={1.5} />
                        <SDTypography variant="bodyMd" fontWeight="medium">
                          {item.displayName}
                        </SDTypography>
                      </Box>
                    </MenuItem>
                  ))}
                </Menu>
              </Hidden>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
};

export default NavigationBar;
