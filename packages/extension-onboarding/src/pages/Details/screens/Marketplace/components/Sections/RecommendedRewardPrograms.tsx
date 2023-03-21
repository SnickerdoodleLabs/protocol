import RecommendedCampaignItem from "@extension-onboarding/components/RecommendedCampaignItem";
import { useSectionStyles } from "@extension-onboarding/pages/Details/screens/Marketplace/components/Sections/Section.style";
import { Box, Grid, Typography } from "@material-ui/core";
import { ETag, EVMContractAddress } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IRecommendedRewardProgramsProps {
  tag?: ETag;
}
const RecommendedRewardPrograms: FC<IRecommendedRewardProgramsProps> = ({
  tag,
}) => {
  const sectionClasses = useSectionStyles();

  return (
    <>
      <Box mb={3}>
        <Typography className={sectionClasses.sectionTitle}>
          Recommended Rewards Programs
        </Typography>
      </Box>
      <Box className={sectionClasses.carouselWrapper}>
        <Grid container spacing={2}>
          {[
            "0x6303c6f490CF742F6EaEDD560945f16E42136aCE",
            "0xc336E4ff9271f4B4B2B9E514D4B73c066e3Fc1d6",
            "0x9031E8903f3192158046f72639db900d73b33359",
          ].map((item) => (
            <Grid xs={4} item>
              <RecommendedCampaignItem
                tag={tag}
                consentContractAddress={item as EVMContractAddress}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default RecommendedRewardPrograms;
