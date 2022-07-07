import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { IGoogleCardData } from "./GoogleCard.interface";
import { useStyles } from "./GoogleCard.style";

export default function GoogleCardData(props: IGoogleCardData) {
  const classes = useStyles();
  return (
    <Grid className={classes.cardDataContainer}>
      <Typography className={classes.cardDataTitle} variant="h4">
        {props.title}
      </Typography>

      <Typography className={classes.cardDataInformation} variant="h4">
        {props.information}
      </Typography>
    </Grid>
  );
}
