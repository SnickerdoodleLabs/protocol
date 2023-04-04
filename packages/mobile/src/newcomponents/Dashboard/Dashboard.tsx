import {
  Button,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import Dropdown from "./Dropdown";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/Ionicons";
import DashboardTab from "./DashboardTab";
import { useAppContext } from "../../context/AppContextProvider";

const Dashboard = () => {
  const onSelect = () => {};
  const { mobileCore } = useAppContext();

  useEffect(() => {
    mobileCore.accountService.getAccountNFTs().map((res) => {
      console.log("res", res);
    });
  }, []);
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <SafeAreaView style={{ marginHorizontal: normalizeWidth(20) }}>
        <View style={styles.containerBox}>
          <Text style={styles.title}>My Data Dashboard</Text>
          <View style={styles.dropdownContainer}>
            <Icon name="funnel-outline" size={normalizeWidth(20)} />
          </View>
        </View>
        <View style={{ alignItems: "center", zIndex: 999 }}>
          <Dropdown
            items={[
              { label: "test", value: "test" },
              { label: "test2", value: "test2" },
              { label: "test3", value: "test3" },
            ]}
            onSelect={onSelect}
          />
        </View>
        <DashboardTab />
      </SafeAreaView>
    </ScrollView>
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
  },
  dropdownContainer: {
    width: normalizeWidth(60),
    height: normalizeHeight(56),
    backgroundColor: "#F5F5F5",
    borderRadius: normalizeWidth(16),
    justifyContent: "center",
    alignItems: "center",
  },
});
