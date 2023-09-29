import { PageInvitation } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

import {
  Box,
  Typography,
} from "@web-integration/implementations/app/ui/lib/index.js";

interface IInvitationCardProps {
  pageInvitation: PageInvitation;
}
export const InvitationCard: FC<IInvitationCardProps> = ({
  pageInvitation,
}) => {
  return (
    <>
      <Box px={6}>
        <Typography variant="title">
          {pageInvitation.domainDetails.title}
        </Typography>
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
      <Typography variant="bodyBold">
        {pageInvitation.domainDetails.rewardName}
      </Typography>
    </>
  );
};
