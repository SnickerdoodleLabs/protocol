import {
  Animated,
  Button,
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import Dropdown from "./Dropdown";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/Ionicons";
import DashboardTab from "./DashboardTab";
import { useAppContext } from "../../context/AppContextProvider";
import { MoralisAPI } from "../../services/implementations/api/MoralisAPI";
import { useAccountLinkingContext } from "../../context/AccountLinkingContextProvider";
import Sidebar from "../Custom/Sidebar";
import RadioButton from "../Custom/RadioButton";
import MultiSelect from "../Custom/MultiSelect";
import CustomSwitch from "../Custom/CustomSwitch";
import { TokenBalance, WalletNFT } from "@snickerdoodlelabs/objects";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";

export interface IDashboardChildrenProps {
  data: {
    nfts: any[];
    tokens: any[];
    totalBalance: Number;
    selectedAccount: any;
    setSelectedAccount: any;
    isMainnet: boolean;
    pickerLinkedAccounts: any[];
    myNFTsNew: WalletNFT[];
  };
}
const Dashboard = () => {
  const onSelect = (item) => {
    setSelectedAccount(item.label);
  };
  const { mobileCore } = useAppContext();
  const [myNFTs, setMyNFTs] = React.useState<any>();
  const [myTokens, setMyTokens] = React.useState<any[]>([]);
  const [totalVal, setTotalVal] = React.useState<Number>(0);
  const { linkedAccounts } = useAppContext();
  const [selectedAccount, setSelectedAccount] = React.useState(
    linkedAccounts[0],
  );
  const [isMainnet, setIsMainnet] = React.useState<boolean>(true);
  const [pickerLinkedAccounts, setPickerLinkedAccount] = React.useState<any[]>(
    [],
  );

  const [isOpen, setIsOpen] = React.useState(false);
  const animatedWidth = React.useState(new Animated.Value(0))[0];
  const [selectedChains, setSelectedChains] = React.useState<string[]>([
    "1",
    "137",
    "43114",
    "56",
    "42161",
    "592",
  ]);

  const options = [
    {
      image: require("../../assets/images/chain-eth.png"),
      label: "Ethereum",
      value: "1",
    },
    {
      image: require("../../assets/images/chain-polygon.png"),
      label: "Polygon",
      value: "137",
    },
    {
      image: require("../../assets/images/chain-avax.png"),
      label: "Avalanche",
      value: "43114",
    },
    {
      image: require("../../assets/images/chain-bsc.png"),
      label: "Binance Smart Chain",
      value: "56",
    },
    {
      image: require("../../assets/images/chain-astar.jpg"),
      label: "Astar",
      value: "592",
    },
    /*    {
      image: require("../../assets/images/chain-gnosis.png"),
      label: "Gnosis",
      value: "100",
    }, */
    /*    {
      image: require("../../assets/images/chain-moonbeam.jpg"),
      label: "Moonbeam",
      value: "1284",
    }, */
    {
      image: require("../../assets/images/chain-arbitrum.png"),
      label: "Arbitrum",
      value: "42161",
    },
  ];

  const handleSelectChain = (chains: string[]) => {
    setSelectedChains(chains);
  };

  const handleSelect = (value: string) => {
    setSelectedAccount(value);
  };

  const { width, height } = Dimensions.get("window");

  const toggleSidebar = () => {
    const toValue = isOpen ? 0 : width * 0.9;
    Animated.timing(animatedWidth, {
      toValue,
      duration: 350,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    getTokens(isMainnet);
  }, [selectedAccount, isMainnet, selectedChains]);

  useEffect(() => {
    let accs = [];
    linkedAccounts?.map((acc) => {
      accs.push({ label: acc as string, value: acc as string });
    });
    setPickerLinkedAccount(accs);
    setSelectedAccount(linkedAccounts[0]);
  }, [linkedAccounts]);

  const getTokens = async (isMainnet: boolean) => {
    const api = new MoralisAPI();
    const chains = isMainnet
      ? selectedChains
      : ["0x13881", "0x89", "0x61", "0xa869"];
    let allTokens: any[] = [];
    let total = 0;
    if (selectedAccount) {
      await chains.map((res) => {
        api.getTokens(selectedAccount, parseInt(res)).then((token) => {
          allTokens.push(token);
          token.map((tkn) => {
            total += tkn.quote;
          });
          setTotalVal(total);
        });
      });
      setMyTokens(allTokens);
    }
  };
  useEffect(() => {}, [myTokens]);

  const [myNFTsNew, setMyNFTsNew] = useState<WalletNFT[]>([]);
  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        borderTopLeftRadius: normalizeWidth(30),
        borderTopRightRadius: normalizeWidth(30),
        backgroundColor: theme?.colors.bottomTabBackground,
        overflow: "hidden",
        position: "absolute",
      },
    });
  }, [navigation, theme]);

  useEffect(() => {
    mobileCore
      .getCore()
      .getAccountNFTs()
      .map((nfts) => {
        const filtered = nfts.filter(
          (item) =>
            item.owner.toLowerCase() === selectedAccount.toLowerCase() &&
            selectedChains.includes(item.chain.toString()),
        );
        const parsedArr = filtered.map((obj) => {
          const parsedMetadata = JSON.parse(obj?.metadata.raw ?? null);
          return {
            ...obj,
            parsed_metadata: parsedMetadata,
          };
        });

        setMyNFTsNew(parsedArr);
      });

    /*    mobileCore.accountService.getAccountBalances().map((balances) => {
      console.log("balances", balances);
      const filteredBalances = balances.filter(
        (item) =>
          item.accountAddress === selected.toLocaleLowerCase() &&
          selectedChains.includes(item.chainId.toString()),
      );
      setMyTokensNew(filteredBalances);
    }); */
  }, [selectedAccount, selectedChains, isMainnet]);

  const styles = StyleSheet.create({
    title: {
      // fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: "700",
      fontSize: normalizeWidth(24),
      lineHeight: normalizeHeight(29),
      marginTop: normalizeHeight(20),
      color: theme?.colors.title,
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
      color: theme?.colors.description,
      fontWeight: "400",
      fontSize: normalizeWidth(16),
      lineHeight: normalizeHeight(22),
      textAlign: "center",
    },
    sectionTitle: {
      color: theme?.colors.title,
      fontWeight: "700",
      fontSize: normalizeWidth(20),
      lineHeight: normalizeHeight(24),
      marginVertical: normalizeHeight(24),
    },
    sectionDescription: {
      color: theme?.colors.description,
      fontWeight: "500",
      fontSize: normalizeWidth(16),
      lineHeight: normalizeHeight(22),
    },
    button: {
      color: "#5D4F97",
      fontWeight: "700",
      fontSize: normalizeWidth(16),
    },
    containerBox: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme?.colors.background,
    },
    dropdownContainer: {
      width: normalizeWidth(60),
      height: normalizeHeight(56),
      backgroundColor: theme?.colors.backgroundSecondary,
      borderRadius: normalizeWidth(16),
      justifyContent: "center",
      alignItems: "center",
    },
    sidebar: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme?.colors.background,
      borderLeftWidth: 1,
      borderLeftColor: theme?.colors.border,
      paddingHorizontal: 16,
      zIndex: 999,
    },
    borderBox: {
      width: "100%",
      borderWidth: 1,
      borderRadius: normalizeWidth(24),
      marginTop: normalizeHeight(24),
      paddingVertical: normalizeHeight(20),
      paddingHorizontal: normalizeWidth(20),
      backgroundColor: theme?.colors.backgroundSecondary,
    },
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    getTokens(isMainnet);

    mobileCore
      .getCore()
      .getAccountNFTs()
      .map((nfts) => {
        const filtered = nfts.filter(
          (item) =>
            item.owner.toLowerCase() === selectedAccount.toLowerCase() &&
            selectedChains.includes(item.chain.toString()),
        );
        const parsedArr = filtered.map((obj) => {
          const parsedMetadata = JSON.parse(obj?.metadata.raw ?? null);
          return {
            ...obj,
            parsed_metadata: parsedMetadata,
          };
        });

        setMyNFTsNew(parsedArr);
      });

    setRefreshing(true);

    // Simulate a delay for demonstration purposes
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: theme?.colors.background, height: "100%" }}
    >
      <ScrollView
        style={{
          backgroundColor: theme?.colors.background,
          marginHorizontal: normalizeWidth(5),
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme?.colors.indicator}
          />
        }
      >
        <SafeAreaView
          style={{
            backgroundColor: theme?.colors.background,
            marginHorizontal: normalizeWidth(5),
          }}
        >
          {Platform.OS === "android" && (
            <View style={{ marginTop: normalizeHeight(20) }}></View>
          )}
          <View style={styles.containerBox}>
            <Text style={styles.title}>My Data Dashboard</Text>
            <TouchableOpacity
              onPress={toggleSidebar}
              style={styles.dropdownContainer}
            >
              <Icon
                name="funnel-outline"
                size={normalizeWidth(20)}
                color={theme?.colors.title}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              zIndex: 999,
              marginTop: normalizeHeight(30),
            }}
          >
            <Dropdown
              items={pickerLinkedAccounts}
              onSelect={onSelect}
              selected={selectedAccount}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: "red", height: "100%" }}>
              <DashboardTab
                data={{
                  nfts: myNFTsNew,
                  tokens: myTokens,
                  totalBalance: totalVal,
                  selectedAccount,
                  setSelectedAccount,
                  isMainnet,
                  pickerLinkedAccounts,
                  myNFTsNew,
                }}
              />
            </View>
          </View>
          {isOpen && (
            <Animated.View style={[styles.sidebar, { width: animatedWidth }]}>
              <View
                style={{
                  marginTop: 80,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="close"
                  size={normalizeWidth(30)}
                  onPress={() => {
                    setIsOpen(false);
                  }}
                  color={theme?.colors.title}
                />
                <Text
                  style={{
                    fontSize: normalizeWidth(24),
                    fontWeight: "700",
                    color: theme?.colors.title,
                    marginLeft: normalizeWidth(20),
                  }}
                >
                  Filter Options
                </Text>
              </View>
              <View
                style={StyleSheet.create([
                  styles.borderBox,
                  { borderColor: theme?.colors.border },
                ])}
              >
                <Text
                  style={{
                    fontStyle: "normal",
                    fontWeight: "700",
                    fontSize: normalizeWidth(20),
                    lineHeight: normalizeHeight(29),
                    color: theme?.colors.description,
                  }}
                >
                  Account
                </Text>

                <View style={{ marginTop: normalizeHeight(42) }}>
                  {/*     <RadioButton
                    label="All"
                    checked={selected === "All"}
                    onPress={() => handleSelect("All")}
                  /> */}
                  {linkedAccounts.map((account) => {
                    return (
                      <RadioButton
                        label={`${account?.slice(
                          0,
                          6,
                        )}...........................${account?.slice(36, 42)}`}
                        checked={selectedAccount === account}
                        onPress={() => handleSelect(account)}
                      />
                    );
                  })}
                </View>
              </View>

              <View
                style={StyleSheet.create([
                  styles.borderBox,
                  { borderColor: theme?.colors.border },
                ])}
              >
                <Text
                  style={{
                    fontStyle: "normal",
                    fontWeight: "700",
                    fontSize: normalizeWidth(20),
                    lineHeight: normalizeHeight(29),
                    color: theme?.colors.description,
                    marginBottom: normalizeHeight(20),
                  }}
                >
                  Chains
                </Text>
                <MultiSelect
                  options={options}
                  handleSelectChain={handleSelectChain}
                  selectedChains={selectedChains}
                />
              </View>
              {/*    <View style={styles.borderBox}>
                <Text
                  style={{
                    fontStyle: "normal",
                    fontWeight: "700",
                    fontSize: normalizeWidth(20),
                    lineHeight: normalizeHeight(29),
                    color: "#212121",
                    marginBottom: normalizeHeight(20),
                  }}
                >
                  Testnet / Mainnet
                </Text>
                <CustomSwitch
                  value={isMainnet}
                  onValueChange={function (value: boolean): void {
                    setIsMainnet(!isMainnet);
                  }}
                />
              </View> */}
            </Animated.View>
          )}
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
