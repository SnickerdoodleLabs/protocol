import { Box, Typography } from "@core-iframe/app/ui/lib";
import { IOpenSeaMetadata } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IInvitationCardProps {
  pageInvitation: IOpenSeaMetadata;
}
export const InvitationCard: FC<IInvitationCardProps> = ({
  pageInvitation,
}) => {
  return (
    <>
      <Box px={6}>
        <Typography variant="title">{pageInvitation.title}</Typography>
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
          src={pageInvitation.nftClaimedImage}
        />
      </Box>
      <Typography variant="bodyBold">{pageInvitation.rewardName}</Typography>
    </>
  );
};
