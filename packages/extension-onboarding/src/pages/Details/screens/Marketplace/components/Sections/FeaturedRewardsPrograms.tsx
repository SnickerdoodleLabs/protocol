import { Box, Typography } from "@material-ui/core";
import {
  ETag,
  EVMContractAddress,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import { Carousel } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

import { FeaturedCampaignItem } from "@extension-onboarding/components/CampaignItems";
import { useSectionStyles } from "@extension-onboarding/pages/Details/screens/Marketplace/components/Sections/Section.style";

interface IFeaturedRewardsProgramsProps {
  tag?: ETag;
  listings: MarketplaceListing[];
}
const FeaturedRewardsPrograms: FC<IFeaturedRewardsProgramsProps> = ({
  tag,
  listings,
}) => {
  const sectionClasses = useSectionStyles();

  return (
    <>
      <Box mb={3}>
        <Typography className={sectionClasses.sectionTitle}>
          Featured Rewards Programs
        </Typography>
      </Box>
      <Box>
        <Carousel visibleItemCount={1} gutter={0}>
          {Array.from(
            new Set([...listings.map((item) => item.consentContract)]),
          ).map((item) => (
            <Box key={JSON.stringify(item)}>
              <FeaturedCampaignItem
                tag={tag}
                consentContractAddress={item as EVMContractAddress}
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </>
  );
};

export default FeaturedRewardsPrograms;
