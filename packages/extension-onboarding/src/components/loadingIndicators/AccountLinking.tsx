import sdAnimation from "@extension-onboarding/assets/images/sdAnimation.gif";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { FC } from "react";

export const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Space Grotesk",
    fontWeight: 700,
    fontSize: "22px",
    lineHeight: "24px",
    color: "#101828",
  },
  text: {
    fontFamily: "Space Grotesk",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "20px",
  },
  img: { width: 289 },
}));

const AccountLinking: FC = () => {
  const classes = useStyles();
  return (
    <Box
      bgcolor="#fff"
      borderRadius={8}
      width={453}
      height={353}
      p={3}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography className={classes.title}>
        Your Account is Linking...
      </Typography>
      <img className={classes.img} src={sdAnimation} />
      <Typography className={classes.text}>Just a few seconds!</Typography>
    </Box>
  );
};

export default AccountLinking;
