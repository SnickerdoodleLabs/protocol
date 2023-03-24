import marketplaceImage from "@extension-onboarding/assets/images/marketplace.svg";
import { LOCAL_STORAGE_REWARDS_MARKETPLACE_INTRODUCTION } from "@extension-onboarding/constants";
import { tags } from "@extension-onboarding/constants/tags";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import {
  FeaturedRewardsPrograms,
  PopularRewardsPrograms,
  RecommendedRewardPrograms,
} from "@extension-onboarding/pages/Details/screens/Marketplace/components/Sections";
import { useMarketplaceStyles } from "@extension-onboarding/pages/Details/screens/Marketplace/Marketplace.style";
import {
  Box,
  Collapse,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { ETag } from "@snickerdoodlelabs/objects";
import React, { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
const Marketplace = () => {
  const classes = useMarketplaceStyles();
  const navigate = useNavigate();
  const handleCategoryClick = (tag: ETag) => {
    navigate(generatePath(EPaths.MARKETPLACE_TAG_DETAIL, { tag }));
  };
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(
    !localStorage.getItem(LOCAL_STORAGE_REWARDS_MARKETPLACE_INTRODUCTION),
  );

  return (
    <>
      <Collapse in={isBannerVisible}>
        <Box width="100%" position="relative">
          <Box position="absolute" top={8} right={8}>
            <IconButton
              disableFocusRipple
              disableRipple
              disableTouchRipple
              onClick={() => {
                localStorage.setItem(
                  LOCAL_STORAGE_REWARDS_MARKETPLACE_INTRODUCTION,
                  "visited",
                );
                setIsBannerVisible(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <img src={marketplaceImage} width="100%" />
        </Box>
      </Collapse>
      <Box mt={5}>
        <Typography className={classes.title}>Rewards Marketplace</Typography>
      </Box>
      <Box mt={6}>
        <Box
          display="flex"
          alignItems="flex-end"
          justifyContent="space-between"
        >
          <Typography className={classes.categoryTitle}>
            Explore Top Categories
          </Typography>
          <Select
            className={classes.select}
            fullWidth
            variant="outlined"
            name="accounts"
            value={"unselected"}
            placeholder="All"
            onChange={(event) => {
              if (event.target.value != "unselected") {
                handleCategoryClick(event.target.value as ETag);
              }
            }}
          >
            <MenuItem value="unselected">Select a Category</MenuItem>
            {tags?.map((tag) => {
              return (
                <MenuItem key={tag.tag} value={tag.tag}>
                  <Box display="flex" alignItems="center">
                    <Typography>{tag.defaultDisplayName}</Typography>
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
        </Box>
        <Box mt={4} display="flex" flex={5}>
          {tags.slice(0, 5).map((tagItem, index) => {
            return (
              <Box
                onClick={() => handleCategoryClick(tagItem.tag)}
                className={classes.category}
                key={index}
                flex={1}
                ml={index === 0 ? 0 : 3}
              >
                <img
                  className={classes.image}
                  width="100%"
                  src={tagItem.iconUrl}
                />
                <Box mt={1.5}>
                  <Typography className={classes.categoryLabel}>
                    {tagItem.defaultDisplayName}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box mt={6}>
        <FeaturedRewardsPrograms />
      </Box>
      <Box mt={6}>
        <PopularRewardsPrograms />
      </Box>
      <Box mt={6}>
        <RecommendedRewardPrograms />
      </Box>
    </>
  );
};

export default Marketplace;
