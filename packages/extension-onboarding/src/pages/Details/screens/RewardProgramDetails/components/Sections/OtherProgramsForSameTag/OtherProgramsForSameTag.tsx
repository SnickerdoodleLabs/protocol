import Section, {
  useSectionStyles,
} from "@extension-onboarding/pages/Details/screens/RewardProgramDetails/components/Sections/Section";
import { Box, Typography } from "@material-ui/core";
import { ETag, EVMContractAddress } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IOtherProgramsForSameTagProps {
  tag: ETag;
}
const OtherProgramsForSameTag: FC<IOtherProgramsForSameTagProps> = () => {
  const sectionClasses = useSectionStyles();
  return (
    <Section>
      <Typography className={sectionClasses.sectionTitle}></Typography>
      <Box>
        <Typography className={sectionClasses.sectionDescription}></Typography>
      </Box>
    </Section>
  );
};

export default OtherProgramsForSameTag;
