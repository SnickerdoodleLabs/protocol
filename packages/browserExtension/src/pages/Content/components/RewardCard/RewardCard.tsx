import React, { useEffect } from "react";
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
    document.dispatchEvent(new CustomEvent("SD_CONNECT_TO_WALLET_REQUEST"));
  };
  const secondaryButtonClicked = () => {
    chrome.storage.sync.get(["accountAddress"], function (result) {
      console.log("Value currently is " + result.accountAddress);
    });
  };

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "SD_REQUEST_IDENTITY" }, (response) => {
      console.log(response);
    });
  }, []);

  document.addEventListener(
    "SD_WALLET_CONNECTION_COMPLETED",
    async function (e) {
      // @ts-ignore
      const { accounts, signature } = e.detail;
      console.log("accounts received: ", accounts);
      chrome.storage.sync.set({ accountAddress: accounts }, function () {
        console.log("Value is set to " + accounts);
      });
    },
  );

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
