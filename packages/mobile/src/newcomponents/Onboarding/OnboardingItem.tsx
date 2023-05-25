import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { normalizeWidth, normalizeHeight } from "../../themes/Metrics";
import VideoPlayer from "../VideoPlayer";
import Icon from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../context/ThemeContext";

interface OnboardingItemProps {
  item: {
    asset: { type: string; source: any; height: number } | null;
    title: string;
    description: string;
    component: JSX.Element;
    button: JSX.Element;
    backButton: boolean;
  };
  scrollViewRef: any;
  scrollX: any;
}

export default function OnboardingItem({
  item,
  scrollViewRef,
  scrollX,
}: OnboardingItemProps) {
  const { width, height } = Dimensions.get("window");
  const ITEM_WIDTH = width;
  const theme = useTheme();
  return (
    <SafeAreaView style={{ height: "90%" }}>
      <ScrollView>
        <SafeAreaView
          style={{
            zIndex: 999,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              paddingHorizontal: normalizeWidth(18),
              marginTop: normalizeHeight(40),
              height: normalizeHeight(item?.asset?.height ?? 0),
            }}
          >
            {item.asset && item.asset.type === "image" ? (
              <Image
                style={{
                  flex: 1,
                  resizeMode: "contain",
                }}
                source={item?.asset?.source}
              />
            ) : (
              <VideoPlayer source={item.asset?.source} />
            )}
          </View>
          <View>
            <View
              style={{
                marginTop: item?.asset?.height! > 0 ? normalizeHeight(60) : 20,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: normalizeWidth(24),
                  color: theme?.colors.title,
                  lineHeight: normalizeWidth(29),
                }}
              >
                {item.title}
              </Text>
            </View>
            <View style={{ marginTop: normalizeHeight(12) }}>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "400",
                  color: theme?.colors.description,
                  fontSize: normalizeWidth(16),
                  lineHeight: normalizeWidth(23),
                }}
              >
                {item.description}
              </Text>
            </View>

            {item.component && item.component}
            {item.backButton && (
              <TouchableOpacity
                style={{ position: "absolute", left: 0, top: 20 }}
                onPress={() => {
                  scrollViewRef.current?.scrollTo({
                    x: scrollX._value - ITEM_WIDTH,
                    animated: true,
                  });
                }}
              >
                <Icon
                  name="arrow-back-outline"
                  size={normalizeWidth(30)}
                  color="#9E9E9E"
                />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
}
