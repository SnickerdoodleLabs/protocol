import { Grid } from "@material-ui/core";
import React from "react";

export default function TextData(props) {
  return (
    <Grid style={{ display: "flex", alignItems: "center" }}>
      <Grid>
        <h1
          style={{
            marginLeft: "15px",
            fontSize: "12px",
            top: "50px",
            color: "#8F8F8F",
            margin: "5px 5px 5px 15px",
            fontWeight: "600",
            lineHeight: "17px",
          }}
        >
          {props?.title}
        </h1>
      </Grid>

      {props?.dataType === "Text" ? (
        <Grid style={{ position: "absolute", left: "220px", marginTop: "0px" }}>
          <h1
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "#242238",
              textAlign: "left",
              lineHeight: "17px",
            }}
          >
            {props?.data}
          </h1>
        </Grid>
      ) : (
        <Grid style={{}}>
          <img
            style={{
              width: "55px",
              marginLeft: "130px",
              marginTop: "10px",
              marginBottom: "10px",
              borderRadius: "30px",
            }}
            src={props?.data}
          />
        </Grid>
      )}
    </Grid>
  );
}
