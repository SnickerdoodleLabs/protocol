import { FeaturedCampaignItem } from "@extension-onboarding/components/CampaignItems";
import Carousel from "@extension-onboarding/components/Carousel";
import { useSectionStyles } from "@extension-onboarding/pages/Details/screens/Marketplace/components/Sections/Section.style";
import { Box, Typography } from "@material-ui/core";
import {
  ETag,
  EVMContractAddress,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IFeaturedRewardsProgramsProps {
  tag?: ETag;
  listings: MarketplaceListing[];
}
const FeaturedRewardsPrograms: FC<IFeaturedRewardsProgramsProps> = ({
  tag,
  listings,
}) => {
  const sectionClasses = useSectionStyles();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <>
      <Box mb={3}>
        <Typography className={sectionClasses.sectionTitle}>
          Featured Rewards Programs
        </Typography>
      </Box>
      <Box className={sectionClasses.carouselWrapper}>
        <Carousel responsive={responsive}>
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
