import {
  Animated,
  Button,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
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
export interface IDashboardChildrenProps {
  data: {
    nfts: string[];
    tokens: any[];
    totalBalance: Number;
    selectedAccount: any;
    setSelectedAccount: any;
    isMainnet: boolean;
    pickerLinkedAccounts: any[];
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

  const [selected, setSelected] = React.useState(linkedAccounts[0]);
  const [selectedChains, setSelectedChains] = React.useState<string[]>([
    "0x1",
    "0x89",
    "0xa86a",
    "0x38",
  ]);

  const options = [
    {
      image: require("../../assets/images/chain-eth.png"),
      label: "Ethereum",
      value: "0x1",
    },
    {
      image: require("../../assets/images/chain-polygon.png"),
      label: "Polygon",
      value: "0x89",
    },
    {
      image: require("../../assets/images/chain-avax.png"),
      label: "Avalanche",
      value: "0xa86a",
    },
    {
      image: require("../../assets/images/chain-bsc.png"),
      label: "Binance Smart Chain",
      value: "0x38",
    },
  ];

  const handleSelectChain = (chains: string[]) => {
    console.log("chains", chains);
    setSelectedChains(chains);
  };

  const handleSelect = (value: string) => {
    setSelected(value);
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
    getAllNFTs(isMainnet);
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

  const getAllNFTs = async (isMainnet: boolean) => {
    const temp: string[] = [];
    const api = new MoralisAPI();
    const chains = isMainnet
      ? selectedChains
      : ["0x13881", "0x89", "0x61", "0xa869"];

    const _nftResponse = chains.map((chain) => {
      return api.getAllNFTs(selectedAccount, chain);
    });
    Promise.all(_nftResponse).then((nfts) => {
      const allNFTs = [];
      nfts.map((nft) => {
        allNFTs.push(nft.result);
      });
      allNFTs.flat().map((obj) => {
        const image = obj?.normalized_metadata?.image;
        if (image) {
          temp.push(
            image.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/"),
          );
        }
      });
      const all = {
        mainObjects: allNFTs.flat(),
        images: temp,
      };
      setMyNFTs(all);
    });
  };
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
          console.log("total", total);
          setTotalVal(total);
        });
      });
      setMyTokens(allTokens);
    }
  };
  return (
    <SafeAreaView style={{ backgroundColor: "white",height:'100%' }}>
      <ScrollView style={{ backgroundColor: "white" }}>
        <SafeAreaView
          style={{
            backgroundColor: "white",
            marginHorizontal: normalizeWidth(5),
          }}
        >
          <View style={styles.containerBox}>
            <Text style={styles.title}>My Data Dashboard</Text>
            <TouchableOpacity
              onPress={toggleSidebar}
              style={styles.dropdownContainer}
            >
              <Icon name="funnel-outline" size={normalizeWidth(20)} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: "center",
              zIndex: 999,
              marginTop: normalizeHeight(20),
            }}
          >
            <Dropdown
              items={pickerLinkedAccounts}
              onSelect={onSelect}
              selected={selectedAccount}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{backgroundColor:'red',height:'100%'}}>
              <DashboardTab
                data={{
                  nfts: myNFTs,
                  tokens: myTokens,
                  totalBalance: totalVal,
                  selectedAccount,
                  setSelectedAccount,
                  isMainnet,
                  pickerLinkedAccounts,
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
                />
                <Text
                  style={{
                    fontSize: normalizeWidth(24),
                    fontWeight: "700",
                    color: "#424242",
                    marginLeft: normalizeWidth(20),
                  }}
                >
                  Filter Options
                </Text>
              </View>
              <View style={styles.borderBox}>
                <Text
                  style={{
                    fontStyle: "normal",
                    fontWeight: "700",
                    fontSize: normalizeWidth(20),
                    lineHeight: normalizeHeight(29),
                    color: "#212121",
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

              <View style={styles.borderBox}>
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
                  Chains
                </Text>
                <MultiSelect
                  options={options}
                  handleSelectChain={handleSelectChain}
                  selectedChains={selectedChains}
                />
              </View>
            </Animated.View>
          )}
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  title: {
    // fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: normalizeWidth(24),
    lineHeight: normalizeHeight(29),
    marginLeft: normalizeWidth(25),
    marginTop: normalizeHeight(20),
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
  containerBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  dropdownContainer: {
    width: normalizeWidth(60),
    height: normalizeHeight(56),
    backgroundColor: "#F5F5F5",
    borderRadius: normalizeWidth(16),
    justifyContent: "center",
    alignItems: "center",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    paddingHorizontal: 16,
    zIndex: 999,
  },
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
