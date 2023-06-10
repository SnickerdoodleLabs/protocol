import {
  FlatList,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import { useNavigation } from "@react-navigation/native";
import { useLayoutContext } from "../../context/LayoutContext";
import { okAsync } from "neverthrow";
import {
  BigNumberString,
  DomainName,
  EInvitationStatus,
  EVMContractAddress,
  EWalletDataType,
  IOpenSeaMetadata,
  Invitation,
  MarketplaceListing,
  PossibleReward,
  QueryTypePermissionMap,
  PermissionQueryTypeMap,
  Signature,
  TokenId,
  QueryTypes,
  IConsentCapacity,
} from "@snickerdoodlelabs/objects";
import { useAppContext } from "../../context/AppContextProvider";
import Icon from "react-native-vector-icons/Ionicons";
import { ResultUtils } from "neverthrow-result-utils";
import { useTheme } from "../../context/ThemeContext";

interface ICardDetailsProps {
  image: any;
  title: any;
  description: string;
  claimed: number;
  company: string;
}

export interface IInvitationParams {
  consentAddress: EVMContractAddress | undefined;
  tokenId: BigNumberString | undefined;
  signature: Signature | undefined;
}

interface ICardDetailsProps {
  metaData: IOpenSeaMetadata;
  marketplaceListing: MarketplaceListing;
}

export const walletDataTypeMap: Map<EWalletDataType, NodeRequire | null> =
  new Map([
    [EWalletDataType.Age, require("../../assets/images/renting-age.png")],
    [EWalletDataType.Gender, require("../../assets/images/renting-gender.png")],
    /*   [EWalletDataType.GivenName, null],
    [EWalletDataType.FamilyName, null], */
    /* [EWalletDataType.Birthday, require("../../assets/images/renting-age.png")], */
    /*   [EWalletDataType.Email, null], */
    [
      EWalletDataType.Location,
      require("../../assets/images/renting-location.png"),
    ],
    [
      EWalletDataType.SiteVisits,
      require("../../assets/images/renting-siteVisits.png"),
    ],
    [
      EWalletDataType.EVMTransactions,
      require("../../assets/images/renting-transactionHistory.png"),
    ],
    [
      EWalletDataType.AccountBalances,
      require("../../assets/images/renting-token.png"),
    ],
    [
      EWalletDataType.AccountNFTs,
      require("../../assets/images/renting-nft.png"),
    ],
    /*   [
      EWalletDataType.LatestBlockNumber,
      require("../../assets/images/renting-nft.png"),
    ], */
    [
      EWalletDataType.Discord,
      require("../../assets/images/renting-discord.png"),
    ],
  ]);

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
  const theme = useTheme();
  const { setInvitationStatus } = useLayoutContext();
  const [invitationParams, setInvitationParams] =
    React.useState<IInvitationParams>();

  const [possibleRewards, setPossibleRewards] = useState<
    Map<EVMContractAddress, PossibleReward[]>
  >(new Map());
  const [dependencies, setDependencies] =
    useState<Map<EVMContractAddress, EWalletDataType[]>>();
  const [campaignPermissions, setCampaignPermissions] = useState<
    EWalletDataType[]
  >([]);

  const { metaData, marketplaceListing }: ICardDetailsProps = route.params;
  const { mobileCore } = useAppContext();

  const [subscribeButtonClicked, setSubscribeButtonClicked] = useState(false);
  const [subscribeConfirmation, setSubscribeConfirmation] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [consentCapacity, setConsentCapacity] =
    useState<IConsentCapacity | null>();

  useEffect(() => {
    mobileCore
      .getCore()
      .invitation.getAcceptedInvitationsCID()
      .map((consentAddresses) => {
        if (consentAddresses.get(marketplaceListing.consentContract)) {
          setIsSubscribed(true);
        }
      });

    mobileCore
      .getCore()
      ?.getConsentCapacity(marketplaceListing.consentContract)
      .map((capacity) => {
        setConsentCapacity(capacity);
      });

    if (campaignPermissions.length == 0) {
      mobileCore.dataPermissionUtils.getPermissions().map((perms) => {
        setCampaignPermissions(perms);
      });
    } else {
      // mobileCore.dataPermissionUtils.setPermissions(myPermissions);
    }
  }, [campaignPermissions, marketplaceListing]);

  useEffect(() => {
    mobileCore
      .getCore()
      .marketplace.getPossibleRewards([
        marketplaceListing.consentContract,
      ] as EVMContractAddress[])
      .map((possibleReward) => {
        if (possibleReward) {
          possibleReward
            ?.get(marketplaceListing.consentContract)
            ?.map((possibleReward) => {
              const rewardDependencies = (
                possibleReward as PossibleReward
              )?.queryDependencies.map(
                (queryType) => QueryTypePermissionMap.get(queryType)!,
              );
              console.log("rewardDependencies", rewardDependencies);
              const newDependencies = new Map();
              newDependencies.set(
                marketplaceListing.consentContract,
                possibleReward,
              );
              setDependencies(newDependencies);
            });
        }
        console.log(
          "possibleReward",
          possibleReward.get(marketplaceListing.consentContract),
        );
        setPossibleRewards(possibleReward);
      });
  }, [marketplaceListing, metaData]);

  const [earnedRewards, missedRewards] = useMemo(() => {
    const rewards =
      possibleRewards.get(marketplaceListing.consentContract) ?? []; // Get the rewards for the given consent address or an empty array if there are none

    const earnedRewards = rewards.filter((reward) =>
      reward.queryDependencies
        .map((item) => {
          return QueryTypePermissionMap.get(item);
        })
        .every((type) => campaignPermissions.includes(type)),
    );
    const missedRewards = rewards.reduce((result, reward) => {
      if (
        reward.queryDependencies
          .map((item) => {
            return QueryTypePermissionMap.get(item);
          })
          .some((type) => !campaignPermissions.includes(type))
      ) {
        result.push(reward);
      }
      return result;
    }, []);
    return [earnedRewards, missedRewards];
  }, [possibleRewards, campaignPermissions, marketplaceListing]);
  console.log("earnedRewards", earnedRewards);
  console.log("missedRewards", missedRewards);

  const getTokenId = (tokenId: BigNumberString | undefined) => {
    if (tokenId) {
      return okAsync(TokenId(BigInt(tokenId)));
    }
    return mobileCore.getCyrptoUtils().getTokenId();
  };

  const handleSubscribe = (tokenId, signature) => {
    console.warn("CHECKING INVITATION");
    const invitationService = mobileCore.getCore().invitation;
    let _invitation: Invitation;

    ResultUtils.combine([
      getTokenId(tokenId),
      mobileCore.dataPermissionUtils.generateDataPermissionsClassWithDataTypes(
        campaignPermissions,
      ),
      mobileCore.getCore().getReceivingAddress(),
    ]).map(([tokenId, datapermissions, receiveAccount]) => {
      _invitation = {
        consentContractAddress:
          marketplaceListing.consentContract as EVMContractAddress,
        domain: DomainName(""),
        tokenId,
        businessSignature: (signature as Signature) ?? null,
      };

      mobileCore
        .getCore()
        .invitation.checkInvitationStatus(_invitation)
        .map((status) => {
          console.warn("INVITATION STATUS", EInvitationStatus[status]);
          if (status === EInvitationStatus.New) {
            mobileCore
              .getCore()
              .setReceivingAddress(
                marketplaceListing.consentContract,
                receiveAccount,
              )
              .andThen(() => {
                return mobileCore
                  .getCore()
                  .invitation.acceptInvitation(_invitation, datapermissions);
              });
            setSubscribeButtonClicked(false);
            setSubscribeConfirmation(false);
            setIsSubscribed(true);
          }
        })
        .mapErr((e) => {
          console.error("INVITATION STATUS ERROR", e);
        });
    });
  };

  const handlePermissions = (dataType: EWalletDataType) => {
    if (campaignPermissions.includes(dataType)) {
      const newArray = campaignPermissions.filter((item) => item !== dataType);
      setCampaignPermissions(newArray);
    } else {
      setCampaignPermissions([...campaignPermissions, dataType]);
    }
  };

  const renderAvailableRewards = ({ item }) => {
    return (
      <View>
        <View
          style={{
            width: 225,
            marginLeft: normalizeWidth(15),
            backgroundColor: theme?.colors.backgroundSecondary,
            borderRadius: 25,
            padding: normalizeWidth(10),
            marginBottom: 10,
            shadowColor: theme?.colors.border,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              top: normalizeHeight(8),
              left: normalizeWidth(5),
            }}
          >
            <Image
              style={{ height: 50, width: 50 }}
              source={require("../../assets/images/unlockfinal.png")}
            />
          </View>
          <Image
            style={{ height: 154, width: "100%", borderRadius: 15 }}
            source={{ uri: ipfsParse(item.image) }}
          />
          <Text
            style={{
              color: theme?.colors.title,
              fontSize: normalizeWidth(18),
              fontWeight: "700",
              paddingVertical: normalizeHeight(15),
            }}
          >
            {item.name}
          </Text>
          <View
            style={{
              backgroundColor: theme?.colors.background,
              opacity: 0.85,
              width: "100%",
              padding: normalizeWidth(5),
              borderRadius: normalizeWidth(10),
            }}
          >
            <Text
              style={{
                fontSize: normalizeWidth(15),
                color: theme?.colors.description,
                fontWeight: "700",
                marginVertical: normalizeHeight(8),
              }}
            >
              Price:
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                overflow: "hidden",
                flexWrap: "wrap",
                padding: normalizeWidth(5),
              }}
            >
              {item.queryDependencies.map((queryType: QueryTypes, index) => {
                return (
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginBottom: 8,
                      marginRight: normalizeWidth(8),
                    }}
                    source={walletDataTypeMap.get(
                      QueryTypePermissionMap.get(queryType)!,
                    )}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderMissingRewards = ({ item }) => {
    return (
      <View>
        <View
          style={{
            width: 225,
            marginLeft: normalizeWidth(15),
            backgroundColor: theme?.colors.backgroundSecondary,
            borderRadius: 25,
            padding: normalizeWidth(10),
            marginBottom: 10,
            shadowColor: theme?.colors.border,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              top: normalizeHeight(8),
              left: normalizeWidth(5),
            }}
          >
            <Image
              style={{ height: 50, width: 50 }}
              source={require("../../assets/images/lockedfinal.png")}
            />
          </View>
          <Image
            style={{ height: 154, width: "100%", borderRadius: 15 }}
            source={{ uri: ipfsParse(item.image) }}
          />
          <Text
            style={{
              color: theme?.colors.title,
              fontSize: normalizeWidth(18),
              fontWeight: "700",
              paddingVertical: normalizeHeight(15),
            }}
          >
            {item.name}
          </Text>
          <View
            style={{
              backgroundColor: theme?.colors.background,
              opacity: 0.85,
              width: "100%",
              padding: normalizeWidth(5),
              borderRadius: normalizeWidth(10),
            }}
          >
            <Text
              style={{
                fontSize: normalizeWidth(15),
                color: theme?.colors.description,
                fontWeight: "700",
                marginVertical: normalizeHeight(8),
              }}
            >
              Price:
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                overflow: "hidden",
                flexWrap: "wrap",
                padding: normalizeWidth(5),
              }}
            >
              {item.queryDependencies.map((queryType: QueryTypes, index) => {
                return (
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginBottom: 8,
                      marginRight: normalizeWidth(8),
                    }}
                    source={walletDataTypeMap.get(
                      QueryTypePermissionMap.get(queryType)!,
                    )}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  };
  const renderMissingRewardsAccept = ({ item }) => {
    return (
      <View>
        <View
          style={{
            width: 150,
            marginLeft: normalizeWidth(35),
            marginTop: normalizeHeight(15),
            backgroundColor: theme?.colors.background,
            borderRadius: normalizeWidth(12),
            padding: normalizeWidth(10),
            marginBottom: normalizeHeight(5),
            shadowColor: theme?.colors.backgroundSecondary,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              top: normalizeHeight(5),
              left: normalizeWidth(5),
            }}
          >
            <Image
              style={{ height: normalizeHeight(25), width: normalizeWidth(25) }}
              source={require("../../assets/images/lockedfinal.png")}
            />
          </View>
          <Image
            style={{
              height: normalizeHeight(100),
              width: "100%",
              borderRadius: normalizeWidth(10),
            }}
            source={{ uri: ipfsParse(item.image) }}
          />
          <Text
            style={{
              color: theme?.colors.title,
              fontSize: normalizeWidth(10),
              fontWeight: "700",
              paddingVertical: normalizeHeight(15),
            }}
          >
            {item.name}
          </Text>
          <View
            style={{
              backgroundColor: theme?.colors.backgroundSecondary,
              width: "100%",
              padding: normalizeWidth(5),
              borderRadius: normalizeWidth(10),
            }}
          >
            <Text
              style={{
                fontSize: normalizeWidth(12),
                color: theme?.colors.description,
                fontWeight: "700",
                marginVertical: normalizeHeight(8),
              }}
            >
              Price:
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                overflow: "hidden",
                flexWrap: "wrap",
                padding: normalizeWidth(1),
              }}
            >
              {item.queryDependencies.map((queryType: QueryTypes, index) => {
                return (
                  <View>
                    <Image
                      style={{
                        width: normalizeWidth(15),
                        height: normalizeHeight(15),
                        marginBottom: normalizeHeight(5),
                        marginRight: normalizeWidth(8),
                      }}
                      source={walletDataTypeMap.get(
                        QueryTypePermissionMap.get(queryType)!,
                      )}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    image: {
      width: normalizeWidth(380),
      minHeight: normalizeHeight(310),
      borderRadius: normalizeWidth(30),
      aspectRatio: 1,
      marginTop: normalizeHeight(20),
    },
    title: {
      fontWeight: "700",
      fontSize: normalizeWidth(22),
      lineHeight: normalizeHeight(29),
      color: theme?.colors.title,
      paddingTop: normalizeHeight(12),
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
      borderWidth: 0,
      borderColor: "#EEEEEE",
      borderRadius: normalizeWidth(24),
      width: "90%",
      paddingHorizontal: normalizeWidth(15),
      paddingTop: normalizeHeight(10),
    },
    descriptionContainerBorder: {
      borderWidth: 1,
      borderColor: "#EEEEEE",
      borderRadius: normalizeWidth(24),
      width: "90%",
      paddingHorizontal: normalizeWidth(15),
      paddingVertical: normalizeHeight(10),
    },
    descriptionTitle: {
      fontSize: normalizeWidth(24),
      fontWeight: "700",
      color: theme?.colors.description,
      paddingTop: normalizeHeight(10),
    },
    company: {
      fontWeight: "600",
      fontSize: normalizeWidth(14),
      color: "#5D4F97",
    },
    description: {
      fontWeight: "400",
      fontSize: normalizeWidth(16),
      lineHeight: normalizeHeight(22),
      color: theme?.colors.description,
      textAlign: "center",
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
      marginLeft: 30,
    },
  });

  return (
    <SafeAreaView>
      <ScrollView style={{ backgroundColor: theme?.colors.background }}>
        <SafeAreaView>
          <View style={{ alignItems: "center" }}>
            <Image style={styles.image} source={{ uri: metaData.image }} />
            <Text style={styles.title}>{metaData?.rewardName}</Text>
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{metaData?.description}</Text>
            </View>

            <View style={{ marginVertical: normalizeHeight(10) }}>
              <LineBreaker />
            </View>

            {isSubscribed && (
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#289F8A",
                      fontSize: normalizeWidth(16),
                      fontWeight: "700",
                    }}
                  >
                    Subscribed
                  </Text>
                  <Icon
                    size={15}
                    name="checkmark-sharp"
                    style={{
                      marginLeft: normalizeWidth(5),
                      color: "#289F8A",
                    }}
                  />
                </View>
              </View>
            )}

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  width: normalizeWidth(380),
                  paddingVertical: normalizeHeight(20),
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      marginRight: normalizeWidth(35),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: normalizeWidth(24),
                        color: "#4E4676",
                        fontWeight: "700",
                      }}
                    >
                      {consentCapacity
                        ? consentCapacity?.maxCapacity -
                          consentCapacity?.availableOptInCount
                        : 0}
                    </Text>
                    <Text
                      style={{
                        fontSize: normalizeWidth(14),
                        color: theme?.colors.description,
                        marginTop: normalizeHeight(8),
                      }}
                    >
                      Subscriber
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 1,
                      height: 77,
                      backgroundColor: "#EEEEEE",
                    }}
                  />
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      alignItems: "center",
                      marginHorizontal: normalizeWidth(35),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: normalizeWidth(24),
                        color: "#4E4676",
                        fontWeight: "700",
                      }}
                    >
                      {earnedRewards.length + missedRewards.length}
                    </Text>
                    <Text
                      style={{
                        fontSize: normalizeWidth(14),
                        color: theme?.colors.description,
                        marginTop: normalizeHeight(8),
                      }}
                    >
                      Rewards
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 1,
                      height: 77,
                      backgroundColor: "#EEEEEE",
                    }}
                  />
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      alignItems: "center",
                      marginLeft: normalizeWidth(35),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: normalizeWidth(24),
                        color: "#4E4676",
                        fontWeight: "700",
                        marginTop: normalizeHeight(18),
                        marginBottom: normalizeHeight(8),
                      }}
                    >
                      {consentCapacity
                        ? consentCapacity.availableOptInCount
                        : 0}
                    </Text>
                    <Text
                      style={{
                        fontSize: normalizeWidth(14),
                        color: theme?.colors.description,

                        textAlign: "center",
                      }}
                    >
                      {`Remaining \nSubscriptions`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ paddingHorizontal: normalizeWidth(10) }}>
              <Text
                style={{
                  fontSize: normalizeWidth(20),
                  fontWeight: "700",
                  color: theme?.colors.description,
                  paddingVertical: normalizeHeight(15),
                }}
              >
                Rent more data, unlock more rewards!
              </Text>
              <Text
                style={{
                  fontSize: normalizeWidth(16),
                  color: theme?.colors.description,
                  fontWeight: "500",
                  lineHeight: normalizeHeight(22),
                  paddingRight: normalizeWidth(20),
                }}
              >
                You are eligible to earn the following rewards based on your
                data permissions. Unlock more rewards by changing your data
                permissions.
              </Text>
            </View>

            <View
              style={[
                styles.descriptionContainerBorder,
                {
                  marginTop: 24,
                  width: "95%",
                },
              ]}
            >
              <Text style={styles.descriptionTitle}>Your Data Permissions</Text>
              <View style={{ marginVertical: normalizeHeight(10) }}>
                <LineBreaker />
              </View>
              <Text style={styles.subTitle2}>Data you’re willing to share</Text>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  overflow: "hidden",
                  flexWrap: "wrap",
                }}
              >
                {Array.from(walletDataTypeMap.keys()).map((dataType) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        handlePermissions(dataType);
                      }}
                    >
                      <View
                        style={{
                          position: "relative",
                          marginHorizontal: normalizeWidth(4),
                          marginVertical: normalizeHeight(5),
                          backgroundColor: theme?.colors.backgroundSecondary,
                          borderWidth: 2,
                          borderColor: "#9E96C3",
                          padding: normalizeWidth(6),
                          flexDirection: "row",
                          alignItems: "center",
                          borderRadius: 100,
                        }}
                      >
                        <Image
                          style={{ width: 25, height: 25 }}
                          source={walletDataTypeMap.get(dataType)}
                        />
                        <View>
                          <Text
                            style={{
                              paddingHorizontal: normalizeWidth(2),
                              color: theme?.colors.title,
                            }}
                          >
                            {EWalletDataType[dataType]}
                          </Text>
                        </View>
                        <Icon
                          name={
                            campaignPermissions.includes(dataType)
                              ? "checkmark-sharp"
                              : "close-sharp"
                          }
                          color={theme?.colors.title}
                          size={18}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {missedRewards.length > 0 && (
              <View style={{ width: "100%" }}>
                <View style={{}}>
                  <Text
                    style={{
                      color: theme?.colors.description,
                      fontSize: normalizeWidth(20),
                      fontWeight: "700",
                      marginVertical: normalizeHeight(10),
                      marginLeft: normalizeWidth(15),
                    }}
                  >
                    Missing Rewards
                  </Text>
                  <FlatList
                    data={missedRewards}
                    renderItem={renderMissingRewards}
                    horizontal={true}
                    keyExtractor={(item) => item.queryCID.toString()}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              </View>
            )}

            {earnedRewards.length > 0 && (
              <View style={{ width: "100%" }}>
                <View style={{}}>
                  <Text
                    style={{
                      color: theme?.colors.description,
                      fontSize: normalizeWidth(20),
                      fontWeight: "700",
                      marginBottom: normalizeHeight(10),
                      marginLeft: normalizeWidth(15),
                      marginTop: normalizeHeight(20),
                    }}
                  >
                    Available Rewards
                  </Text>
                  <FlatList
                    data={earnedRewards}
                    renderItem={renderAvailableRewards}
                    horizontal={true}
                    keyExtractor={(item) => item.queryCID.toString()}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              </View>
            )}

            {!isSubscribed && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#6E62A6",
                  width: normalizeWidth(380),
                  height: normalizeHeight(58),
                  borderRadius: normalizeWidth(100),
                  marginVertical: normalizeHeight(25),
                  justifyContent: "center",
                }}
                onPress={() => {
                  setSubscribeButtonClicked(true);
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
                  Subscribe and get your rewards
                </Text>
              </TouchableOpacity>
            )}
            <View style={{ marginBottom: normalizeHeight(70) }}></View>

            <View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={subscribeButtonClicked}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: theme?.colors.backgroundSecondary,
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      minHeight: normalizeHeight(330),
                      borderTopLeftRadius: 50,
                      borderTopRightRadius: 50,
                    }}
                  >
                    {!subscribeConfirmation && (
                      <View>
                        <Text
                          style={{
                            fontSize: normalizeWidth(24),
                            textAlign: "center",
                            color: theme?.colors.title,
                            fontWeight: "700",
                            paddingTop: normalizeHeight(40),
                          }}
                        >
                          Unlock Rewards with Data
                        </Text>
                        <Text
                          style={{
                            fontSize: normalizeWidth(16),
                            textAlign: "center",
                            fontWeight: "400",
                            color: theme?.colors.description,
                            lineHeight: normalizeHeight(22),
                            paddingHorizontal: normalizeWidth(24),
                            paddingTop: normalizeHeight(5),
                          }}
                        >
                          Accepting these rewards automatically changes your
                          data permissions. You are now agreeing to rent:
                          {campaignPermissions.map((perm) => {
                            return (
                              <Text
                                style={{
                                  fontSize: normalizeWidth(16),
                                  textAlign: "center",
                                  fontWeight: "600",
                                  color: theme?.colors.description,
                                  lineHeight: normalizeHeight(22),
                                  paddingHorizontal: normalizeWidth(24),
                                  paddingTop: normalizeHeight(5),
                                }}
                              >
                                {" "}
                                {EWalletDataType[perm]}{" "}
                              </Text>
                            );
                          })}
                        </Text>

                        <View
                          style={{
                            alignItems: "center",
                            marginBottom: normalizeHeight(30),
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#6E62A6",
                              width: normalizeWidth(380),
                              height: normalizeHeight(58),
                              borderRadius: normalizeWidth(100),
                              justifyContent: "center",
                              marginTop: normalizeHeight(28),
                            }}
                            onPress={() => {
                              setSubscribeConfirmation(true);
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
                              Save and Collect
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#3D365B",
                              width: normalizeWidth(380),
                              height: normalizeHeight(58),
                              borderRadius: normalizeWidth(100),
                              justifyContent: "center",
                              marginTop: normalizeHeight(10),
                            }}
                            onPress={() => {
                              setSubscribeButtonClicked(false);
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
                              Cancel
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {subscribeConfirmation && (
                      <View>
                        <Text
                          style={{
                            fontSize: normalizeWidth(24),
                            textAlign: "center",
                            color: theme?.colors.title,
                            fontWeight: "700",
                            paddingTop: normalizeHeight(40),
                          }}
                        >
                          Rewards Confirmation
                        </Text>
                        <Text
                          style={{
                            fontSize: normalizeWidth(16),
                            textAlign: "center",
                            fontWeight: "400",
                            color: theme?.colors.description,
                            lineHeight: normalizeHeight(22),
                            paddingHorizontal: normalizeWidth(24),
                            paddingTop: normalizeHeight(5),
                          }}
                        >
                          It may take a few moments for your rewards to process
                          and appear in your Data Wallet.
                        </Text>
                        {missedRewards.length > 0 && (
                          <Text
                            style={{
                              fontSize: normalizeWidth(16),
                              textAlign: "center",
                              fontWeight: "400",
                              color: theme?.colors.description,
                              lineHeight: normalizeHeight(22),
                              paddingHorizontal: normalizeWidth(24),
                              paddingTop: normalizeHeight(5),
                            }}
                          >
                            {`If you subscribe with the existing permissions\n you are going to miss these rewards:`}
                          </Text>
                        )}
                        {missedRewards.length > 0 && (
                          <View style={{ width: "100%" }}>
                            <View style={{}}>
                              <FlatList
                                data={missedRewards}
                                renderItem={renderMissingRewardsAccept}
                                horizontal={true}
                                keyExtractor={(item) =>
                                  item.queryCID.toString()
                                }
                                showsHorizontalScrollIndicator={false}
                              />
                            </View>
                          </View>
                        )}

                        <View
                          style={{
                            alignItems: "center",
                            marginBottom: normalizeHeight(30),
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#6E62A6",
                              width: normalizeWidth(380),
                              height: normalizeHeight(58),
                              borderRadius: normalizeWidth(100),
                              justifyContent: "center",
                              marginTop: normalizeHeight(28),
                            }}
                            onPress={() => {
                              handleSubscribe(null, null);
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
                              Accept
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#3D365B",
                              width: normalizeWidth(380),
                              height: normalizeHeight(58),
                              borderRadius: normalizeWidth(100),
                              justifyContent: "center",
                              marginTop: normalizeHeight(10),
                            }}
                            onPress={() => {
                              setSubscribeButtonClicked(false);
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
                              Cancel
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  image: {
    width: normalizeWidth(380),
    minHeight: normalizeHeight(310),
    borderRadius: normalizeWidth(30),
    aspectRatio: 1,
  },
  title: {
    fontWeight: "700",
    fontSize: normalizeWidth(22),
    lineHeight: normalizeHeight(29),
    color: "#424242",
    paddingTop: normalizeHeight(12),
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
    borderWidth: 0,
    borderColor: "#EEEEEE",
    borderRadius: normalizeWidth(24),
    width: "90%",
    paddingHorizontal: normalizeWidth(15),
    paddingTop: normalizeHeight(10),
  },
  descriptionContainerBorder: {
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: normalizeWidth(24),
    width: "90%",
    paddingHorizontal: normalizeWidth(15),
    paddingVertical: normalizeHeight(10),
  },
  descriptionTitle: {
    fontSize: normalizeWidth(24),
    fontWeight: "700",
    color: "#424242",
    paddingTop: normalizeHeight(10),
  },
  company: {
    fontWeight: "600",
    fontSize: normalizeWidth(14),
    color: "#5D4F97",
  },
  description: {
    fontWeight: "400",
    fontSize: normalizeWidth(16),
    lineHeight: normalizeHeight(22),
    color: "#616161",
    textAlign: "center",
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
export default CardDetails;
