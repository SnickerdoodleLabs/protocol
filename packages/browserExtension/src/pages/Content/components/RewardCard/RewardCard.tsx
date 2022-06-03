import Button from "@material-ui/core/Button";
import React from "react";
import { RewardItem } from "../App/App";
import { useStyles } from "./RevardCard.style";

interface props {
  rewardItem: RewardItem;
}

const RewardCard: React.FC<props> = (props) => {
  const { rewardItem } = props;
  const {
    title,
    image,
    description,
    primaryButtonText,
    secondaryButtonText,
    rewardName,
  } = rewardItem;
  const classes = useStyles();
  const primaryButtonClicked = () => {
    document.dispatchEvent(new CustomEvent("requestAccounts"));
  };
  const secondaryButtonClicked = () => {
    chrome.storage.sync.get(["accountAddress"], function (result) {
      console.log("Value currently is " + result.accountAddress);
    });
  };

  document.addEventListener("accountsReceived", async function (e) {
    console.log("accountsReceived");
    // @ts-ignore
    const accounts = e.detail;

    console.log("accounts received: ", accounts);
    chrome.storage.sync.set({ accountAddress: accounts }, function () {
      console.log("Value is set to " + accounts);
    });
  });

  return (
    <div className="card">
      <div className="sharapnel card2">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            background: "#F8D798",
            height: "240px",
            flexDirection: "column",
          }}
        >
          <img
            className="sharapnelImg"
            style={{
              width: "204px",
              height: "auto",
            }}
            src={image}
          />
          <div
            style={{
              borderRadius: "4px",
              background: "rgba(255, 255, 255, 0.5)",
              padding: "3px 12px",
            }}
          >
            {rewardName}
          </div>
        </div>

        <div
          style={{
            background: "#FDF3E1",
            padding: "25px",
          }}
        >
          <div className="text">
            <div className="title">{title}</div>
            <div className="info">{description}</div>
          </div>
          <div className="buttons">
            <div
              className="button"
              style={{
                background: "unset",
                textDecoration: "underline",
              }}
              onClick={secondaryButtonClicked}
            >
              {secondaryButtonText}
            </div>
            <div
              className="button button-primary"
              onClick={primaryButtonClicked}
              style={{
                background: "#fff",
                color: "#000",
                borderRadius: 0,
              }}
            >
              {primaryButtonText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
