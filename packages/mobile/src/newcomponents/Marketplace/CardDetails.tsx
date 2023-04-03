import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";

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

const testData = [data, data, data];

export const LineBreaker = () => {
  return <View style={styles.lineBreaker} />;
};

const CardDetails = () => {
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <SafeAreaView>
        <View style={{ alignItems: "center" }}>
          <Image style={styles.image} source={{ uri: data.image }} />
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.subTitle}>Created By {data.company}</Text>
          <LineBreaker />
          <Text style={styles.claimed}>{data.claimed}</Text>
          <Text style={styles.peopleClaimed}>People Claimed</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <View style={{ marginVertical: normalizeHeight(20) }}>
              <LineBreaker />
            </View>
            <Text style={styles.company}>{data.company}</Text>
            <Text style={styles.description}>
              An icon evolves. Introducing the P.F.D – Personal Flotation
              Device. True to its aesthetic roots, but elevated with a meta
              twist. Watch the three stripes float as you inflate above the
              floor, away from nasty blimps and rug pulls. Don’t wait until it’s
              too late. Everyone needs a Mae West, and this one’s a true virtual
              life saver: the life vest of the metaverse.
            </Text>
            <View
              style={{ flexDirection: "row", marginTop: 50, marginBottom: 20 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../../assets/images/etherscan-logo.png")}
                />
                <Text style={{ marginLeft: 5 }}>Etherscan</Text>
              </View>

              <View style={styles.linkContainer}>
                <Image source={require("../../assets/images/ipfs-logo.png")} />
                <Text style={{ marginLeft: 5 }}>IPFS</Text>
              </View>
            </View>
          </View>

          <View style={[styles.descriptionContainer, { marginTop: 24 }]}>
            <Text style={styles.descriptionTitle}>To Claim This Reward</Text>
            <Text style={styles.subTitle2}>You are renting your:</Text>
            <View style={{ marginVertical: normalizeHeight(20) }}>
              <LineBreaker />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/images/browserData-renting.png")}
              />
              <Text style={{ marginLeft: normalizeWidth(12) }}>
                Token Balance Data
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: normalizeHeight(20),
              }}
            >
              <Image
                source={require("../../assets/images/gender-renting.png")}
              />
              <Text style={{ marginLeft: normalizeWidth(12) }}>
                Token Balance Data
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: normalizeHeight(20),
              }}
            >
              <Image
                source={require("../../assets/images/tokenBalance-renting.png")}
              />
              <Text style={{ marginLeft: normalizeWidth(12) }}>
                Token Balance Data
              </Text>
            </View>
          </View>

          <View style={[styles.descriptionContainer, { marginTop: 24 }]}>
            <Text style={styles.descriptionTitle}>Properties</Text>

            <View style={{ marginVertical: normalizeHeight(20) }}>
              <LineBreaker />
            </View>
            {testData.map((val, index) => {
              return (
                <View>
                  <Text style={[styles.peopleClaimed, { fontWeight: "600" }]}>
                    Year
                  </Text>
                  <Text
                    style={[
                      styles.subTitle,
                      { fontWeight: "700", marginTop: normalizeHeight(8) },
                    ]}
                  >
                    2022
                  </Text>

                  <View>
                    {index + 1 !== testData.length && <LineBreaker />}
                  </View>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#6E62A6",
              width: normalizeWidth(380),
              height: normalizeHeight(58),
              borderRadius: normalizeWidth(100),
              marginVertical:normalizeHeight(15),
              justifyContent: "center",
            }}
            onPress={() => {}}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "700",
                fontSize: normalizeWidth(16),
              }}
            >
              Claim Reward
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CardDetails;

const styles = StyleSheet.create({
  image: {
    width: normalizeWidth(380),
    height: normalizeHeight(380),
  },
  title: {
    fontWeight: "700",
    fontSize: normalizeWidth(24),
    lineHeight: normalizeHeight(29),
    color: "#424242",
    paddingVertical: normalizeHeight(12),
  },
  subTitle: {
    fontWeight: "500",
    fontSize: normalizeWidth(16),
    lineHeight: normalizeHeight(22),
    color: "#616161",
    paddingBottom: normalizeHeight(16),
  },
  lineBreaker: {
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
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
    borderColor: "#EEEEEE",
    borderRadius: normalizeWidth(24),
    width: "90%",
    padding: normalizeWidth(20),
  },
  descriptionTitle: {
    fontSize: normalizeWidth(24),
    fontWeight: "700",
    color: "#424242",
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
    color: "#616161",
    marginTop: normalizeHeight(20),
  },
  subTitle2: {
    marginVertical: normalizeHeight(8),
    fontSize: normalizeWidth(16),
    fontWeight: "500",
    color: "#616161",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 30,
  },
});
