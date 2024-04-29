import {
  EVMContractAddress,
  IUserAgreement,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAccountLinkingContext } from "../../context/AccountLinkingContextProvider";
import { useAppContext } from "../../context/AppContextProvider";
import { useTheme } from "../../context/ThemeContext";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";

interface ILoadingProps {
  status: boolean;
  index: number;
}

export default function RewardsSettings() {
  const theme = useTheme();
  const { mobileCore } = useAppContext();
  const { onWCButtonClicked } = useAccountLinkingContext();
  const { linkedAccounts } = useAppContext();
  const [selected, setSelected] = React.useState<string>(linkedAccounts[0]);
  const [acceptedInvitations, setAcceptedInvitations] =
    React.useState<Map<EVMContractAddress, IpfsCID>>();
  const [cids, setCids] = React.useState<IpfsCID[]>([]);
  const [isLoading, setIsLoading] = React.useState<ILoadingProps[]>([]);
  const [unsubsribed, setUnsubscribed] = React.useState<boolean>(false);
  const [campainJoined, setCampainJoined] = React.useState<IUserAgreement[]>(
    [],
  );

  useEffect(() => {
    setIsLoading([]);
    getOptedInInvitationMetaData();
  }, [unsubsribed]);

  const getOptedInInvitationMetaData = () => {
    return mobileCore
      .getCore()
      .invitation.getAcceptedInvitationsCID()
      .map((metaData) => {
        setAcceptedInvitations(metaData);
        setCids(Array.from(metaData.values()));
        return Array.from(metaData.values()).map((cid) => {
          return mobileCore
            .getCore()
            .invitation.getInvitationMetadataByCID(cid)
            .map((meta) => {
              return meta;
            });
        });
      })
      .andThen((res) => {
        Promise.all(res).then((data) => {
          const valuesArray = data.map((item) => item.value);
          setCampainJoined(valuesArray);
        });
      });
  };

  return (
    <ScrollView
      style={{
        paddingHorizontal: normalizeWidth(20),
        backgroundColor: theme?.colors.background,
      }}
    >
      <SafeAreaView>
        <Text
          style={{
            fontWeight: "700",
            fontSize: normalizeWidth(24),
            color: theme?.colors.title,
            marginTop: normalizeHeight(15),
          }}
        >
          Rewards Subscription Settings
        </Text>

        <Text
          style={{
            fontSize: normalizeWidth(16),
            lineHeight: normalizeHeight(22),
            fontWeight: "400",
            color: theme?.colors.description,
            marginTop: normalizeHeight(32),
          }}
        >
          {`You have agreed to share anonymized information\nwith these brands, only, through these rewards\nprograms.`}{" "}
        </Text>

        {campainJoined?.map((metaData, index) => {
          return (
            <View
              key={metaData?.image}
              style={{
                width: "100%",
                padding: normalizeWidth(22),
                borderWidth: 2,
                borderColor: theme?.colors.border,
                shadowColor: "#04060f",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 60,
                borderRadius: 20,
                marginBottom: normalizeHeight(10),
                marginTop: normalizeHeight(10),
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "40%" }}>
                  <Image
                    style={{
                      height: 130,
                      width: 135,
                      borderRadius: normalizeWidth(20),
                      resizeMode: "contain",
                    }}
                    source={{ uri: metaData.image }}
                  />
                </View>
                <View style={{ width: "60%", paddingLeft: normalizeWidth(24) }}>
                  <Text
                    style={{
                      color: theme?.colors.title,
                      fontSize: normalizeWidth(20),
                      fontWeight: "700",
                      overflow: "hidden",
                    }}
                  >
                    {metaData.title}
                  </Text>
                  <Text
                    style={{
                      color: theme?.colors.description,
                      fontSize: normalizeWidth(14),
                      fontWeight: "400",
                      marginVertical: normalizeHeight(10),
                    }}
                  >
                    {metaData.description}
                  </Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#EB5C5D",
                      width: normalizeWidth(138),
                      height: normalizeHeight(40),
                      borderRadius: normalizeWidth(100),
                      justifyContent: "center",
                      marginTop: normalizeHeight(10),
                    }}
                    onPress={() => {
                      if (cids[index]) {
                        const foundKey = Array.from(
                          acceptedInvitations?.entries(),
                        ).find(([key, value]) => value === cids[index])?.[0];

                        if (foundKey) {
                          setIsLoading([...isLoading, { status: true, index }]);
                          mobileCore
                            .getCore()
                            .invitation.leaveCohort(foundKey)
                            .andThen((res) => {
                              setUnsubscribed(!unsubsribed);
                            });
                        }
                      }
                    }}
                  >
                    {isLoading.filter((val) => val.index === index).length >
                    0 ? (
                      <ActivityIndicator size="small" color="#EB5C5D" />
                    ) : (
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#EB5C5D",
                          fontWeight: "700",
                          fontSize: normalizeWidth(16),
                        }}
                      >
                        Unsubscribe
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  borderBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#EAECF0",
    borderRadius: normalizeWidth(24),
    marginTop: normalizeHeight(24),
    paddingVertical: normalizeHeight(20),
    paddingHorizontal: normalizeWidth(20),
  },
});
