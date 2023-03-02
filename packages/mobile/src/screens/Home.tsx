import { MotiView } from "@motify/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AccountAddress,
  EChain,
  EVMContractAddress,
  FamilyName,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import { MemoryVolatileStorage } from "@snickerdoodlelabs/persistence";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { utils } from "ethers";
import { ResultAsync } from "neverthrow";
import React, { memo, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from "react-native";
import { Easing } from "react-native-reanimated";

import AppLoader from "../components/AnimatedLoaders/UnlockLoader";
import { ROUTES } from "../constants";
import { useAccountLinkingContext } from "../context/AccountLinkingContextProvider";

import { AppCtx, useAppContext } from "../context/AppContextProvider";
import { useLayoutContext } from "../context/LayoutContext";
import { MobileCore } from "../services/implementations/Gateway";

export default function Home(props: any) {
  const { navigation } = props;
  // const connector = useWalletConnect();
  const [accountAddress, setAccountAddress] = React.useState<string[]>();
  const [signature, setSignature] = React.useState();
  const { coreContext, isUnlocked } = React.useContext(AppCtx);
  const [isLoading, setIsLoading] = React.useState(false);
  const { cancelLoading } = useLayoutContext();

  const { onWCButtonClicked } = useAccountLinkingContext();

  useEffect(() => {
    if (isUnlocked) {
      ResultAsync.fromPromise(
        AsyncStorage.getItem("onboarding-completed"),
        (e) => e,
      ).andThen((val) => {
        cancelLoading();
        navigation.replace(val ? "Onboarding" : "Onboarding");
      });
    }
  }, [isUnlocked]);

  // const handleUnlock = async () => {
  //   if (connector.accounts[0]) {
  //     signApp();
  //   } else {
  //     const { accounts, chainId } = await connector.connect();
  //     setAccountAddress(accounts);
  //   }
  // };

  // const signApp = async () => {
  //   try {
  //     const result = await connector.signPersonalMessage([
  //       "Login to your Snickerdoodle data wallet",
  //     ]);
  //     console.log("sign", result);
  //     setIsLoading(true);
  //     setTimeout(() => {
  //       setIsLoading(false);
  //       navigation.navigate(ROUTES.WALLET);
  //       setTimeout(() => {
  //         //  initConnection();
  //       }, 500);
  //     }, 4200);
  //   } catch (err) {
  //     console.log("ERROR");
  //     console.log({ err });
  //   }
  // };

  return (
    <>
      <View style={{ backgroundColor: "#222039", height: "100%" }}>
        <View>
          <SafeAreaView>
            <TouchableOpacity
            // onPress={() => {
            //   connector.killSession();
            // }}
            >
              <View style={{ paddingTop: 50 }}>
                <Image
                  source={require("../assets/images/homeBG.png")}
                  style={{ height: 460, width: "auto" }}
                />
              </View>
            </TouchableOpacity>
            {/*   <Text
              onPress={() => {
                mobileCore.isDataWalletAddressInitialized().then(res => {
                  console.log('isDataWalletInitialized', res);
                });
              }}>
              isDWInitiliazed
            </Text>
            <Text onPress={getAcc}>getACC</Text>
            <Text onPress={importData}>AsyncStorage</Text>
            <Text
              onPress={() => {
                navigation.navigate(ROUTES.WALLET);
              }}>
              Navigate
            </Text> */}
            <Text
              onPress={() => {
                AsyncStorage.getAllKeys()
                  .then((keys) => AsyncStorage.multiRemove(keys))
                  .then(() => console.error("storage items deleted"));
              }}
            >
              Delete all storage items
            </Text>

            <Text
              onPress={() => {
                const sign =
                  "0x91aa05467f4fa179ada6a8f537503a649f7ef2e1c0b63178b251b0afb37bbc5138c2df394c50f435721e991e17e44b33fb4c8ac5736bb4f2d58411b6a77998401b";
                const acc = "0xbaa1b174fadca4a99cbea171048edef468c5508b";
                coreContext
                  ?.getAccountService()
                  .unlock(
                    acc as AccountAddress,
                    sign as Signature,
                    EChain.EthereumMainnet,
                    "en" as LanguageCode,
                  );
              }}
            >
              Test AccountService
            </Text>

            <Text
              onPress={() => {
                const sign =
                  "0x91aa05467f4fa179ada6a8f537503a649f7ef2e1c0b63178b251b0afb37bbc5138c2df394c50f435721e991e17e44b33fb4c8ac5736bb4f2d58411b6a77998401b";
                const acc = "0xbaa1b174fadca4a99cbea171048edef468c5508b";
                console.log(coreContext?.getPIIService().getFamilyName());
              }}
            >
              Test PII Service
            </Text>
            <Text
              onPress={() => {
                const sign =
                  "0x91aa05467f4fa179ada6a8f537503a649f7ef2e1c0b63178b251b0afb37bbc5138c2df394c50f435721e991e17e44b33fb4c8ac5736bb4f2d58411b6a77998401b";
                const acc = "0xbaa1b174fadca4a99cbea171048edef468c5508b";
                coreContext
                  ?.getInvitationService()
                  .getConsentContractCID(
                    "asdsadasdsadad" as EVMContractAddress,
                  );
              }}
            >
              Test Invitation Service
            </Text>
            <View style={{}}>
              <View
                style={[styles.walletConnectBtn, styles.walletConnectMainBtn]}
              >
                {[...Array(3).keys()].map((index) => {
                  return (
                    <MotiView
                      from={{ opacity: 0.7, scale: 1 }}
                      key={index}
                      animate={{ opacity: 0, scale: 1.5 }}
                      transition={{
                        type: "timing",
                        duration: 2400,
                        easing: Easing.out(Easing.ease),
                        delay: index * 600,

                        loop: true,
                      }}
                      style={[
                        StyleSheet.absoluteFillObject,
                        styles.walletConnectBtn,
                      ]}
                    />
                  );
                })}
                <TouchableOpacity
                  style={styles.walletConnectBtn}
                  onPress={onWCButtonClicked}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      alignContent: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight: "600",
                      }}
                    >
                      Connect Wallet
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
      {isLoading && <AppLoader />}
    </>
  );
}

const styles = StyleSheet.create({
  walletConnectBtn: {
    backgroundColor: "orange",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#8079B4",
    width: 280,
    height: 65,
    borderRadius: 60,
    alignItems: "center",
    /*     borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 30,
    marginBottom: 30,
    paddingTop: 5, */
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  walletConnectMainBtn: {
    backgroundColor: "orange",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#8079B4",
    width: 280,
    height: 65,
    borderRadius: 60,
    alignItems: "center",
    /*     borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 30,
    marginBottom: 30,
    paddingTop: 5, */
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
