import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  StatusBar,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { ROUTES } from "../constants";
import { ScrollView } from "react-native-gesture-handler";
import {
  useWalletConnect,
  withWalletConnect,
} from "@walletconnect/react-native-dapp";
import { MoralisAPI } from "../services/implementations/api/MoralisAPI";
import { MobileCore } from "../services/implementations/Gateway";
import { ethers } from "ethers";
import { AccountAddress, ChainId } from "@snickerdoodlelabs/objects";
import { TokenItem } from "../components/TokenItem";
import { useAppContext } from "../context/AppContextProvider";
import Picker from "../components/Picker/Picker";
import { useAccountLinkingContext } from "../context/AccountLinkingContextProvider";
import BottomSheetModal from "react-native-bottom-sheet";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
const Wallet = (props: any) => {
  const { navigation } = props;
  const connector = useWalletConnect();
  const [accountAddress, setAccountAddress] = React.useState(
    connector?.accounts?.[0],
  );

  const [myNFTs, setMyNFTs] = React.useState<string[]>([]);
  const [myTokens, setMyTokens] = React.useState<any[]>([]);
  const [totalVal, setTotalVal] = React.useState<Number>(0);
  const { linkedAccounts } = useAppContext();
  const { onWCButtonClicked } = useAccountLinkingContext();
  const [selectedAccount, setSelectedAccount] = React.useState(
    linkedAccounts[0],
  );
  const [modalVisible, setModalVisible] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [pickerLinkedAccounts, setPickerLinkedAccount] =
    useState<ItemType<string>[]>();

  React.useEffect(() => {
    getAllNFTs();
    getTokens();
  }, [selectedAccount]);

  useEffect(() => {
    let accs = [];
    linkedAccounts?.map((acc) => {
      accs.push({ label: acc as string, value: acc as string });
    });
    console.log("accs", accs);
    setPickerLinkedAccount(accs);
    setSelectedAccount(linkedAccounts[0]);
  }, [linkedAccounts]);

  useEffect(() => {
    console.log("totalVal", totalVal);
  }, [totalVal]);
  const getAllNFTs = async () => {
    const temp: string[] = [];
    const api = new MoralisAPI();
    const chains = ["eth", "polygon"];

    await api.getAllNFTs(selectedAccount, "eth").then((res) => {
      res.result.map((data: any) => {
        let a = data.normalized_metadata.image;
        if (a) {
          temp.push(a.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/"));
        }
      });
    });

    console.log("temp", temp);
    setMyNFTs(temp);
  };
  // const scrollX = React.useRef(new Animated(0)).current;

  //////////////////////////////////////////

  const getTokens = async () => {
    const api = new MoralisAPI();
    let a = [ChainId(1), ChainId(137), ChainId(43113), ChainId(80001)];
    let allTokens: any[] = [];
    let total = 0;

    await a.map((res) => {
      api.getTokens(selectedAccount, ChainId(res)).then((token) => {
        allTokens.push(token);
        token.map((tkn) => {
          console.log("tkn", tkn.quote);
          total += tkn.quote;
        });
        setTotalVal(total);
      });
    });
    setMyTokens(allTokens);
  };

  useEffect(() => {
    myTokens.flat().map((tokenData) => {
      setTotalVal(totalVal + tokenData?.quote);
    });
    console.log("TotalVal", totalVal);
  }, [myTokens]);

  const Tokens = () => {
    let render: JSX.Element[] = [];
    myTokens.flat().map((res) => {
      render.push(
        <ScrollView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
          <TokenItem key={res} token={res} />
        </ScrollView>,
      );
    });
    return render;
  };
  const NFTs = ({ navigation }: any) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(ROUTES.IMAGE_CAROUSEL, { NFTs: myNFTs })
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
            {myNFTs.map((data) => (
              <View style={{ paddingBottom: 10 }}>
                <Image
                  key={data}
                  style={{ width: 170, height: 180, borderRadius: 15 }}
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

  ///////////////////////////////////////

  const TabComponents = {
    Tokens: <Tokens />,
    NFTs: <NFTs navigation={navigation} />,
  };
  const data = Object.keys(TabComponents).map((i) => ({
    key: i,
    title: i,
    //@ts-ignore
    component: TabComponents[i],
  }));

  const Tab = ({ item, isActive }: any) => {
    return (
      <View>
        <Text
          style={{ color: "white", fontSize: 20, fontWeight: "600" }}
          key={item}
        >
          {item.title}
        </Text>
        {isActive && (
          <View
            style={{
              width: "100%",
              height: 3,
              backgroundColor: "white",
              marginTop: 5,
            }}
          />
        )}
      </View>
    );
  };

  const Tabs = ({ data, activeTab, setActiveTab }: any) => {
    return (
      <View style={{ position: "absolute", width: "40%", paddingTop: 30 }}>
        <View
          style={{
            justifyContent: "space-between",
            flex: 1,
            flexDirection: "row",
          }}
        >
          {data.map((item: any) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setActiveTab(item.title);
                }}
              >
                <Tab
                  key={item.key}
                  item={item}
                  isActive={activeTab === item.title ? true : false}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const [activeTab, setActiveTab] = React.useState("NFTs");
  return (
    <View style={{ backgroundColor: "#1C1C29", height: "100%" }}>
      <View
        style={{
          width: "100%",
          height: "40%",
          borderRadius: 2000,
          backgroundColor: "#212142",
          zIndex: 999,
        }}
      >
        <LinearGradient
          start={{ x: 5, y: 2 }}
          end={{ x: 3, y: 5 }}
          colors={["#5A4CDC", "#6F45CF", "#AD5DD5"]}
          style={styles.linearGradient}
        >
          <View style={{ marginTop: 80 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            ></View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      color: "#C4A6F6",
                      paddingTop: 20,
                      fontSize: 20,
                      fontWeight: "500",
                    }}
                  >
                    {selectedAccount?.slice(0, 3)}...
                    {selectedAccount?.slice(38, 42)}
                  </Text>
                  <View style={{ paddingLeft: 10 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(true);
                      }}
                    >
                      <Icon
                        name="sync"
                        size={30}
                        color="white"
                        style={{ paddingRight: 5, paddingTop: 15 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TouchableOpacity onPress={onWCButtonClicked}>
                <Icon
                  name="ios-add-circle-outline"
                  size={30}
                  color="white"
                  style={{ paddingRight: 5, paddingTop: 15 }}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: "#C4A6F6",
                paddingTop: 20,
                fontSize: 12,
                fontWeight: "500",
              }}
            >
              {accountAddress}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  color: "white",
                  paddingTop: 20,
                  fontSize: 45,
                  fontWeight: "600",
                }}
              >
                ${`${totalVal.toFixed(4)}`}
              </Text>
            </View>
            <View>
              <Tabs
                data={data}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
        {data[data.map((e) => e.title).indexOf(activeTab)].component}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View></View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Icon
                    name="close"
                    size={30}
                    color="black"
                    style={{ paddingRight: 5, paddingBottom: 20 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <DropDownPicker
              open={open}
              value={selectedAccount}
              items={pickerLinkedAccounts ?? []}
              setOpen={setOpen}
              setValue={setSelectedAccount}
              theme="LIGHT"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
let styles = StyleSheet.create({
  profilePhoto: {
    height: 75,
    width: 75,
    borderRadius: 75,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 35,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
export default Wallet;
