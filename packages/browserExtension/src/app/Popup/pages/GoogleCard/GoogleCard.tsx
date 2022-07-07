import React, { FC, useEffect, useState } from "react";
import Browser from "webextension-polyfill";
import { Grid, Typography } from "@material-ui/core";
import { useStyles } from "./GoogleCard.style";
import { useAppContext } from "../../context";
import GoogleCardData from "./GoogleCardData";

const GoogleCard: FC = () => {
  const [obj, setObj] = useState<any>();
  const [onChain, setOnChain] = useState<any>();
  const classes = useStyles();
  const { appState } = useAppContext();

  useEffect(() => {
    Browser.storage.sync.get("onChainData").then((data) => {
      if (data?.onChainData) {
        setOnChain(data.onChainData);
      }
    });
  }, []);

  useEffect(() => {
    if (appState) {
      console.log(appState);
      setObj(appState.googleData);
    }
  }, [appState]);

  return (
    <Grid className={classes.googleCardContainer}>
      <Grid className={classes.cardTop}>
        <Grid className={classes.cardTopLogo}>
          <img src={Browser.runtime.getURL("assets/img/logoHorizontal.svg")} />
        </Grid>
        <Typography className={classes.cardTopText} variant="h4">
          “This information is in your data wallet. You own this data and it
          <br></br>
          cannot be shared with any other party unless you approve it!”
        </Typography>
      </Grid>

      <Grid className={classes.cardPersonalContainer}>
        <Typography className={classes.cardPersonalText} variant="h4">
          Personal Info
        </Typography>

        <Grid className={classes.cardDataContainer}>
          <Typography className={classes.cardDataText} variant="h4">
            PHOTO
          </Typography>

          <img
            className={classes.cardDataPhoto}
            src={obj?.photos ? obj?.photos[0].url : Browser.runtime.getURL("assets/img/personIcon.png")}
          />
        </Grid>

        <GoogleCardData
          title="NAME"
          information={obj?.names ? obj?.names[0].displayName : "N/A"}
        />
        <GoogleCardData
          title="BIRTHDAY"
          information={
            obj?.birthdays
              ? `${obj?.birthdays[0]?.date.month || "N/A"}/${
                  obj.birthdays[0]?.date.day || "N/A"
                }/${obj.birthdays[0]?.date.year || "N/A"}`
              : "N/A"
          }
        />
        <GoogleCardData
          title="GENDER"
          information={obj?.genders ? obj?.genders[0]?.formattedValue : "N/A"}
        />
        <GoogleCardData
          title="EMAIL"
          information={
            obj?.emailAddresses ? obj?.emailAddresses[0].value : "N/A"
          }
        />
        <GoogleCardData
          title="PHONE"
          information={
            obj?.phoneNumbers ? obj?.phoneNumbers[0]?.canonicalForm : "N/A"
          }
        />
        <GoogleCardData
          title="LOCATION"
          information={obj?.locations ? obj?.locations[0]?.value : "N/A"}
        />
      </Grid>

      <Grid className={classes.cardOnchainContainer}>
        <Typography className={classes.cardOnchainText} variant="h4">
          On-chain Info
        </Typography>
        <GoogleCardData
          title="URL WITH TIMESTAMP"
          information={
            onChain?.accountAddress
              ? `www...${onChain?.timestamp.substring(0, 20)}`
              : "N/A"
          }
        />
        <GoogleCardData
          title="WALLET ACCOUNT"
          information={
            onChain?.accountAddress
              ? `${onChain?.accountAddress.substring(0, 22)} . . .`
              : "N/A"
          }
        />
        <GoogleCardData
          title="SIGNATURE"
          information={
            onChain?.signatureValue
              ? `${onChain?.signatureValue.substring(0, 22)} . . .`
              : "N/A"
          }
        />
      </Grid>
    </Grid>
  );
};

export default GoogleCard;
