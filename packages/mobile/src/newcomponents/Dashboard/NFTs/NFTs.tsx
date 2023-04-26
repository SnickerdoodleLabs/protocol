import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import CardItem from "../../Marketplace/CardItem";
import { ROUTES } from "../../../constants";
import { normalizeHeight, normalizeWidth } from "../../../themes/Metrics";
import { useNavigation } from "@react-navigation/native";
import { ipfsParse } from "./NFTDetails";
import { useAppContext } from "../../../context/AppContextProvider";
import { IDashboardChildrenProps } from "../Dashboard";

export default function NFTs({ data }: IDashboardChildrenProps) {
  const navigation = useNavigation();
  const { mobileCore } = useAppContext();
  React.useEffect(() => {}, [data]);
  const NFTs = ({ navigation }: any) => {
    useEffect(() => {
      console.log("AAAAAA", data);
    }, [data]);
    return (
      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          backgroundColor: "white",
        }}
      >
        <View style={{}}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {data.myNFTsNew.length > 0 ? (
              data?.myNFTsNew?.map(
                (nft) =>
                  nft.name && (
                    <View
                      style={{
                        paddingBottom: normalizeHeight(10),
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate(ROUTES.NFT_DETAILS, {
                            data: nft,
                            image: nft?.parsed_metadata?.image,
                          });
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "white",
                            paddingVertical: normalizeHeight(10),
                            paddingHorizontal: normalizeWidth(10),
                            borderRadius: normalizeWidth(28),
                            width: normalizeWidth(190),
                            elevation: 10,
                            shadowColor: "#04060f",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.05,
                            shadowRadius: 60,
                            /*    height: normalizeHeight(330), */
                          }}
                        >
                          <Image
                            key={nft.parsed_metadata?.image}
                            style={{
                              width: normalizeWidth(170),
                              height: normalizeHeight(180),
                              borderRadius: 15,
                            }}
                            source={{
                              uri: ipfsParse(nft.parsed_metadata?.image),
                            }}
                          />
                          <View style={{ paddingLeft: 5 }}>
                            <Text
                              style={{
                                fontWeight: "700",
                                fontSize: normalizeWidth(18),
                                color: "#424242",
                                paddingTop: normalizeHeight(12),
                                height: normalizeHeight(35),
                              }}
                            >
                              {`${nft.name ?? "Noname"}`}
                            </Text>
                            <Text
                              style={{
                                color: "#616161",
                                fontWeight: "500",
                                fontSize: normalizeWidth(12),
                                paddingTop: normalizeHeight(10),
                                paddingBottom: normalizeHeight(10),
                              }}
                            ></Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ),
              )
            ) : (
              <View
                style={{
                  marginTop: normalizeHeight(50),
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Image
                  style={{
                    width: normalizeWidth(225),
                    height: normalizeHeight(146),
                  }}
                  source={require("../../../assets/images/nftEmpty.png")}
                />
                <Text
                  style={{
                    color: "#616161",
                    fontWeight: "400",
                    fontSize: normalizeWidth(16),
                  }}
                >
                  You don’t have any NFTs
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };
  return (
    <View>
      <NFTs navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({});
