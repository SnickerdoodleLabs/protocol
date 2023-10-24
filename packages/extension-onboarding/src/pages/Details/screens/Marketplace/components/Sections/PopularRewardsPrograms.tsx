import { Box, Typography } from "@material-ui/core";
import {
  ETag,
  EVMContractAddress,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import { Carousel } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

import { DefaultCampaignItem } from "@extension-onboarding/components/CampaignItems";
import { useSectionStyles } from "@extension-onboarding/pages/Details/screens/Marketplace/components/Sections/Section.style";

interface IPopularRewardsProgramsProps {
  tag?: ETag;
  listings: MarketplaceListing[];
}
const PopularRewardsPrograms: FC<IPopularRewardsProgramsProps> = ({
  tag,
  listings,
}) => {
  const sectionClasses = useSectionStyles();

  return (
    <>
      <Box mb={3}>
        <Typography className={sectionClasses.sectionTitle}>
          Popular Rewards Programs
        </Typography>
      </Box>
      <Box>
        <Carousel visibleItemCount={2} gutter={24}>
          {Array.from(
            new Set([...listings.map((item) => item.consentContract)]),
          ).map((item) => (
            <Box key={JSON.stringify(item)}>
              <DefaultCampaignItem
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

export default PopularRewardsPrograms;
