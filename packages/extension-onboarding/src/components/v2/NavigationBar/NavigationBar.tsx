import React, { Fragment, useEffect } from "react";
import sdLogo from "@extension-onboarding/assets/icons/sd-logo-circle.svg";
import HideOnScroll from "@extension-onboarding/components/v2/HideOnScroll";
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  makeStyles,
} from "@material-ui/core";
import {
  VpnKey,
  WorkOutline,
  Settings,
  Menu as MenuIcon,
} from "@material-ui/icons";
import {
  SDTypography,
  colors,
  shadows,
} from "@snickerdoodlelabs/shared-components";
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
    backgroundColor: colors.MAINPURPLE900,
    "& svg": {
      fill: colors.WHITE,
    },
    "& p": {
      color: colors.WHITE,
    },
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
  path: string;
  icon: React.JSX.Element;
  initialSubroutePath?: string;
}
const navigationItems: INavigationItem[] = [
  {
    displayName: "Data Permissions",
    path: "/data-permissions",
    icon: <VpnKey />,
  },
  {
    displayName: "Settings",
    path: "/settings",
    icon: <Settings />,
  },
  {
    displayName: "My Data Dashboard",
    path: "/data-dashboard",
    initialSubroutePath: "/data-dashboard/tokens",
    icon: <WorkOutline />,
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

  const onMobileMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
            <img src={sdLogo} width={48} height={48} />
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
                <IconButton onClick={onMobileMenuClick}>
                  <MenuIcon />
                </IconButton>
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
