import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import CardItem from "../../Marketplace/CardItem";
import { ROUTES } from "../../../constants";
import { normalizeHeight, normalizeWidth } from "../../../themes/Metrics";
import { useNavigation } from "@react-navigation/native";

export default function NFTs({ data }) {
  const navigation = useNavigation();
  React.useEffect(() => {
    console.log("NFTSSSS", data);
  }, [data]);
  const NFTs = ({ navigation }: any) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(ROUTES.IMAGE_CAROUSEL, { NFTs: data.nfts.images })
        }
        style={{
          paddingHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 40,
        }}
      >
        <View style={{ width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {data?.nfts?.images?.map((data) => (
              <View style={{ paddingBottom: 10 }}>
                <Image
                  key={data}
                  style={{
                    width: normalizeWidth(180),
                    height: normalizeHeight(180),
                    borderRadius: 15,
                  }}
                  source={{
                    uri: data,
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <NFTs navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({});
