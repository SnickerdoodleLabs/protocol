import emptyTag from "@extension-onboarding/assets/images/empty-tag.png";
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
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  Box,
  Collapse,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {
  ETag,
  MarketplaceListing,
  MarketplaceTag,
  PagedResponse,
  PagingRequest,
} from "@snickerdoodlelabs/objects";
import { ResultUtils } from "neverthrow-result-utils";
import React, { useEffect, useMemo, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";

declare const window: IWindowWithSdlDataWallet;

const Marketplace = () => {
  const classes = useMarketplaceStyles();
  const navigate = useNavigate();
  const handleCategoryClick = (tag: ETag) => {
    navigate(generatePath(EPaths.MARKETPLACE_TAG_DETAIL, { tag }));
  };
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(
    !localStorage.getItem(LOCAL_STORAGE_REWARDS_MARKETPLACE_INTRODUCTION),
  );
  const [listings, setListings] =
    useState<Record<ETag, PagedResponse<MarketplaceListing>>>();

  useEffect(() => {
    ResultUtils.combine(
      Object.values(ETag).map((tag) =>
        window.sdlDataWallet
          ?.getMarketplaceListingsByTag(
            new PagingRequest(1, 50),
            tag as MarketplaceTag,
          )
          .map(
            (response) =>
              ({ [tag]: response } as Record<
                ETag,
                PagedResponse<MarketplaceListing>
              >),
          ),
      ),
    ).map((responses) => {
      const structuredItems = responses.reduce((acc, item) => {
        acc = { ...acc, ...item };
        return acc;
      }, {} as Record<ETag, PagedResponse<MarketplaceListing>>);
      setListings(structuredItems);
    });
  }, []);

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
    isEmpty: boolean;
    isLoading: boolean;
  } = useMemo(() => {
    if (!listings) return { isLoading: true, isEmpty: false };
    const listingObj = Object.values(listings).reduce(
      (acc, item) => {
        acc.featured = [...acc.featured, ...item.response.slice(0, 1)];
        acc.popular = [...acc.popular, ...item.response.slice(1, 2)];
        acc.recommended = [...acc.recommended, ...item.response.slice(2, -1)];

        return acc;
      },
      {
        featured: [] as MarketplaceListing[],
        popular: [] as MarketplaceListing[],
        recommended: [] as MarketplaceListing[],
      },
    );

    return {
      featured: listingObj.featured.sort(
        (current, next) =>
          Number(next.stakeAmount) - Number(current.stakeAmount),
      ),
      popular: listingObj.popular.sort(
        (current, next) =>
          Number(next.stakeAmount) - Number(current.stakeAmount),
      ),
      recommended: listingObj.recommended.sort(
        (current, next) =>
          Number(next.stakeAmount) - Number(current.stakeAmount),
      ),
      isLoading: false,
      isEmpty: !(Object.values(listingObj).flat().length > 0),
    };
  }, [listings]);

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
            Top Categories
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
      {!isLoading && isEmpty && (
        <Box
          mt={7}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <img width={337} height="auto" src={emptyTag} />
          <Typography className={classes.emptyText}>
            There are no available rewards programs yet.
          </Typography>
        </Box>
      )}
      {featured && featured.length > 0 && (
        <Box mt={6}>
          <FeaturedRewardsPrograms listings={featured} />
        </Box>
      )}
      {popular && popular.length > 0 && (
        <Box mt={6}>
          <PopularRewardsPrograms listings={popular} />
        </Box>
      )}
      {recommended && recommended.length > 0 && (
        <Box mt={6}>
          <RecommendedRewardPrograms listings={recommended} />
        </Box>
      )}
    </>
  );
};

export default Marketplace;
