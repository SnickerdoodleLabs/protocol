import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import CardItem from "../../Marketplace/CardItem";
import { ROUTES } from "../../../constants";
import { normalizeHeight, normalizeWidth } from "../../../themes/Metrics";
import { useNavigation } from "@react-navigation/native";
import { ipfsParse } from "./NFTDetails";
import { useAppContext } from "../../../context/AppContextProvider";
import { IDashboardChildrenProps } from "../Dashboard";
import { useTheme } from "../../../context/ThemeContext";

export default function NFTs({ data }: IDashboardChildrenProps) {
  const navigation = useNavigation();
  const { mobileCore } = useAppContext();
  const theme = useTheme();
  const NFTs = ({ navigation }: any) => {
    useEffect(() => {
    }, [data]);
    return (
      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          backgroundColor: theme?.colors.background,
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
                    <View style={{ marginBottom: normalizeHeight(20) }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate(ROUTES.NFT_DETAILS, {
                            data: nft,
                            image: nft?.parsed_metadata.imageUrl,
                          });
                        }}
                      >
                        <View
                          style={{
                            width: normalizeWidth(180),
                            minHeight: normalizeHeight(260),
                            borderRadius: normalizeWidth(20),
                            borderWidth: 0.9,
                            borderColor: theme?.colors.border,
                            alignItems: "center",
                            backgroundColor: theme?.colors.backgroundSecondary,
                          }}
                        >
                          <View style={{ width: "100%" }}>
                            <Image
                              source={{
                                uri: nft.parsed_metadata?.imageUrl,
                              }}
                              style={{
                                width: "100%",
                                aspectRatio: 1,
                                borderTopLeftRadius: normalizeWidth(20),
                                borderTopRighRadius: normalizeWidth(20),
                                borderTopEndRadius: normalizeWidth(20),
                              }}
                            />
                            <View>
                              <Text
                                style={{
                                  marginTop: normalizeHeight(12),
                                  fontWeight: "700",
                                  fontSize: normalizeWidth(18),
                                  lineHeight: normalizeHeight(22),
                                  color: theme?.colors.description,
                                  textAlign: "center",
                                }}
                              >
                                {`${nft.name ?? "Noname"}`}
                              </Text>
                            </View>
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
                    color: theme?.colors.description,
                    fontWeight: "400",
                    fontSize: normalizeWidth(16),
                  }}
                >
                  You don’t have any NFTs
                </Text>
              </View>
            )}
          </View>
          <View style={{ marginBottom: normalizeHeight(50) }} />
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
