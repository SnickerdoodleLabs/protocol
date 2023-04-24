import {
  Button,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";
import CardItem from "./CardItem";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import { useAppContext } from "../../context/AppContextProvider";
import { IpfsCID } from "@snickerdoodlelabs/objects";

const MarketplaceOld = () => {
  const { mobileCore } = useAppContext();
  const [listings, setListings] = React.useState<IpfsCID[]>([]);
  const [myRewards, setMyRewards] = React.useState([]);

  useEffect(() => {
    mobileCore
      .getCore()
      .marketplace.getMarketplaceListings()
      .map((listing) => {
        setListings(listing.cids);
      });
  }, []);

  useEffect(() => {
    mobileCore.accountService.getEarnedRewards().map((earnedRewards) => {
      return setMyRewards(earnedRewards);
    });
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <ScrollView>
        <SafeAreaView style={{ marginHorizontal: normalizeWidth(20) }}>
          <Text style={styles.title}>Rewards Marketplace</Text>
          <View style={styles.banner}>
            <Image
              style={styles.bannerImage}
              source={require("../../assets/images/marketplaceBanner.png")}
            />
          </View>

          <View style={{ alignItems: "center" }}>
            <View>
              <Text style={styles.subtitle}>Join Snickerdoodle</Text>
            </View>
            <View>
              <Text style={styles.description}>
                Sign in with the crypto wallet of your choice. Link more
                accounts and see all your asset information in one place.
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={styles.sectionTitle}>My Rewards</Text>
            </View>
            <View>
              <Button color="#5D4F97" title="See All" />
            </View>
          </View>
          <View>
            <View>
              <Text style={styles.sectionDescription}>
                Your NFTs, from linked accounts and newly earned rewards.
              </Text>
            </View>
          </View>
          <View>
            <View>
              <FlatList
                style={{ marginLeft: -normalizeWidth(10) }}
                data={myRewards}
                renderItem={({ item, index }) => (
                  <View
                    style={[
                      { marginTop: normalizeWidth(20) },
                      (index + 1) % 2 === 0 && {
                        marginLeft: normalizeWidth(20),
                      },
                    ]}
                  >
                    <CardItem
                      imageSource={""}
                      title={""}
                      description={""}
                      cid={item}
                    />
                  </View>
                )}
                keyExtractor={(item) => item}
                contentContainerStyle={{
                  padding: 10,
                  justifyContent: "space-between",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
                numColumns={2}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={styles.sectionTitle}>Available Rewards</Text>
            </View>
            <View>
              <Button color="#5D4F97" title="See All" />
            </View>
          </View>
          <View>
            <View>
              <Text style={styles.sectionDescription}>
                Your NFTs, from linked accounts and newly earned rewards.
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <FlatList
                style={{ marginLeft: -normalizeWidth(10) }}
                data={listings}
                renderItem={({ item, index }) => (
                  <View
                    style={[
                      { marginTop: normalizeWidth(15) },
                      (index + 1) % 2 === 0 && {
                        marginLeft: normalizeWidth(15),
                      },
                    ]}
                  >
                    <CardItem
                      imageSource="https://www.cnet.com/a/img/resize/e547a2e4388fcc5ab560f821ac170a59b9fb0143/hub/2021/12/13/d319cda7-1ddd-4855-ac55-9dcd9ce0f6eb/unnamed.png?auto=webp&fit=crop&height=1200&width=1200"
                      title="Ugly Sweater NFT"
                      description="Limited."
                      cid={item}
                    />
                  </View>
                )}
                keyExtractor={(item) => item}
                contentContainerStyle={{
                  padding: 10,
                  justifyContent: "space-between",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
                numColumns={2}
              />
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MarketplaceOld;

const styles = StyleSheet.create({
  title: {
    // fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: normalizeWidth(24),
    lineHeight: normalizeHeight(29),
    color: "#424242",
  },
  banner: {
    marginTop: normalizeHeight(30),
    alignItems: "center",
  },
  bannerImage: {
    width: normalizeWidth(380),
    height: normalizeHeight(127),
  },
  subtitle: {
    // fontFamily: "Roboto",
    fontWeight: "700",
    fontStyle: "italic",
    fontSize: normalizeWidth(22),
    lineHeight: normalizeHeight(32),
    textAlign: "center",
    marginVertical: normalizeHeight(12),
  },
  description: {
    // fontFamily: "Roboto",
    color: "#616161",
    fontWeight: "400",
    fontSize: normalizeWidth(16),
    lineHeight: normalizeHeight(22),
    textAlign: "center",
  },
  sectionTitle: {
    color: "#424242",
    fontWeight: "700",
    fontSize: normalizeWidth(20),
    lineHeight: normalizeHeight(24),
    marginVertical: normalizeHeight(24),
  },
  sectionDescription: {
    color: "#616161",
    fontWeight: "500",
    fontSize: normalizeWidth(16),
    lineHeight: normalizeHeight(22),
  },
  button: {
    color: "#5D4F97",
    fontWeight: "700",
    fontSize: normalizeWidth(16),
  },
});
