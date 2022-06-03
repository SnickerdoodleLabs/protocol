import React from "react";
import { RewardItem } from "../App/App";
// import { useStyles } from "./RevardCard.style";

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
  // const classes = useStyles();
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
        <img
          className="sharapnelImg"
          style={{
            width: "100%",
            height: "320px",
            marginBottom: "30px",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
          src={image}
        />
        <div className="text">
          <div className="title">
            {title} - {rewardName}
            <div className="tooltip">
              <div className="tooltip-spacing">
                <div className="tooltip-bg1" />
                <div className="tooltip-bg2" />
                <div className="tooltip-text">?</div>
              </div>
            </div>
          </div>
          <div className="info">{description}</div>
        </div>
        <div className="buttons">
          <div className="button" onClick={secondaryButtonClicked}>
            {secondaryButtonText}
          </div>
          <div className="button button-primary" onClick={primaryButtonClicked}>
            {primaryButtonText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
