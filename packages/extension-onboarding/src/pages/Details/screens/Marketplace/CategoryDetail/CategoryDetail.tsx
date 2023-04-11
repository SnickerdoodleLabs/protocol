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
import {
  ETag,
  MarketplaceListing,
  MarketplaceTag,
  PagedResponse,
  PagingRequest,
} from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
  useParams,
  matchPath,
  useLocation,
  useNavigate,
  generatePath,
} from "react-router-dom";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";

declare const window: IWindowWithSdlDataWallet;

const CategoryDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { tag } = params ?? {};
  const classes = useStyles();
  const [listings, setListings] = useState<PagedResponse<MarketplaceListing>>();
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

  useEffect(() => {
    window.sdlDataWallet
      ?.getMarketplaceListingsByTag(
        new PagingRequest(1, 50),
        tag as MarketplaceTag,
      )
      .map((response) => setListings(response));
  }, [tag]);

  const {
    featured,
    popular,
    recommended,
    isLoading,
    isEmpty,
  }: {
    featured?: MarketplaceListing[];
    popular?: MarketplaceListing[];
    recommended?: MarketplaceListing[];
    isLoading: boolean;
    isEmpty: boolean;
  } = useMemo(() => {
    if (!listings) return { isLoading: true, isEmpty: false };
    const res: {
      featured: MarketplaceListing[];
      popular: MarketplaceListing[];
      recommended: MarketplaceListing[];
      isLoading: boolean;
      isEmpty: boolean;
    } = {
      featured: [],
      popular: [],
      recommended: [],
      isLoading: false,
      isEmpty: !(listings.totalResults > 0),
    };

    res.featured = [...res.featured, ...listings.response.slice(0, 1)];
    res.popular = [...res.popular, ...listings.response.slice(1, 2)];
    res.recommended = [...res.recommended, ...listings.response.slice(2, -1)];
    return res;
  }, [listings]);

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
      {featured && featured.length > 0 && (
        <Box mt={6}>
          <FeaturedRewardsPrograms
            listings={featured}
            tag={tag as ETag | undefined}
          />
        </Box>
      )}
      {popular && popular.length > 0 && (
        <Box mt={6}>
          <PopularRewardsPrograms
            listings={popular}
            tag={tag as ETag | undefined}
          />
        </Box>
      )}
      {recommended && recommended.length > 0 && (
        <Box mt={6}>
          <RecommendedRewardPrograms
            listings={recommended}
            tag={tag as ETag | undefined}
          />
        </Box>
      )}
    </Box>
  );
};

export default CategoryDetail;
