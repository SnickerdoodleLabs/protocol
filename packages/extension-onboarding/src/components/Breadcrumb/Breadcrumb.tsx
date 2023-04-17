import BackButton from "@extension-onboarding/components/BackButton";
import { useStyles } from "@extension-onboarding/components/Breadcrumb/Breadcrumb.style";
import { tags } from "@extension-onboarding/constants/tags";
import { breadcrumb } from "@extension-onboarding/containers/Router/Router.breadcrumb";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { Box, Typography } from "@material-ui/core";
import React, { Fragment, useMemo } from "react";
import {
  Link,
  matchPath,
  PathMatch,
  useLocation,
  useNavigate,
} from "react-router-dom";

interface IBreadcrumbProps {
  currentPathName?: string;
}
const Breadcrumb = ({ currentPathName }: IBreadcrumbProps) => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const crumbs: {
    path: string;
    matches;
  }[] = useMemo(() => {
    let current = "";
    return pathname
      .split("/")
      .filter((item) => !!item)
      .map((crumb) => {
        current += `/${crumb}`;
        const mathced = Object.values(EPaths)
          .map((originalPath) => matchPath(originalPath, current))
          .filter(Boolean)[0]!;

        return {
          path: current,
          matches: mathced,
        };
      });
  }, [pathname, currentPathName]);

  const generateDisplayName = ({
    path,
    matches,
  }: {
    path: string;
    matches: PathMatch<"tag" | "brand">;
  }) => {
    // check tag
    if (
      matches.pattern.path === EPaths.MARKETPLACE_TAG_DETAIL &&
      matches?.params.tag
    ) {
      const tagInfo = tags.find((tag) => tag.tag === matches.params.tag);
      if (tagInfo?.defaultDisplayName) {
        return tagInfo.defaultDisplayName;
      }
    }
    return path
      .replace(/.*\//, "")
      .split("-")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(" ");
  };

  if (!crumbs || !crumbs.length) {
    return null;
  }
  return (
    <Box pb={3} display="flex" alignItems="center">
      <Box mr={3}>
        <BackButton
          onClick={() => {
            navigate(-1);
          }}
        />
      </Box>
      {crumbs.map((crumb, index) => {
        const crumbSettings = JSON.parse(JSON.stringify(breadcrumb))[
          crumb.matches.pattern.path as EPaths
        ] ?? {
          clickable: true,
          displayName: generateDisplayName(crumb),
        };
        const isLastItem = index === crumbs.length - 1;
        if (isLastItem) {
          crumbSettings.clickable = false;
          if (currentPathName) {
            crumbSettings.displayName = currentPathName;
          }
        }

        return (
          <Box mr={2} display="flex" key={index}>
            {crumbSettings.clickable ? (
              <>
                {breadcrumb[crumb.matches.pattern.path as EPaths]
                  ?.useAsBackButton ? (
                  <Typography
                    onClick={() => {
                      navigate(-1);
                    }}
                    className={classes.link}
                  >
                    {crumbSettings.displayName}
                  </Typography>
                ) : (
                  <Link className={classes.link} to={crumb.path}>
                    {crumbSettings.displayName || generateDisplayName(crumb)}
                  </Link>
                )}
              </>
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
      })}
    </Box>
  );
};

export default Breadcrumb;
