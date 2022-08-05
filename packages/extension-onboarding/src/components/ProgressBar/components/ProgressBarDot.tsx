import React, { FC} from "react";
import dot1 from "@extension-onboarding/assets/icons/dot-1.svg";
import dot2 from "@extension-onboarding/assets/icons/dot-2.svg";
import dot3 from "@extension-onboarding/assets/icons/dot-3.svg";
import dot1Faded from "@extension-onboarding/assets/icons/dot-1-faded.svg";
import dot2Faded from "@extension-onboarding/assets/icons/dot-2-faded.svg";
import dot3Faded from "@extension-onboarding/assets/icons/dot-3-faded.svg";
import { Box } from "@material-ui/core";

export interface IProgressBarDotProps{
    number:number,
    status:number
}
const ProgressBarDot: FC<IProgressBarDotProps> = ({number,status}) => {
  const renderDot = () => {
    switch (number) {
      case 1: {
        return <img width={50} src={status == number ? dot1 : dot1Faded} />;
      }
      case 2: {
        return <img width={50} src={status == number ? dot2 : dot2Faded} />;
      }
      case 3: {
        return <img width={50} src={status == number ? dot3 : dot3Faded} />;
      }
      default: {
        return null;
        break;
      }
    }
  };

  return <Box>
    {renderDot}
  </Box>;
}

export default ProgressBarDot