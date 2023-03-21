import Breadcrumb from "@extension-onboarding/components/Breadcrumb";
import { tags } from "@extension-onboarding/constants/tags";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useStyles } from "@extension-onboarding/pages/Details/screens/Marketplace/CategoryDetail/CategoryDetail.style";
import { useMarketplaceStyles } from "@extension-onboarding/pages/Details/screens/Marketplace/Marketplace.style";
import {
  FeaturedRewardsPrograms,
  PopularRewardsPrograms,
  RecommendedRewardPrograms,
} from "@extension-onboarding/pages/Details/screens/Marketplace/components/Sections";
import { Box, MenuItem, Select, Typography } from "@material-ui/core";
import { ETag } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";
import {
  useParams,
  matchPath,
  useLocation,
  useNavigate,
  generatePath,
} from "react-router-dom";
const CategoryDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { tag } = params ?? {};
  const classes = useStyles();
  const marketplaceClasses = useMarketplaceStyles();
  const handleCategoryClick = (tag: ETag) => {
    navigate(generatePath(EPaths.MARKETPLACE_TAG_DETAIL, { tag }));
  };
  const tagDisplayName =
    tags.find((_tag) => _tag.tag === tag)?.defaultDisplayName ??
    tag
      ?.split("-")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(" ") ??
    "";
  return (
    <Box>
      <Breadcrumb currentPathName={tagDisplayName} />
      <Box mt={4} display="flex" alignItems="flex-end">
        <Typography className={marketplaceClasses.title}>
          {tagDisplayName}
        </Typography>
        <Box marginLeft="auto">
          <Select
            className={marketplaceClasses.select}
            fullWidth
            variant="outlined"
            name="accounts"
            value={tag ?? "unselected"}
            placeholder="All"
            onChange={(event) => {
              if (event.target.value != "unselected") {
                handleCategoryClick(event.target.value as ETag);
              } else {
                navigate(EPaths.MARKETPLACE);
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
      </Box>
      {/* <Box mt={6}>
        <FeaturedRewardsPrograms tag={tag as ETag | undefined} />
      </Box> */}
      <Box mt={6}>
        <PopularRewardsPrograms tag={tag as ETag | undefined} />
      </Box>
      <Box mt={6}>
        <RecommendedRewardPrograms tag={tag as ETag | undefined} />
      </Box>
    </Box>
  );
};

export default CategoryDetail;
