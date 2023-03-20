import BackButton from "@extension-onboarding/components/BackButton";
import { useStyles } from "@extension-onboarding/components/Breadcrumb/Breadcrumb.style";
import { breadcrumb } from "@extension-onboarding/containers/Router/Router.breadcrumb";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { Box, Typography } from "@material-ui/core";
import React, { Fragment, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface IBreadcrumbProps {
  currentPathName?: string;
}
const Breadcrumb = ({ currentPathName }: IBreadcrumbProps) => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const crumbs = useMemo(() => {
    let current = "";
    return pathname
      .split("/")
      .filter((item) => !!item)
      .map((crumb) => (current += `/${crumb}`));
  }, [pathname, currentPathName]);

  const generateDisplayName = (path: EPaths) => {
    return path
      .replace(/.*\//, "")
      .split("-")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(" ");
  };

  const crumbsCompenent = useMemo(() => {
    if (!crumbs || !crumbs.length) {
      return null;
    }
    return crumbs.map((crumb, index) => {
      const crumbSettings = breadcrumb[crumb as EPaths] ?? {
        clickable: true,
        displayName: generateDisplayName(crumb as EPaths),
      };
      const isLastItem = crumbs.length - 1 == index;
      if (isLastItem) {
        crumbSettings.clickable = false;
        if (currentPathName) {
          crumbSettings.displayName = currentPathName;
        }
      }

      return (
        <Box mr={2} display="flex" key={index}>
          {crumbSettings.clickable ? (
            <Link className={classes.link} to={crumb}>
              {crumbSettings.displayName}
            </Link>
          ) : (
            <Typography
              className={isLastItem ? classes.currentPath : classes.disabled}
            >
              {crumbSettings.displayName}
            </Typography>
          )}

          {!isLastItem && (
            <Box ml={2}>
              <img src="https://storage.googleapis.com/dw-assets/spa/icons/right-arrow.png" />
            </Box>
          )}
        </Box>
      );
    });
  }, [crumbs]);

  return (
    <Box py={3} display="flex" alignItems="center">
      <Box mr={3}>
        <BackButton
          onClick={() => {
            navigate(-1);
          }}
        />
      </Box>
      {crumbsCompenent}
    </Box>
  );
};

export default Breadcrumb;
