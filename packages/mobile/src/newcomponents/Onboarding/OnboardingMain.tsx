import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  Button,
  Modal,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  NativeModules,
} from "react-native";
import { useAccountLinkingContext } from "../../context/AccountLinkingContextProvider";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import PieChart from "../Custom/PieChart";
import MyComponent from "./Mycomponent";
import OnboardingItem from "./OnboardingItem";
import Permission from "./Permission";
import { useAppContext } from "../../context/AppContextProvider";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../constants";
import BottomSheetComponenet from "../Custom/BottomSheetComponenet";
import { ethers } from "ethers";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  EChain,
  EVMAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import {
  ELoadingStatusType,
  ILoadingStatus,
  useLayoutContext,
} from "../../context/LayoutContext";
import Clipboard from "@react-native-clipboard/clipboard";
import Crypto from "react-native-quick-crypto";
import Wallet from "ethereumjs-wallet";
import { keccak256 } from "ethers/lib/utils";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width;

const OnboardingMain = () => {
  const initialLoadingStatus: ILoadingStatus = {
    loading: false,
    type: ELoadingStatusType.IDLE,
  };
  const [publicKey, setPublicKey] = React.useState("");
  const [privateKey, setPrivateKey] = React.useState("");
  const [walletObject, setWalletObject] = React.useState<ethers.Wallet | null>(
    null,
  );

  const [generated, setGenerated] = React.useState(false);

  const [connectModal, setConnectModal] = React.useState(false);
  const [usePublicKey, setUsePublicKey] = React.useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef();
  const { onWCButtonClicked } = useAccountLinkingContext();
  const { isUnlocked } = useAppContext();
  const navigation = useNavigation();

  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  const { mobileCore } = useAppContext();
  const { setLoadingStatus } = useLayoutContext();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      ({ endCoordinates }) => {
        setKeyboardHeight(endCoordinates.height);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: "none",
        },
      });
      return () =>
        navigation.getParent()?.setOptions({
          tabBarStyle: undefined,
        });
    }, 10);

    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  useEffect(() => {
    if (isUnlocked) {
      handleNextButtonPress();
    }
  }, [isUnlocked]);

  const isValidPublicKey = (publicKey) => {
    try {
      const address = ethers.utils.getAddress(publicKey);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handlePrevButtonPress = () => {
    // Scroll to the previous image
    scrollViewRef.current?.scrollTo({
      x: scrollX._value - ITEM_WIDTH,
      animated: true,
    });
  };

  const handleNextButtonPress = () => {
    // Scroll to the next image
    scrollViewRef.current?.scrollTo({
      x: scrollX._value + ITEM_WIDTH,
      animated: true,
    });
  };

  const data = [
    {
      id: 1,
      asset: {
        type: "image",
        source: require("../../assets/images/welcome_snickerdoodle.png"),
        height: 341,
      },
      title: `Welcome to Snickerdoodle \n Data Wallet!`,
      description: ` The matchmaker between you, your data, and the \n brands you love!`,
      button: (
        <View>
          <TouchableOpacity
            style={{
              backgroundColor: "#6E62A6",
              width: normalizeWidth(380),
              height: normalizeHeight(65),
              borderRadius: normalizeWidth(100),
              justifyContent: "center",
            }}
            onPress={() => {
              handleNextButtonPress();
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
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      ),
      backButton: false,
    },
    {
      id: 2,
      asset: {
        type: "video",
        source:
          "https://drive.google.com/uc?export=download&id=1ohloSDHad0O8J2r-sqRIgS5xOtK8dedM",
        height: 341,
      },
      title: `Earn rewards from your favorite \n brands, NFT and crypto projects.`,
      description: `Keep your data in one place and anonymize it with \n Snickerdoodle tools.

      Earn NFTs and rewards for renting the anonymized \n data you choose.`,
      button: (
        <TouchableOpacity
          style={{
            backgroundColor: "#6E62A6",
            width: normalizeWidth(380),
            height: normalizeHeight(65),
            borderRadius: normalizeWidth(100),
            justifyContent: "center",
          }}
          onPress={() => {
            handleNextButtonPress();
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
            Next
          </Text>
        </TouchableOpacity>
      ),
      backButton: false,
    },
    {
      id: 3,
      asset: {
        type: "image",
        source: require("../../assets/images/sd_wallet.png"),
        height: 200,
      },
      title: `Create Your Account with Your \n Crypto Wallet and Earn Rewards!`,
      description: (
        <View>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "400",
              color: "#616161",
              fontSize: normalizeWidth(16),
              lineHeight: normalizeWidth(23),
            }}
          >
            {`Link your account to view your web3 activity in your \n secure personal Data Wallet and claim your reward.\n You'll share public key, authenticate account, link\n data, no transfer/gas fees.`}
          </Text>
        </View>
      ),
      button: (
        <View>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              backgroundColor: "#6E62A6",
              width: normalizeWidth(380),
              height: normalizeHeight(65),
              borderRadius: normalizeWidth(100),
            }}
            onPress={() => {
              setConnectModal(true);
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
              Connect Wallet
            </Text>
          </TouchableOpacity>
        </View>
      ),
      backButton: false,
    },
    {
      id: 4,
      asset: {
        type: "image",
        source: require("../../assets/images/more-info.png"),
        height: 200,
      },
      title: `More Information, More Rewards`,
      description: `No one can access this personal information, not \n even Snickerdoodle. You use Snickerdoodle to \n anonymize your data and rent it out to brands of\n your choice, directly.`,
      button: (
        <TouchableOpacity
          style={{
            backgroundColor: "#6E62A6",
            width: normalizeWidth(380),
            height: normalizeHeight(65),
            borderRadius: normalizeWidth(100),
            justifyContent: "center",
          }}
          onPress={() => {
            handleNextButtonPress();
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
            Next
          </Text>
        </TouchableOpacity>
      ),
      component: <MyComponent />,
      backButton: false,
    },

    {
      id: 5,
      asset: {
        type: "image",
        source: require("../../assets/images/welcome_snickerdoodle.png"),
        height: 0,
      },
      title: `Set Your Data Permissions`,
      description: `Choose your data  permissions to control what\n information you rent.`,
      button: (
        <View>
          <TouchableOpacity
            style={{
              backgroundColor: "#6E62A6",
              width: normalizeWidth(380),
              height: normalizeHeight(65),
              borderRadius: normalizeWidth(100),
              justifyContent: "center",
            }}
            onPress={() => {
              {
                isUnlocked && navigation.replace(ROUTES.DASHBOARD);
              }
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
              Go To Wallet
            </Text>
          </TouchableOpacity>
        </View>
      ),
      component: (
        <>
          <Permission />
        </>
      ),
      backButton: true,
    },
  ];

  const handleUsePublicKey = () => {
    AsyncStorage.setItem("public-key-connected", publicKey);
    setConnectModal(false);
    handleNextButtonPress();
  };

  const generateWallet = () => {
    /*   const wallet = ethers.Wallet.createRandom(); // Generate a new random wallet
    const privateKey = wallet.privateKey;
    setWalletObject(wallet);
    setPublicKey(wallet.address);
    setPrivateKey(privateKey);
    setConnectModal(false);
    setGenerated(true); */

    const privateKey = Crypto.randomBytes(32).toString("hex");
    const wallet = Wallet.fromPrivateKey(Buffer.from(privateKey, "hex"));
    const publicKey = wallet.getPublicKeyString();
    const address = wallet.getAddressString();

    const walletObject = new ethers.Wallet(privateKey);

    // Sign the message with your private key

    setWalletObject(walletObject);
    setPublicKey(address);
    setPrivateKey(privateKey);
    setConnectModal(false);
    setGenerated(true);
  };

  const handleCopy = (privateKey: string) => {
    Clipboard.setString(privateKey);
    Alert.alert(
      "Information",
      "Private Key successfuly copied, please don't forget to save it!",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
    );
  };

  const accountGeneratedNext = () => {
    const enLangueCode: LanguageCode = LanguageCode("en");
    mobileCore.accountService.getUnlockMessage(enLangueCode).map((message) => {
      setLoadingStatus({
        loading: true,
        type: ELoadingStatusType.ADDING_ACCOUNT,
      });
      setConnectModal(false);
      setGenerated(false);
      const accountService = mobileCore.accountService;
      walletObject?.signMessage(message).then((signature) => {
        if (!isUnlocked) {
          accountService.unlock(
            walletObject?.address as EVMAccountAddress,
            signature as Signature,
            EChain.EthereumMainnet,
            enLangueCode,
          );
        } else {
          accountService.addAccount(
            walletObject?.address as EVMAccountAddress,
            signature as Signature,
            EChain.EthereumMainnet,
            enLangueCode,
          );
        }
      });
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ zIndex: 999 }}
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        scrollEnabled={false}
      >
        {data.map((item) => (
          <View key={item.id} style={styles.item}>
            <OnboardingItem
              item={item}
              scrollViewRef={scrollViewRef}
              scrollX={scrollX}
            />
            <View style={{ position: "absolute", bottom: normalizeHeight(45) }}>
              {item.button}
            </View>
            <View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={connectModal}
              >
                <KeyboardAvoidingView
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <KeyboardAvoidingView
                    style={[
                      {
                        backgroundColor: "white",
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: normalizeHeight(370),
                        borderTopRightRadius: 50,
                        borderTopLeftRadius: 50,
                      },
                      { bottom: keyboardHeight },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: normalizeWidth(24),
                        textAlign: "center",
                        color: "#424242",
                        fontWeight: "700",
                        paddingTop: normalizeHeight(40),
                        paddingHorizontal: normalizeHeight(10),
                      }}
                    >
                      Unlock Your Account
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "400",
                        color: "#616161",
                        fontSize: normalizeWidth(16),
                        lineHeight: normalizeWidth(23),
                        paddingHorizontal: normalizeWidth(20),
                        paddingTop: normalizeHeight(10),
                      }}
                    >
                      You can connect your account with Wallet Connect or you
                      can use your public key. For earning rewards you should
                      use Wallet Connect
                    </Text>
                    {!usePublicKey && (
                      <View style={{ alignItems: "center" }}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#6E62A6",
                            width: "90%",
                            height: normalizeHeight(65),
                            borderRadius: normalizeWidth(100),
                            marginVertical: normalizeHeight(15),
                            justifyContent: "center",
                          }}
                          onPress={() => {
                            setConnectModal(false);
                            onWCButtonClicked();
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Image
                              source={require("../../assets/images/walletConnect.png")}
                            />
                            <Text
                              style={{
                                textAlign: "center",
                                color: "white",
                                fontWeight: "700",
                                fontSize: normalizeWidth(16),
                                paddingLeft: normalizeWidth(5),
                              }}
                            >
                              Wallet Connect
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#CDC8DF",
                            width: "90%",
                            height: normalizeHeight(65),
                            borderRadius: normalizeWidth(100),
                            marginVertical: normalizeHeight(5),
                            justifyContent: "center",
                          }}
                          onPress={() => {
                            generateWallet();
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                color: "#645997",
                                fontWeight: "700",
                                fontSize: normalizeWidth(16),
                                paddingLeft: normalizeWidth(5),
                              }}
                            >
                              Generate Wallet
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                          style={{
                            backgroundColor: "#CDC8DF",
                            width: "90%",
                            height: normalizeHeight(65),
                            borderRadius: normalizeWidth(100),
                            marginVertical: normalizeHeight(5),
                            justifyContent: "center",
                          }}
                          onPress={() => {
                            setUsePublicKey(true);
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                color: "#645997",
                                fontWeight: "700",
                                fontSize: normalizeWidth(16),
                                paddingLeft: normalizeWidth(5),
                              }}
                            >
                              Use Public Key
                            </Text>
                          </View>
                        </TouchableOpacity> */}
                      </View>
                    )}
                    {usePublicKey && (
                      <View style={{ alignItems: "center", width: "100%" }}>
                        <TextInput
                          value={publicKey}
                          onChangeText={setPublicKey}
                          placeholder="Enter your public key"
                          placeholderTextColor="black"
                          style={{
                            color: "black",
                            width: "90%",
                            height: normalizeHeight(55),
                            marginTop: normalizeHeight(30),
                            borderRadius: normalizeWidth(20),
                            borderWidth: 1,
                            paddingLeft: normalizeWidth(10),
                          }}
                        />
                        <View style={{ width: "90%" }}>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#6E62A6",
                              height: normalizeHeight(50),
                              borderRadius: normalizeWidth(20),
                              marginVertical: normalizeHeight(15),
                              justifyContent: "center",
                            }}
                            onPress={handleUsePublicKey}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  color: "white",
                                  fontWeight: "700",
                                  fontSize: normalizeWidth(16),
                                  paddingLeft: normalizeWidth(5),
                                }}
                              >
                                Use Public Key
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <Button
                          title="Back"
                          onPress={() => {
                            setUsePublicKey(false);
                          }}
                        />
                      </View>
                    )}
                  </KeyboardAvoidingView>
                </KeyboardAvoidingView>
              </Modal>
            </View>

            <View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={generated}
              >
                <KeyboardAvoidingView
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <KeyboardAvoidingView
                    style={[
                      {
                        backgroundColor: "white",
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: "100%",
                        borderTopRightRadius: 50,
                        borderTopLeftRadius: 50,
                      },
                      { bottom: keyboardHeight },
                    ]}
                  >
                    <View style={{ alignItems: "center" }}>
                      <Image
                        style={{
                          width: normalizeWidth(260),
                          height: normalizeHeight(287),
                          marginTop: normalizeHeight(60),
                        }}
                        source={require("../../assets/images/account-1.png")}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: normalizeWidth(24),
                        textAlign: "center",
                        color: "#424242",
                        fontWeight: "700",
                        paddingTop: normalizeHeight(40),
                        paddingHorizontal: normalizeHeight(10),
                      }}
                    >
                      Your Account Has Been Created
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "400",
                        color: "#616161",
                        fontSize: normalizeWidth(16),
                        lineHeight: normalizeWidth(23),
                        paddingHorizontal: normalizeWidth(20),
                        paddingTop: normalizeHeight(10),
                      }}
                    >
                      We have generated your unique account. You should save
                      your private key now, otherwise you won’t be able to see
                      this information again.
                    </Text>

                    <View style={{ alignItems: "center" }}>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: "#EEEEEE",
                          width: "90%",
                          height: normalizeHeight(260),
                          borderRadius: normalizeWidth(16),
                          padding: normalizeWidth(20),
                        }}
                      >
                        <Text
                          style={{
                            fontSize: normalizeWidth(20),
                            color: "#424242",
                            fontWeight: "700",
                            lineHeight: normalizeWidth(24),
                          }}
                        >
                          Account Address
                        </Text>
                        <View
                          style={{
                            width: "100%",
                            height: normalizeHeight(68),
                            backgroundColor: "#FAFAFA",
                            justifyContent: "center",
                            paddingHorizontal: normalizeWidth(10),
                            marginVertical: normalizeHeight(12),
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              style={{
                                width: normalizeWidth(28),
                                height: normalizeHeight(28),
                              }}
                              source={require("../../assets/images/newAccountIcon.png")}
                            />

                            <Text
                              style={{
                                paddingLeft: normalizeWidth(12),
                                color: "#616161",
                                fontSize: normalizeWidth(16),
                                fontWeight: "600",
                              }}
                            >
                              {publicKey?.slice(0, 28)}...
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={{
                            fontSize: normalizeWidth(20),
                            color: "#424242",
                            fontWeight: "700",
                            lineHeight: normalizeWidth(24),
                          }}
                        >
                          Private Key
                        </Text>
                        <View
                          style={{
                            width: "100%",
                            height: normalizeHeight(68),
                            backgroundColor: "#FAFAFA",
                            justifyContent: "center",
                            paddingHorizontal: normalizeWidth(10),
                            marginTop: normalizeHeight(12),
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: "#616161",
                                fontSize: normalizeWidth(16),
                                fontWeight: "600",
                              }}
                            >
                              {privateKey?.slice(0, 28)}...
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                handleCopy(privateKey);
                              }}
                            >
                              <Image
                                style={{
                                  width: normalizeWidth(22),
                                  height: normalizeHeight(22),
                                  marginLeft: normalizeWidth(12),
                                }}
                                source={require("../../assets/images/copyIcon.png")}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <View>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#6E62A6",
                            width: normalizeWidth(380),
                            height: normalizeHeight(65),
                            borderRadius: normalizeWidth(100),
                            justifyContent: "center",
                          }}
                          onPress={accountGeneratedNext}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              color: "white",
                              fontWeight: "700",
                              fontSize: normalizeWidth(16),
                            }}
                          >
                            Next
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </KeyboardAvoidingView>
                </KeyboardAvoidingView>
              </Modal>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {data.map((item, index) => {
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 0.9, 0.6],
            extrapolate: "clamp",
          });
          const width = scrollX.interpolate({
            inputRange,
            outputRange: [10, 30, 10],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                { width, transform: [{ scale }], opacity },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "white",
  },
  item: {
    width: ITEM_WIDTH,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: normalizeHeight(120),
    left: 0,
    right: 0,
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#6E62A6",
    margin: 10,
  },
});

export default OnboardingMain;