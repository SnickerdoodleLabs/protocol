import { useStyles } from "@extension-onboarding/components/PersonalInfoCard/components/CardItem/CardItem.style";
import { Grid, Typography } from "@material-ui/core";
import React from "react";

interface ICardItemProps {
  title: string;
  information: any;
}

const CardItem = ({ title, information }: ICardItemProps) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.container}>
      <Grid item xs={5}>
        <Typography className={classes.title}>{title}</Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography className={classes.info}>{information}</Typography>
      </Grid>
    </Grid>
  );
};

export default CardItem;
