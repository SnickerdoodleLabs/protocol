import React from "react";
import "./App.style.css";

const App = () => {
  return (
    <div className="card">
      <div className="riot card2">
        <img
          className="riotImg"
          style={{
            width: "100%",
            marginBottom: "30px",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
          src="https://staticg.sportskeeda.com/editor/2022/01/14535-16433089700630-1920.jpg"
        />
        <div className="text">
          <div className="title">
            Claim Your Free Skin !
            <div className="tooltip">
              <div className="tooltip-spacing">
                <div className="tooltip-bg1" />
                <div className="tooltip-bg2" />
                <div className="tooltip-text">?</div>
              </div>
            </div>
            <svg
              className="popup-bg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 130"
              height={130}
              width={300}
            >
              <path
                d="M36.5 12.695c15.9-2.4 32.556-4.284 82.977-3.815 79.67.74 121.785.26 145.294 5.51 18.483 4.13 34.333 11.696 33.382 32.11l-1.696 36.39c-1.01 21.68-11.678 29.377-21.934 30.838-14.884 2.12-29.72 3.52-54.512-.848C232.522 118.263 233.5 129 233.5 129s-1.992-7.686-32.218-14c-17.933-5.043-118.204 3.687-163.51-2.544-21.317-2.932-33.706-8.26-34.228-27.022L2.272 39.717c-.46-16.58 12.34-23.718 34.23-27.022z"
                fill="#303030"
                stroke="#000"
              />
            </svg>
            <svg
              className="popup-outline"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 130"
              height={130}
              width={300}
            >
              <g strokeWidth={2} strokeLinecap="round">
                <path
                  className="popup-outline-left"
                  d="M233.5 129s-1.992-7.686-32.218-14c-17.933-5.043-118.204 3.687-163.51-2.544-21.317-2.932-33.706-8.26-34.228-27.022L2.272 39.717c-.46-16.58 12.34-23.718 34.23-27.022 15.897-2.4 32.554-4.284 82.975-3.815"
                  fill="none"
                  stroke="#303030"
                />
                <path
                  className="popup-outline-right"
                  d="M119.477 8.88c79.67.74 121.785.26 145.294 5.51 18.483 4.13 34.333 11.696 33.382 32.11l-1.696 36.39c-1.01 21.68-11.678 29.377-21.934 30.838-14.884 2.12-29.72 3.52-54.512-.848C232.522 118.263 233.5 129 233.5 129"
                  fill="none"
                  stroke="#303030"
                />
              </g>
            </svg>
            <div className="popup-text">
              Thank you for allowing SnickerDoodle. You can immediately get your
              free skin to your account via click 'Do it!' button.
            </div>
          </div>
          <div className="info">Do you want to get your free "skin" ?</div>
        </div>
        <div className="buttons">
          <div className="button">Cancel</div>
          <div className="button button-primary">Do it!</div>
        </div>
      </div>
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
          src="https://m.media-amazon.com/images/G/01/sm/CallOfDutyS03/2021/LootCards/Drop01/CoD_BOCW_Warzone_drop6_ODP_US_286x320.jpg"
        />
        <div className="text">
          <div className="title">
            Claim Your Free guns !
            <div className="tooltip">
              <div className="tooltip-spacing">
                <div className="tooltip-bg1" />
                <div className="tooltip-bg2" />
                <div className="tooltip-text">?</div>
              </div>
            </div>
            <svg
              className="popup-bg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 130"
              height={130}
              width={300}
            >
              <path
                d="M36.5 12.695c15.9-2.4 32.556-4.284 82.977-3.815 79.67.74 121.785.26 145.294 5.51 18.483 4.13 34.333 11.696 33.382 32.11l-1.696 36.39c-1.01 21.68-11.678 29.377-21.934 30.838-14.884 2.12-29.72 3.52-54.512-.848C232.522 118.263 233.5 129 233.5 129s-1.992-7.686-32.218-14c-17.933-5.043-118.204 3.687-163.51-2.544-21.317-2.932-33.706-8.26-34.228-27.022L2.272 39.717c-.46-16.58 12.34-23.718 34.23-27.022z"
                fill="#303030"
                stroke="#000"
              />
            </svg>
            <svg
              className="popup-outline"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 130"
              height={130}
              width={300}
            >
              <g strokeWidth={2} strokeLinecap="round">
                <path
                  className="popup-outline-left"
                  d="M233.5 129s-1.992-7.686-32.218-14c-17.933-5.043-118.204 3.687-163.51-2.544-21.317-2.932-33.706-8.26-34.228-27.022L2.272 39.717c-.46-16.58 12.34-23.718 34.23-27.022 15.897-2.4 32.554-4.284 82.975-3.815"
                  fill="none"
                  stroke="#303030"
                />
                <path
                  className="popup-outline-right"
                  d="M119.477 8.88c79.67.74 121.785.26 145.294 5.51 18.483 4.13 34.333 11.696 33.382 32.11l-1.696 36.39c-1.01 21.68-11.678 29.377-21.934 30.838-14.884 2.12-29.72 3.52-54.512-.848C232.522 118.263 233.5 129 233.5 129"
                  fill="none"
                  stroke="#303030"
                />
              </g>
            </svg>
            <div className="popup-text">
              Thank you for allowing SnickerDoodle. You can immediately get your
              free guns to your account via click 'Do it!' button.
            </div>
          </div>
          <div className="info">Do you want to get your free "guns" ?</div>
        </div>
        <div className="buttons">
          <div className="button">Cancel</div>
          <div className="button button-primary">Do it!</div>
        </div>
      </div>
      <div style={{ display: "none" }} className="card3">
        <div className="text">
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            THANK YOU !
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
