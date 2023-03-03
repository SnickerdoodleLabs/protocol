import * as React from "react";
import LottieView from "lottie-react-native";
import {
  StatusBar,
  Animated,
  Text,
  Image,
  View,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import profileForm from "../../assets/lotties/profileForm.json";
import tour1 from "../../assets/lotties/tour1.json";
import tour2 from "../../assets/lotties/tour2.json";
import error from "../../assets/lotties/error.json";
import success from "../../assets/lotties/success.json";

import { ROUTES } from "../../constants";
import { MotiView } from "@motify/components";
import { Easing } from "react-native-reanimated";
import { useAccountLinkingContext } from "../../context/AccountLinkingContextProvider";
import { ProfileForm } from "../ProfileForm/ProfileForm";
import { useAppContext } from "../../context/AppContextProvider";

export default function StarterTour(props: any) {
  const { navigation } = props;
  const { width, height } = Dimensions.get("screen");
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const { onWCButtonClicked } = useAccountLinkingContext();
  const { isUnlocked } = useAppContext();

  React.useEffect(() => {
    console.log("this is scrollX useEffect", scrollX);
  }, [scrollX]);

  const bgs = ["#fff", "#fff", "#fff", "#fff"];
  const DATA = [
    {
      key: "3571572",
      title: "Multi-lateral intermediate moratorium",
      description:
        "I'll back up the multi-byte XSS matrix, that should feed the SCSI application!",
      image: "https://pngimg.com/d/lion_king_PNG18.png",
    },
    {
      key: "3571747",
      title: "Automated radical data-warehouse",
      description:
        "Use the optical SAS system, then you can navigate the auxiliary alarm!",
      image: "https://pngimg.com/d/lion_king_PNG18.png",
    },
    {
      key: "3571680",
      title: "Inverse attitude-oriented system engine",
      description:
        "The ADP array is down, compress the online sensor so we can input the HTTP panel!",
      image: "https://pngimg.com/d/lion_king_PNG18.png",
    },
    {
      key: "3571603",
      title: "Monitored global data-warehouse",
      description: "We need to program the open-source IB interface!",
      image: "https://pngimg.com/d/lion_king_PNG18.png",
    },
  ];
  const SomeComponent1 = () => {
    return (
      <View
        style={[
          {
            width,
            height,
            alignItems: "center",
            paddingTop: 70,
            paddingHorizontal: 20,
            backgroundColor: "#DCDBF2",
          },
        ]}
      >
        <View style={{}}>
          <LottieView
            style={{ width: "100%" }}
            resizeMode="contain"
            source={tour2}
            autoPlay
            loop
          />
        </View>
        <View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "400",
              fontFamily: "Space Grotesk",
              color: "black",
              paddingTop: 60,
              lineHeight: 25,
            }}
          >
            Link your account to view your web3 activity in your secure personal
            Data Wallet and claim your reward.
          </Text>
          <View style={{ paddingTop: 50 }}>
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
                      fontFamily: "Space Grotesk",
                    }}
                  >
                    Connect Wallet
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Indicator scrollX={scrollX} />
      </View>
    );
  };

  const SomeComponent = () => {
    return (
      <View
        style={[
          {
            width,
            height,
            alignItems: "center",
            paddingTop: 70,
            paddingHorizontal: 20,
            backgroundColor: "#FFFDED",
          },
        ]}
      >
        <View style={{}}>
          <LottieView
            style={{ width: "100%" }}
            resizeMode="contain"
            source={tour1}
            autoPlay
            loop
          />
        </View>
        <View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 25,
              fontWeight: "800",
              fontFamily: "Space Grotesk",
              color: "black",
              paddingTop: 60,
            }}
          >
            Welcome to Snickerdoodle
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: "#1e0f30",
              fontSize: 15,
              paddingTop: 25,
              lineHeight: 25,
              fontWeight: "400",
              fontFamily: "Space Grotesk",
            }}
          >
            You are so cool because you use Snicerdoodle Data WalletYou are so
            cool because you use Snicerdoodle Data WalletYou are so cool because
            you use Snicerdoodle Data Wallet
          </Text>
        </View>

        <Indicator scrollX={scrollX} />
      </View>
    );
  };

  const SomeComponent2 = () => {
    return (
      <View
        style={[
          {
            width,
            height,
            alignItems: "center",
            paddingTop: 30,
            paddingHorizontal: 20,
            backgroundColor: "#eae1e6",
          },
        ]}
      >
        <View style={{}}>
          <LottieView
            style={{ width: "80%" }}
            resizeMode="contain"
            source={profileForm}
            autoPlay
            loop
          />
        </View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            fontWeight: "400",
            fontFamily: "Space Grotesk",
            color: "black",
            paddingTop: 20,
            lineHeight: 25,
          }}
        >
          No one can access this personal information until you use
          Snickerdoodle to anonymize it and rent it out to brands of your
          choice.
        </Text>
        <View style={{ paddingTop: 20 }}>
          <ProfileForm navigation={undefined} />
        </View>
        <Indicator scrollX={scrollX} />
      </View>
    );
  };

  const Exit = () => {
    return (
      <View
        style={[
          {
            width,
            height,
            alignItems: "center",
            justifyContent: isUnlocked ? "flex-start" : "center",
            paddingTop: isUnlocked ? 100 : 0,
            paddingHorizontal: 20,
            backgroundColor: isUnlocked ? "#afe0bd" : "#ed95bf",
          },
        ]}
      >
        <View>
          <LottieView
            style={{ width: "100%" }}
            resizeMode="contain"
            source={isUnlocked ? success : error}
            autoPlay
            loop
          />
        </View>
        <View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "800",
              fontFamily: "Space Grotesk",
              color: isUnlocked ? "black" : "black",
              paddingTop: 60,
            }}
          >
            {isUnlocked && "Add More, Earn More"}
            {!isUnlocked && "To Continue, please connect an account"}
          </Text>
        </View>
        {isUnlocked && (
          <View style={{ paddingTop: 40 }}>
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
                      fontFamily: "Space Grotesk",
                    }}
                  >
                    Add More Account
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {!isUnlocked && (
          <View style={{ position: "absolute", bottom: 140 }}>
            <Button
              title="Go To Portfolio"
              onPress={() => {
                navigation.navigate(ROUTES.WALLET);
              }}
            />
          </View>
        )}
        <Indicator scrollX={scrollX} />
      </View>
    );
  };

  const DATA2 = [
    <SomeComponent />,
    <SomeComponent1 />,
    <SomeComponent2 />,
    <Exit />,
  ];

  const Indicator = ({ scrollX }) => {
    React.useEffect(() => {
      console.log("inside Indicator", scrollX);
    }, [scrollX]);
    return (
      <View
        style={{
          position: "absolute",
          bottom: 75,
          flexDirection: "row",
        }}
      >
        {DATA.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
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
          return (
            <Animated.View
              key={`indicator-${i}`}
              style={{
                height: 10,
                width: 25,
                borderRadius: 20,
                backgroundColor: "#00CCB7",
                margin: 10,
                opacity,
                transform: [{ scale }],
              }}
            />
          );
        })}
      </View>
    );
  };

  const Backdrop = ({ scrollX }) => {
    const backgroundColor = scrollX.interpolate({
      inputRange: bgs.map((_, i) => i * width),
      outputRange: bgs.map((bg) => bg),
    });
    return (
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { backgroundColor }]}
      />
    );
  };

  const Square = ({ scrollX }) => {
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(scrollX, width),
        new Animated.Value(width),
      ),
      1,
    );

    const rotate = YOLO.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ["20deg", "-12deg", "27deg"],
    });
    const translateX = YOLO.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -height, 0],
    });

    return (
      <Animated.View
        style={{
          width: height,
          height: height,
          backgroundColor: "#fff",
          borderRadius: 86,
          position: "absolute",
          top: -height * 0.5,
          left: -height * 0.3,
          transform: [{ rotate }, { translateX }],
        }}
      />
    );
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar hidden />
        <Backdrop scrollX={scrollX} />
        <Square scrollX={scrollX} />
        <Animated.FlatList
          data={DATA2}
          keyExtractor={(item, index) => `${index}`}
          horizontal
          scrollEventThrottle={32}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          renderItem={({ item }) => {
            return item;
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  walletConnectBtn: {
    backgroundColor: "#372D8A",
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
