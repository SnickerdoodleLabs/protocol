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
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import { useNavigation } from "@react-navigation/native";
import { useLayoutContext } from "../../context/LayoutContext";
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
import { useAppContext } from "../../context/AppContextProvider";

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

const permissionImage = {
  Gender: require("../../assets/images/renting-gender.png"),
  Age: require("../../assets/images/renting-birthday.png"),
  "Country of Residence": require("../../assets/images/renting-location.png"),
  "Browser history (most visited URLs)": require("../../assets/images/renting-siteVisited.png"),
  "Decentralized applications you've interacted with": require("../../assets/images/renting-transaction.png"),
  "Aggregated token holdings and NFT collections": require("../../assets/images/renting-nfts.png"),
};

const testData = [data, data, data];

export interface IInvitationParams {
  consentAddress: EVMContractAddress | undefined;
  tokenId: BigNumberString | undefined;
  signature: Signature | undefined;
}

export const LineBreaker = () => {
  return <View style={styles.lineBreaker} />;
};

const ipfsParse = (ipfs: string) => {
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

const CardDetails = ({ navigation, route }) => {
  const { setInvitationStatus } = useLayoutContext();
  const [invitationParams, setInvitationParams] =
    React.useState<IInvitationParams>();

  const rewardItem = route.params;
  const { mobileCore } = useAppContext();

  const getTokenId = (tokenId: BigNumberString | undefined) => {
    if (tokenId) {
      return okAsync(TokenId(BigInt(tokenId)));
    }
    return mobileCore.getCyrptoUtils().getTokenId();
  };

  const checkInvitationStatus = (consentAddress, tokenId, signature) => {
    console.warn("CHECKING INVITATION");
    const invitationService = mobileCore.invitationService;
    let _invitation: Invitation;

    getTokenId(tokenId).andThen((tokenId) => {
      _invitation = {
        consentContractAddress: consentAddress as EVMContractAddress,
        domain: DomainName(""),
        tokenId,
        businessSignature: (signature as Signature) ?? null,
      };
      return invitationService
        .checkInvitationStatus(_invitation)
        .map((status) => {
          if (status === EInvitationStatus.New) {
            mobileCore.invitationService
              .getConsentContractCID(consentAddress as EVMContractAddress)
              .map((ipfsCID) => {
                mobileCore.invitationService
                  .getInvitationMetadataByCID(ipfsCID)
                  .map((metaData) => {
                    setInvitationStatus(true, metaData, _invitation);
                  });
              });
          } else {
            setInvitationParams(undefined);
          }
        })
        .mapErr((e) => {
          console.error("INVITATION STATUS ERROR", e);
          setInvitationParams(undefined);
        });
    });
  };

  const onClaimClick = (url: string) => {
    if (!url) {
      return null;
    }
    const isURL = isValidURL(url);
    if (isURL) {
      return Linking.openURL(url).catch((err) =>
        console.error("An error occurred", err),
      );
    } else {
      return checkInvitationStatus(url, null, null);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <SafeAreaView>
        <View style={{ alignItems: "center" }}>
          <Image
            style={styles.image}
            source={{ uri: ipfsParse(rewardItem?.image) }}
          />
          <Text style={styles.title}>{rewardItem?.name}</Text>
          <Text style={styles.subTitle}>
            Created By{" "}
            {
              rewardItem?.attributes?.filter(
                (attribute) => attribute?.trait_type === "createdBy",
              )[0].value
            }
          </Text>
          <LineBreaker />
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
            <Text style={styles.description}>{rewardItem?.description}</Text>
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

            {rewardItem?.attributes
              ?.filter(
                (attribute) => attribute?.trait_type === "requiredPermissions",
              )[0]
              .value.map((permission) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: normalizeHeight(15),
                    }}
                  >
                    <Image source={permissionImage[permission]} />
                    <Text style={{ marginLeft: normalizeWidth(12) }}>
                      {permission}
                    </Text>
                  </View>
                );
              })}
          </View>

          <View style={[styles.descriptionContainer, { marginTop: 24 }]}>
            <Text style={styles.descriptionTitle}>Properties</Text>

            <View style={{ marginVertical: normalizeHeight(20) }}>
              <LineBreaker />
            </View>
            {rewardItem?.attributes
              ?.filter(
                (attribute) =>
                  attribute?.trait_type !== "requiredPermissions" &&
                  attribute?.trait_type !== "createdBy",
              )
              .map((test, index) => {
                return (
                  <View>
                    <Text style={[styles.peopleClaimed, { fontWeight: "600" }]}>
                      {test.trait_type.toUpperCase()}
                    </Text>
                    <Text
                      style={[
                        styles.subTitle,
                        { fontWeight: "700", marginTop: normalizeHeight(8) },
                      ]}
                    >
                      {test.value}
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
              marginVertical: normalizeHeight(15),
              justifyContent: "center",
            }}
            onPress={() => {
              onClaimClick(rewardItem.external_url);
            }}
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
