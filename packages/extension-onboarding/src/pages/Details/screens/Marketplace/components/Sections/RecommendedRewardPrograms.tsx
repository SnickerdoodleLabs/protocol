import { RecommendedCampaignItem } from "@extension-onboarding/components/CampaignItems";
import { useSectionStyles } from "@extension-onboarding/pages/Details/screens/Marketplace/components/Sections/Section.style";
import { Box, Grid, Typography } from "@material-ui/core";
import {
  ETag,
  EVMContractAddress,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IRecommendedRewardProgramsProps {
  tag?: ETag;
  listings: MarketplaceListing[];
}
const RecommendedRewardPrograms: FC<IRecommendedRewardProgramsProps> = ({
  tag,
  listings,
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
          {Array.from(
            new Set([...listings.map((item) => item.consentContract)]),
          ).map((item) => (
            <Grid key={JSON.stringify(item)} xs={4} item>
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
