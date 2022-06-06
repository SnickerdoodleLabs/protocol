import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { RewardItem } from "../App/App";
import { useGenericModalStyles } from "../Modal/Modal.style";
import { useStyles } from "./RevardCard.style";
import CloseIcon from "@material-ui/icons/Close";
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
  const [open, setOpen] = useState(true);
  const modalClasses = useGenericModalStyles();
  const primaryButtonClicked = () => {
    document.dispatchEvent(new CustomEvent("SD_CONNECT_TO_WALLET_REQUEST"));
  };
  const secondaryButtonClicked = () => {
    setOpen(false);
    chrome.storage.sync.get(["accountAddress"], function (result) {
      console.log("Value currently is " + result.accountAddress);
    });
  };

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "SD_REQUEST_IDENTITY" }, (response) => {
      console.log(response);
    });
  }, []);

  const closeModal = () => {
    setOpen(false);
  };

  document.addEventListener(
    "SD_WALLET_CONNECTION_COMPLETED",
    async function (e) {
      // @ts-ignore
      const { accounts, signature } = e.detail;
      console.log("accounts received: ", accounts);
      console.log("signature received: ", signature);
      chrome.storage.sync.set({ accountAddress: accounts }, function () {
        console.log("Value is set to " + accounts);
      });
    },
  );

  return (
    // <div className="card">
    //   <Box>test</Box>
    //   <div className="sharapnel card2">
    //     <div
    //       style={{
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         width: "100%",
    //         background: "#F8D798",
    //         height: "240px",
    //         flexDirection: "column",
    //       }}
    //     >
    //       <img
    //         className="sharapnelImg"
    //         style={{
    //           width: "204px",
    //           height: "auto",
    //         }}
    //         src={image}
    //       />
    //       <div
    //         style={{
    //           borderRadius: "4px",
    //           background: "rgba(255, 255, 255, 0.5)",
    //           padding: "3px 12px",
    //         }}
    //       >
    //         {rewardName}
    //       </div>
    //     </div>

    //     <div
    //       style={{
    //         background: "#FDF3E1",
    //         padding: "25px",
    //       }}
    //     >
    //       <div className="text">
    //         <div
    //           className="title"
    //           style={{
    //             fontFamily: `'Shrikhand', cursive"`,
    //           }}
    //         >
    //           {title}
    //         </div>
    //         <div className="info">{description}</div>
    //       </div>
    //       <div className="buttons">
    //         <div
    //           className="button"
    //           style={{
    //             background: "unset",
    //             textDecoration: "underline",
    //           }}
    //           onClick={secondaryButtonClicked}
    //         >
    //           {secondaryButtonText}
    //         </div>
    //         <div
    //           className="button button-primary"
    //           onClick={primaryButtonClicked}
    //           style={{
    //             background: "#fff",
    //             color: "#000",
    //             borderRadius: 0,
    //           }}
    //         >
    //           {primaryButtonText}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <Dialog
      PaperProps={{
        square: true,
      }}
      open={open}
      disablePortal
      maxWidth="xs"
      fullWidth
      className={modalClasses.container}
    >
      <IconButton
        disableFocusRipple
        disableRipple
        disableTouchRipple
        aria-label="close"
        className={modalClasses.closeButton}
        onClick={closeModal}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent className={modalClasses.content}>
        <Box
          display="flex"
          flexDirection="column"
          bgcolor="#F8D798"
          flex={4}
          alignItems="center"
          width="100%"
          justifyContent="center"
        >
          <img className={modalClasses.image} src={image} alt="logo" />
          <Box
            padding="3px 12px"
            bgcolor="rgba(255, 255, 255, 0.5)"
            borderRadius={4}
            mt={0.75}
          >
            <Typography variant="body1" align="center">
              {rewardName}
            </Typography>
          </Box>
        </Box>
        <Box
          bgcolor="#FDF3E1"
          display="flex"
          flex={3}
          flexDirection="column"
          padding="36px 48px"
        >
          <Typography
            className={modalClasses.title}
            variant="h4"
            align="center"
          >
            {title}
          </Typography>
          <Typography variant="body1" align="center">
            {description}
          </Typography>
          <Box display="flex" mt="auto" justifyContent="space-between">
            <Button
              variant="text"
              className={modalClasses.secondaryButton}
              onClick={secondaryButtonClicked}
            >
              {secondaryButtonText}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={primaryButtonClicked}
              className={modalClasses.primaryButton}
            >
              {primaryButtonText}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 17 16"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="square"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
                className={modalClasses.primaryButtonIcon}
                {...props}
              >
                <path d="M1.808 14.535 14.535 1.806" className="arrow-body" />
                <path
                  d="M3.379 1.1h11M15.241 12.963v-11"
                  className="arrow-head"
                />
              </svg>
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RewardCard;
