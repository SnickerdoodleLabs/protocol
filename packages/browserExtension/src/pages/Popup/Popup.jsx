import React, { useEffect, useState } from "react";
import Greetings from "../../containers/Greetings/Greetings";
import "./Popup.css";
import createMetaMaskProvider from "metamask-extension-provider";
import { ethers } from "ethers";
import connect from "../Background";
import { abi_RequestForData } from "../../contract/abi";
import { Button, Grid } from "@material-ui/core";
import horizontalLogo from "../../assets/img/sdHorizontalLogo.svg";
import Data from "./components/Data";

const Popup = () => {
  const [obj, setObj] = useState(null);
  const [onChainData, setOnChainData] = useState(null);
  const [loadCard, setLoadCard] = useState(true);
  const hostname = window.location.hostname;
  useEffect(() => {
    chrome.runtime.sendMessage({ message: "onChainDataRequest", hostname: "onChainData"});
    chrome.storage.sync.get(["onChainData"], ((result) => {
      if (result.onChainData) {
        setOnChainData(result.onChainData)
      }
    }));
  }, []);

  chrome.runtime.sendMessage({ message: "dataRequest", obj: obj });

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse,
  ) {
    if (request.message === "cardData") {
      if (request.userData) {
        console.log("req", request.userData);
        setObj(request.userData);
      }
    }
  });

  return (
    <Grid>
      <Grid
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          background: "#F8D798",
          textAlign: "center",
        }}
      >
        <Grid>
          <img
            style={{ margin: "35px 0px 15px 0px", width: "155px" }}
            src={horizontalLogo}
          />
        </Grid>
      </Grid>
      {loadCard ? (
        <Grid
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            background: "#FDF3E1",
            top: "80px",
          }}
        >
          <Grid
            style={{
              width: "90%",
              marginLeft: "5%",
              background: "white",
              height: "210px",
              borderRadius: "15px",
              marginTop: "10px",
            }}
          >
            <Grid>
              <h1
                style={{
                  marginLeft: "15px",
                  fontSize: "15px",
                  marginTop: "10px",
                  paddingTop: "10px",
                }}
              >
                Personal Info
              </h1>
            </Grid>
            <Data
              dataType="Image"
              title="PHOTO"
              data={
                obj?.photos
                  ? obj?.photos[0].url
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgUNaoFwOOa3sOnMoc8CVUJ65bhS822etxVQ&usqp=CAU"
              }
            />
            <Data
              dataType="Text"
              title="NAME"
              data={obj?.names ? obj?.names[0].displayName : "Todd Chapman"}
            />
            <Data
              dataType="Text"
              title="BIRTHDAY"
              data={
                obj?.birthdays
                  ? `${obj?.birthdays[0]?.date.month || "04"}/${
                      obj.birthdays[0]?.date.day || "05"
                    }/${obj.birthdays[0]?.date.year || "1992"}`
                  : "N/A"
              }
            />
            <Data
              dataType="Text"
              title="GENDER"
              data={obj?.genders ? obj?.genders[0]?.formattedValue : "N/A"}
            />
          </Grid>
          <Grid
            style={{
              width: "90%",
              marginLeft: "5%",
              background: "white",
              height: "135px",
              borderRadius: "15px",
              marginTop: "10px",
            }}
          >
            <Grid>
              <h1
                style={{
                  marginLeft: "15px",
                  fontSize: "15px",
                  marginTop: "10px",
                  paddingTop: "10px",
                }}
              >
                Contact Info
              </h1>
            </Grid>
            <Data
              dataType="Text"
              title="EMAIL"
              data={
                obj?.emailAddresses
                  ? obj?.emailAddresses[0].value
                  : "todd@snickerdoodle.io"
              }
            />
            <Data dataType="Text" title="PHONE" data="N/A" />
            <Data dataType="Text" title="LOCATION" data="California" />
          </Grid>
          <Grid
            style={{
              width: "90%",
              marginLeft: "5%",
              background: "white",
              height: "135px",
              borderRadius: "15px",
              marginTop: "10px",
            }}
          >
            <Grid>
              <h1
                style={{
                  marginLeft: "15px",
                  fontSize: "15px",
                  marginTop: "10px",
                  paddingTop: "10px",
                }}
              >
                On-chain Info
              </h1>
            </Grid>
            <Data
              dataType="Text"
              title="URL WITH TIMESTAMP"
              data="www... 10/02/2022 - 22:05:30"
            />
            <Data
              dataType="Text"
              title="WALLET ACCOUNT"
              data={onChainData?.accountAddress}
            />
            <Data
              dataType="Text"
              title="SIGNATURE"
              data={onChainData?.signatureValue}
            />
            <Data
              dataType="Text"
              title="CHAIN ID"
              data={onChainData?.chainId}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid style={{ justifyContent: "center", textAlign: "center" }}>
          <Button
            onClick={() => {
              setLoadCard(true);
            }}
            style={{
              marginTop: "500px",
              background: "#0D1117",
              color: "white",
            }}
            variant="contained"
          >
            Show User Card
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default Popup;
