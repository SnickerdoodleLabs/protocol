import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ViewData/ViewData.style";

export default function PersonalData(props) {
    const classes = useStyles();
  return (
    <Grid container style={{ paddingLeft: "24px" }}>
      <Grid item xs={6}>
        <Typography style={{color:"#5D5A74",fontSize:16,fontWeight:500,fontFamily:"Space Grotesk",paddingTop:"22px",paddingBottom:"22px"}}>{props.title}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography style={{fontFamily:"Space Grotesk", fontWeight:500,fontSize:16,color:"#232039",paddingTop:"22px",paddingBottom:"22px"}}>{props.information}</Typography>
      </Grid>
    </Grid>
  );
}
