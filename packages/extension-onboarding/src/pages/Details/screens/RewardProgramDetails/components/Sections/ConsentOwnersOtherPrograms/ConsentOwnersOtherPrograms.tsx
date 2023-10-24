import { Box, Typography } from "@material-ui/core";
import { EVMContractAddress } from "@snickerdoodlelabs/objects";
import { Carousel } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

import { DefaultCampaignItem } from "@extension-onboarding/components/CampaignItems";
import Section, {
  useSectionStyles,
} from "@extension-onboarding/pages/Details/screens/RewardProgramDetails/components/Sections/Section";

interface IConsentOwnersOtherProgramsProps {
  consentContract: EVMContractAddress;
  brandInfo?: any;
}
const ConsentOwnersOtherPrograms: FC<IConsentOwnersOtherProgramsProps> = ({
  consentContract,
  brandInfo,
}) => {
  const sectionClasses = useSectionStyles();

  return (
    <Section>
      <Box mb={4}>
        <Typography className={sectionClasses.sectionTitle}>
          {!brandInfo
            ? `Popular Reward Programs of This Reward Program Owner`
            : `Popular ${brandInfo.name} Rewards Programs`}
        </Typography>
        <Box>
          <Typography
            className={sectionClasses.sectionDescription}
          ></Typography>
        </Box>
      </Box>
      <Box>
        <Carousel visibleItemCount={2}>
          {[
            "0x6303c6f490CF742F6EaEDD560945f16E42136aCE",
            "0xc336E4ff9271f4B4B2B9E514D4B73c066e3Fc1d6",
            "0x9031E8903f3192158046f72639db900d73b33359",
          ].map((item) => (
            <Box mr={3}>
              <DefaultCampaignItem
                consentContractAddress={item as EVMContractAddress}
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </Section>
  );
};

export default ConsentOwnersOtherPrograms;
