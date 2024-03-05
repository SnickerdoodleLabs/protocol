import { External_URLs } from "@extension-onboarding/constants";
import { Box, Toolbar, makeStyles } from "@material-ui/core";
import { SDTypography, colors } from "@snickerdoodlelabs/shared-components";
import React, { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: colors.MAINPURPLE900,
  },
  name: {
    color: colors.MAINPURPLE50,
  },
  link: {
    textDecoration: "none",
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <Toolbar className={classes.toolbar}>
      <Box
        display="flex"
        width="100%"
        textAlign="center"
        alignItems="center"
        justifyContent="center"
      >
        {External_URLs.map((url, index) => (
          <Fragment key={index}>
            <a
              className={classes.link}
              href={url.url}
              target="_blank"
              rel="noreferrer"
            >
              <SDTypography
                className={classes.name}
                variant="bodyMd"
                fontWeight="medium"
              >
                {url.displayName}
              </SDTypography>
            </a>
            <Box ml={{ xs: 2, sm: 3, md: 4, lg: 8 }} />
          </Fragment>
        ))}
      </Box>
    </Toolbar>
  );
};

export default Footer;
