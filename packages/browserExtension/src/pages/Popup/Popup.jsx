import React, { useEffect, useState } from "react";
import Greetings from "../../containers/Greetings/Greetings";
import "./Popup.css";
import createMetaMaskProvider from "metamask-extension-provider";
import { ethers } from "ethers";
import connect from "../Background";
import { abi_RequestForData } from "../../contract/abi";
import { Grid } from "@material-ui/core";
import checkIcon from "../../assets/img/icon-128.png";
import Data from "./components/Data";

const Popup = () => {
  const [test, setTest] = useState("Personal Info");
  const [obj, setObj] = useState(null);

  chrome.history.search({ text: "", maxResults: 10 }, function (data) {
    data.forEach(function (page) {});
  });

  chrome.runtime.sendMessage({ message: "get_access_token", obj: obj });
  // chrome.runtime.sendMessage({ message: "get_profile" });
  // chrome.runtime.sendMessage({ message: "get_contacts" });

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse,
  ) {
    if (request.message === "cardData") {
      console.log("req", request.userData);
      setObj(request.userData);
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
            style={{ margin: "15px 0px 15px 0px", width: "55px" }}
            src={checkIcon}
          />
        </Grid>
      </Grid>
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
              {test}
            </h1>
          </Grid>
          <Data dataType="Image" title="PHOTO" data={obj?.picture} />
          <Data dataType="Text" title="NAME" data={obj?.name} />
          <Data dataType="Text" title="BIRTHDAY" data="N/A" />
          <Data dataType="Text" title="GENDER" data="N/A" />
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
          <Data dataType="Text" title="EMAIL" data={obj?.email} />
          <Data dataType="Text" title="PHONE" data="N/A" />
          <Data dataType="Text" title="LOCATION" data="N/A" />
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
            data="0x5274f8D7....296f7f6B2469"
          />
          <Data
            dataType="Text"
            title="SIGNATURE"
            data="0x2454f8G4....126f5f6B5439"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Popup;
