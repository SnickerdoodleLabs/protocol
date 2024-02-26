import { Box } from "@material-ui/core";
import { SDButton, SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";
interface IEMailFormProps {
  onComplete: () => void;
}

const EMailForm: FC<IEMailFormProps> = ({ onComplete }) => {
  return (
    <div>
      EMailForm
      <Box mt={6}>
        <SDButton
          onClick={() => {
            onComplete();
          }}
          variant={0 > 0 ? "contained" : "outlined"}
          color="primary"
        >
          {0 > 0 ? "Next" : "Skip"}
        </SDButton>
      </Box>
    </div>
  );
};

export default EMailForm;
