import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { normalizeHeight, normalizeWidth } from "../../../themes/Metrics";
import { useNavigation } from "@react-navigation/native";
import { useLayoutContext } from "../../../context/LayoutContext";
import { okAsync } from "neverthrow";
import {
  BigNumberString,
  DomainName,
  EInvitationStatus,
  EVMContractAddress,
  Invitation,
  Signature,
  TokenId,
} from "@snickerdoodlelabs/objects";
import { useAppContext } from "../../../context/AppContextProvider";
import { useTheme } from "../../../context/ThemeContext";

interface ICardDetailsProps {
  image: any;
  title: any;
  description: string;
  claimed: number;
  company: string;
}

const data: ICardDetailsProps = {
  image:
    "https://uploads-ssl.webflow.com/61c0120d981c8f9d9322c0e0/61ca497efc91881256158064_blog%20article.png",
  title: "SDL Dinosaur Cookie Man",
  claimed: 5466,
  description:
    "An icon evolves. Introducing the P.F.D – Personal Flotation Device. True to its aesthetic roots, but elevated with a meta twist. Watch the three stripes float as you inflate above the floor, away from nasty blimps and rug pulls. Don’t wait until it’s too late. Everyone needs a Mae West, and this one’s a true virtual life saver: the life vest of the metaverse.",
  company: "SDL",
};

export interface IInvitationParams {
  consentAddress: EVMContractAddress | undefined;
  tokenId: BigNumberString | undefined;
  signature: Signature | undefined;
}

export const LineBreaker = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        width: "90%",
        borderBottomWidth: 1,
        borderColor: theme?.colors.border,
      }}
    />
  );
};

export const ipfsParse = (ipfs: string) => {
  let a;
  if (ipfs) {
    a = ipfs.replace("ipfs://", "");
  }
  return `https://cloudflare-ipfs.com/ipfs/${a}`;
};

export const isValidURL = (url: string) => {
  const regexpUrl = /(https?|ipfs)/i;
  return !!regexpUrl.test(url);
};

const NFTDetails = ({ navigation, route }) => {
  const rewardItem = route.params;
  const theme = useTheme();

  const styles = StyleSheet.create({
    image: {
      width: normalizeWidth(380),
      height: normalizeHeight(380),
      borderRadius: normalizeWidth(40),
    },
    title: {
      fontWeight: "700",
      fontSize: normalizeWidth(24),
      lineHeight: normalizeHeight(29),
      color: theme?.colors.title,
      paddingVertical: normalizeHeight(12),
    },
    subTitle: {
      fontWeight: "500",
      fontSize: normalizeWidth(16),
      lineHeight: normalizeHeight(22),
      color: theme?.colors.description,
      paddingBottom: normalizeHeight(16),
    },
    lineBreaker: {
      width: "90%",
      borderBottomWidth: 1,
      borderBottomColor: theme?.colors.border,
    },
    claimed: {
      fontWeight: "700",
      fontSize: normalizeWidth(24),
      lineHeight: normalizeHeight(29),
      color: "#4E4676",
      marginTop: normalizeHeight(16),
    },
    peopleClaimed: {
      fontWeight: "500",
      fontSize: normalizeWidth(14),
      color: "#616161",
      marginTop: normalizeHeight(8),
    },
    descriptionContainer: {
      borderWidth: 1,
      borderColor: theme?.colors.border,
      borderRadius: normalizeWidth(24),
      width: "90%",
      padding: normalizeWidth(20),
    },
    descriptionTitle: {
      fontSize: normalizeWidth(24),
      fontWeight: "700",
      color: theme?.colors.description,
    },
    company: {
      fontWeight: "600",
      fontSize: normalizeWidth(14),
      color: "#5D4F97",
    },
    description: {
      fontWeight: "500",
      fontSize: normalizeWidth(14),
      lineHeight: normalizeHeight(20),
      color: theme?.colors.description,
    },
    subTitle2: {
      marginVertical: normalizeHeight(8),
      fontSize: normalizeWidth(16),
      fontWeight: "500",
      color: theme?.colors.description,
    },
    linkContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

  return (
    <SafeAreaView>
      <ScrollView style={{ backgroundColor: theme?.colors.background }}>
        <SafeAreaView>
          <View style={{ alignItems: "center" }}>
            <Image
              style={styles.image}
              source={{
                uri: rewardItem.image,
              }}
            />
            <Text style={styles.title}>{rewardItem?.data?.name}</Text>
            <Text style={styles.subTitle}></Text>
            {/*  <Text style={styles.claimed}>{data.claimed}</Text>
            <Text style={styles.peopleClaimed}>People Claimed</Text> */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <View style={{ marginVertical: normalizeHeight(20) }}>
                <LineBreaker />
              </View>
              <Text style={styles.company}>
                {
                  rewardItem?.attributes?.filter(
                    (attribute) => attribute?.trait_type === "createdBy",
                  )[0].value
                }
              </Text>
              <Text style={styles.description}>
                {rewardItem.data?.parsed_metadata?.description}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 50,
                  marginBottom: 20,
                }}
              >
                <View style={styles.linkContainer}>
                  <Image
                    source={require("../../../assets/images/ipfs-logo.png")}
                  />
                  <Text
                    style={{ marginLeft: 5, color: theme?.colors.description }}
                  >
                    IPFS
                  </Text>
                </View>
              </View>
            </View>
            {rewardItem.data?.parsed_metadata?.traits?.length > 0 && (
              <View style={[styles.descriptionContainer, { marginTop: 24 }]}>
                <Text style={styles.descriptionTitle}>Properties</Text>

                <View style={{ marginVertical: normalizeHeight(20) }}>
                  <LineBreaker />
                </View>
                {rewardItem?.data?.parsed_metadata?.traits?.map?.(
                  (data, index) => {
                    return (
                      <View>
                        <Text
                          style={[styles.peopleClaimed, { fontWeight: "600" }]}
                        >
                          {data.trait_type.toUpperCase()}
                        </Text>
                        <Text
                          style={[
                            styles.subTitle,
                            {
                              fontWeight: "700",
                              marginTop: normalizeHeight(8),
                            },
                          ]}
                        >
                          {data.value}
                        </Text>

                        <View>
                          {index + 1 !==
                            rewardItem?.data?.parsed_metadata?.traits
                              ?.length && <LineBreaker />}
                        </View>
                      </View>
                    );
                  },
                )}
              </View>
            )}
          </View>
          <View style={{ marginBottom: normalizeHeight(60) }} />
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NFTDetails;
