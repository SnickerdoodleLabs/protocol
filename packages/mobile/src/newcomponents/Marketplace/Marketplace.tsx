import {
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import Orientation from "react-native-orientation-locker";
import { useAppContext } from "../../context/AppContextProvider";
import { ResultUtils } from "neverthrow-result-utils";
import {
  ETag,
  IOpenSeaMetadata,
  IPFSError,
  MarketplaceListing,
  MarketplaceTag,
  PagedResponse,
  PagingRequest,
  QueryTypePermissionMap,
  QueryTypes,
  UnauthorizedError,
} from "@snickerdoodlelabs/objects";
import { ITagItem, tags } from "./tags";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import CardItem from "./CardItem";
import SearchBar from "../Custom/SearchBar";
import { ResultAsync, okAsync } from "neverthrow";
import { ipfsParse } from "../Dashboard/NFTs/NFTDetails";
import { walletDataTypeMap } from "./CardDetails";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../context/ThemeContext";

export default function Marketplace() {
  const { mobileCore } = useAppContext();
  const [categoryFilter, setCategoryFilter] = useState<boolean>(false);
  const [listings, setListings] =
    useState<Record<ETag, PagedResponse<MarketplaceListing>>>();
  const [allListings, setAllListings] = useState<IOpenSeaMetadata[]>([]);
  const [filteredData, setFilteredData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredByCategory, setFilteredByCategory] = useState(null);

  const animatedWidth = React.useState(new Animated.Value(0))[0];
  const theme = useTheme();

  React.useEffect(() => {
    console.log("UseEffect7");

    Orientation.lockToPortrait(); // lock to portrait mode
  }, []);

  useEffect(() => {
    console.log("UseEffect3");

    ResultUtils.combine(
      Object.values(ETag).map((tag) =>
        mobileCore
          .getCore()
          .marketplace?.getMarketplaceListingsByTag(
            new PagingRequest(1, 50),
            tag as MarketplaceTag,
            true,
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

      let allResponseListings = [];

      for (const key in structuredItems) {
        if (
          structuredItems.hasOwnProperty(key) &&
          structuredItems[key].response.length > 0
        ) {
          allResponseListings.push(...structuredItems[key].response);
        }
      }
      Promise.all(getAllCampaigns(allResponseListings))
        .then((resolved) => {
          return resolved.map((a) => {
            return a.value;
          });
        })
        .then((allListingsOpensea) => {
          const filtered = allListingsOpensea.filter(
            (obj, index, self) =>
              index ===
              self.findIndex(
                (o) => o.marketplaceListing.cid === obj.marketplaceListing.cid,
              ),
          );
          setAllListings(filtered);
        });

      setListings(structuredItems);
    });
  }, []);

  const getAllCampaigns = (marketplaceListings: MarketplaceListing[]) => {
    return marketplaceListings?.map?.((rewardProgram: MarketplaceListing) => {
      return mobileCore
        .getCore()
        .getInvitationMetadataByCID(rewardProgram?.cid)
        .map((metaData) => {
          return {
            ...metaData,
            tag: rewardProgram.tag,
            marketplaceListing: rewardProgram,
          };
        });
    });
  };

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
    console.log("UseEffect5");

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

  const renderTopCategories = ({ item }) => {
    console.log("UseEffect6");

    return (
      <View style={{ marginRight: normalizeWidth(10) }}>
        <TouchableOpacity
          onPress={() => {
            const filtered = allListings?.filter((data) => {
              const itemData =
                `${data.title} ${data.rewardName} ${data.description} ${data.tag}`.toUpperCase();
              const queryData = item.tag.toUpperCase();
              return itemData.indexOf(queryData) > -1;
            });
            if (filtered.length > 0) {
              console.log("aaaaa", filtered);
              setFilteredByCategory(filtered);
            } else {
              //@ts-ignore
              setFilteredByCategory([
                {
                  tag: item.tag,
                },
              ]);
            }
          }}
        >
          <Image
            style={{
              width: normalizeWidth(180),
              height: normalizeHeight(180),
            }}
            source={item?.iconUrl}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderFeatured = ({ item }) => {
    return (
      <View style={{ marginRight: normalizeWidth(10) }}>
        <CardItem marketplaceListing={item} />
      </View>
    );
  };
  const renderFiltered = ({ item }) => {
    return (
      <View style={{ marginRight: normalizeWidth(10) }}>
        <CardItem marketplaceListing={item.marketplaceListing} />
      </View>
    );
  };

  const handleSearch = (text) => {
    const filtered = allListings?.filter((item) => {
      const itemData =
        `${item.title} ${item.rewardName} ${item.description} ${item.tag}`.toUpperCase();
      const queryData = text.toUpperCase();
      return itemData.indexOf(queryData) > -1;
    });
    setSearchQuery(text);
    setFilteredData(filtered);
  };

  const onClickCategoryFilter = () => {
    setCategoryFilter(!categoryFilter);
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: theme?.colors.background, height: "100%" }}
    >
      <ScrollView>
        <SafeAreaView style={{ marginLeft: normalizeWidth(15) }}>
          <View>
            <View>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: normalizeWidth(24),
                  color: theme?.colors.title,
                  marginVertical: normalizeHeight(25),
                }}
              >
                Rewards Marketplace
              </Text>

              <SearchBar
                onSearch={handleSearch}
                onClickCategoryFilter={onClickCategoryFilter}
              />
            </View>
            {searchQuery.length === 0 && !filteredByCategory && (
              <View>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: normalizeWidth(20),
                    color: theme?.colors.description,
                    marginTop: normalizeHeight(15),
                    marginBottom: normalizeHeight(25),
                  }}
                >
                  Explore Top Categories
                </Text>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <FlatList
                    data={tags}
                    renderItem={renderTopCategories}
                    horizontal={true}
                    keyExtractor={(item) => item.tag.toString()}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>

                {featured?.length > 0 && (
                  <View>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: normalizeWidth(20),
                        color: theme?.colors.description,
                        marginTop: normalizeHeight(35),
                        marginBottom: normalizeHeight(15),
                      }}
                    >
                      Featured Rewards Programs
                    </Text>
                    <View>
                      <View>
                        <FlatList
                          data={featured}
                          renderItem={renderFeatured}
                          horizontal={true}
                          keyExtractor={(item) => item.tag.toString()}
                          showsHorizontalScrollIndicator={false}
                        />
                      </View>
                    </View>
                  </View>
                )}

                {popular?.length > 0 && (
                  <View>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: normalizeWidth(20),
                        color: theme?.colors.description,
                        marginTop: normalizeHeight(35),
                        marginBottom: normalizeHeight(15),
                      }}
                    >
                      Popular Rewards Programs
                    </Text>
                    <View>
                      <View style={{}}>
                        <FlatList
                          data={popular}
                          renderItem={renderFeatured}
                          horizontal={true}
                          keyExtractor={(item) => item.tag.toString()}
                          showsHorizontalScrollIndicator={false}
                        />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            )}
            {searchQuery.length > 0 && !filteredByCategory && (
              <View>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: normalizeWidth(20),
                    color: theme?.colors.description,
                    marginTop: normalizeHeight(15),
                    marginBottom: normalizeHeight(25),
                  }}
                >
                  Search Results
                </Text>

                <View style={{}}>
                  <FlatList
                    data={filteredData}
                    renderItem={renderFiltered}
                    horizontal={true}
                    keyExtractor={(item) => item.tag.toString()}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              </View>
            )}

            {filteredByCategory && (
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    size={30}
                    name="arrow-back-outline"
                    onPress={() => {
                      setFilteredByCategory(null);
                    }}
                    color={theme?.colors.description}
                  />

                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: normalizeWidth(20),
                      color: theme?.colors.description,
                      marginTop: normalizeHeight(25),
                      marginBottom: normalizeHeight(25),
                      marginLeft: normalizeWidth(5),
                      textTransform: "capitalize",
                    }}
                  >
                    {filteredByCategory[0]?.tag}
                  </Text>
                </View>
                {!filteredByCategory[0]?.image && (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Image
                      style={{
                        width: "80%",
                        height: normalizeHeight(200),
                        marginLeft: normalizeWidth(-5),
                      }}
                      source={require("../../assets/images/empty-tag.png")}
                    />
                    <Text
                      style={{
                        fontSize: normalizeWidth(15),
                        textAlign: "center",
                        paddingHorizontal: "15%",
                      }}
                    >
                      There are no available rewards programs in this category.
                    </Text>
                  </View>
                )}

                <View style={{}}>
                  <FlatList
                    data={filteredByCategory}
                    renderItem={renderFiltered}
                    horizontal={true}
                    keyExtractor={(item) => item.tag.toString()}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              </View>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
}
