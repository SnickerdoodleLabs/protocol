import { DefaultCampaignItem } from "@extension-onboarding/components/CampaignItems";
import Carousel from "@extension-onboarding/components/Carousel";
import { useSectionStyles } from "@extension-onboarding/pages/Details/screens/Marketplace/components/Sections/Section.style";
import { Box, Typography } from "@material-ui/core";
import {
  ETag,
  EVMContractAddress,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IPopularRewardsProgramsProps {
  tag?: ETag;
  listings: MarketplaceListing[];
}
const PopularRewardsPrograms: FC<IPopularRewardsProgramsProps> = ({
  tag,
  listings,
}) => {
  const sectionClasses = useSectionStyles();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 2,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };
  return (
    <>
      <Box mb={3}>
        <Typography className={sectionClasses.sectionTitle}>
          Popular Rewards Programs
        </Typography>
      </Box>
      <Box className={sectionClasses.carouselWrapper}>
        <Carousel responsive={responsive}>
          {Array.from(
            new Set([...listings.map((item) => item.consentContract)]),
          ).map((item) => (
            <Box key={JSON.stringify(item)} mr={3}>
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
