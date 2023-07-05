import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

import Icon from "react-native-vector-icons/Ionicons";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import { ROUTES } from "../../constants";
import { useNavigation } from "@react-navigation/native";

export default function Settings() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ backgroundColor: "white", height: "100%" }}>
      <ScrollView
        style={{
          backgroundColor: "white",
          paddingHorizontal: normalizeWidth(24),
        }}
      >
        <SafeAreaView style={{ backgroundColor: "white" }}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: normalizeWidth(24),
              color: "#424242",
              marginTop: normalizeHeight(20),
            }}
          >
            Settings
          </Text>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: normalizeHeight(50),
            }}
            onPress={() => {
              navigation.navigate(ROUTES.CRYPTO_SETTINGS);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: normalizeWidth(62),
                  height: normalizeHeight(62),
                }}
                source={require("../../assets/images/settings-crypto.png")}
              />
              <Text
                style={{
                  paddingLeft: normalizeWidth(20),
                  fontWeight: "700",
                  fontSize: normalizeWidth(20),
                }}
              >
                Crypto Accounts
              </Text>
            </View>
            <View>
              <Icon name="chevron-forward-outline" size={normalizeWidth(25)} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: normalizeHeight(32),
            }}
            onPress={() => {
              navigation.navigate(ROUTES.PERSONAL_SETTINGS);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: normalizeWidth(62),
                  height: normalizeHeight(62),
                }}
                source={require("../../assets/images/settings-personal.png")}
              />
              <Text
                style={{
                  paddingLeft: normalizeWidth(20),
                  fontWeight: "700",
                  fontSize: normalizeWidth(20),
                }}
              >
                Personal Info
              </Text>
            </View>
            <View>
              <Icon name="chevron-forward-outline" size={normalizeWidth(25)} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: normalizeHeight(32),
            }}
            onPress={() => {
              navigation.navigate(ROUTES.REWARDS_SETTINGS);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: normalizeWidth(62),
                  height: normalizeHeight(62),
                }}
                source={require("../../assets/images/settings-subscription.png")}
              />
              <Text
                style={{
                  paddingLeft: normalizeWidth(20),
                  fontWeight: "700",
                  fontSize: normalizeWidth(20),
                }}
              >
                Rewards Subscriptions
              </Text>
            </View>
            <View>
              <Icon name="chevron-forward-outline" size={normalizeWidth(25)} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: normalizeHeight(32),
            }}
            onPress={() => {
              navigation.navigate(ROUTES.PERMISSION_SETTINGS);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: normalizeWidth(62),
                  height: normalizeHeight(62),
                }}
                source={require("../../assets/images/settings-permissions.png")}
              />
              <Text
                style={{
                  paddingLeft: normalizeWidth(20),
                  fontWeight: "700",
                  fontSize: normalizeWidth(20),
                }}
              >
                Data Permissions
              </Text>
            </View>
            <View>
              <Icon name="chevron-forward-outline" size={normalizeWidth(25)} />
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
