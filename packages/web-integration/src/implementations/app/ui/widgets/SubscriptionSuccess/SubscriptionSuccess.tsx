import {
  Box,
  Typography,
  Button,
} from "@web-integration/implementations/app/ui/lib/index.js";
import { PageInvitation } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface ISubscriptionSuccessProps {
  pageInvitation: PageInvitation;
  onClick: () => void;
}
export const SubscriptionSuccess: FC<ISubscriptionSuccessProps> = ({
  pageInvitation,
  onClick,
}) => {
  return (
    <>
      <Box px={6}>
        <Typography variant="title">Congrats!</Typography>
      </Box>
      <Box
        width="-webkit-fill-available"
        display="flex"
        justifyContent="center"
        my={5.5}
      >
        <img
          style={{
            width: "40%",
            height: "auto",
            aspectRatio: 2 / 3,
            objectFit: "cover",
          }}
          src={pageInvitation.domainDetails.nftClaimedImage}
        />
      </Box>
      <Typography variant="subtitle">
        You have successfully subscribed!
      </Typography>
      <Box mb={1.5} />
      <Typography variant="title">
        {pageInvitation.domainDetails.rewardName}
      </Typography>
      <Box mb={5.5} />
      <Button onClick={onClick} fullWidth variant="contained-gradient">
        OK!
      </Button>
    </>
  );
};
