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

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width;

const OnboardingMain = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef();
  const { onWCButtonClicked } = useAccountLinkingContext();
  const { isUnlocked } = useAppContext();
  const navigation = useNavigation();

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
  const data2 = [
    { value: 50, color: "#f00" },
    { value: 30, color: "#0f0" },
    { value: 20, color: "#00f" },
  ];
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
              {`\n If you don't want to use Wallet Connect \n You can use Public Key`}
            </Text>
            <Button title="Use Public Key" />
          </View>
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
              onWCButtonClicked();
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
      description: `Choose your data  permissions to control what\n information you share.`,
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
                isUnlocked && navigation.replace(ROUTES.HOME);
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
