import { Box, Typography } from "@material-ui/core";
import React, { FC, useState } from "react";
import Section, {
  useSectionStyles,
} from "@extension-onboarding/pages/Details/screens/RewardProgramDetails/components/Sections/Section";
import { EarnedReward } from "@snickerdoodlelabs/objects";

interface IProgramHistoryProps {
  rewards: EarnedReward[];
}
const ProgramHistory: FC<IProgramHistoryProps> = () => {
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

export default ProgramHistory;
