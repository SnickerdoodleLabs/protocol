import { Box, Button, Grid, Typography } from "@material-ui/core";
import { PageInvitation } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IDescriptionProps {
  pageInvitation: PageInvitation;
  onCancelClick: () => void;
  onContinueClick: () => void;
}
export const Description: FC<IDescriptionProps> = ({
  pageInvitation,
  onCancelClick,
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
      <Typography variant="body1" color="textPrimary">
        {pageInvitation.domainDetails.description}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            onClick={onCancelClick}
            fullWidth
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={onContinueClick}
            fullWidth
            variant="contained"
            color="primary"
          >
            Continue
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
