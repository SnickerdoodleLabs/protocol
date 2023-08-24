import {
  Box,
  Typography,
  Button,
  Grid,
} from "@web-integration/implementations/app/ui/lib/index.js";
import { PageInvitation } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IDescriptionProps {
  pageInvitation: PageInvitation;
  onCancelClick: () => void;
  onContinueClick: () => void;
  onRejectClick: () => void;
}
export const Description: FC<IDescriptionProps> = ({
  pageInvitation,
  onCancelClick,
  onRejectClick,
  onContinueClick,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      width="-webkit-fill-available"
      height="-webkit-fill-available"
    >
      <Typography variant="description" color="textPrimary">
        {pageInvitation.domainDetails.description}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Button onClick={onCancelClick} fullWidth variant="outlined-primary">
            Cancel
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={onRejectClick} fullWidth variant="outlined-primary">
            Reject
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            onClick={onContinueClick}
            fullWidth
            variant="contained-gradient"
          >
            Continue
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
