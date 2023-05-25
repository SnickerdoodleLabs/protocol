import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import Tokens from "./Tokens/Tokens";
import { IDashboardChildrenProps } from "./Dashboard";
import NFTs from "./NFTs/NFTs";
import { useTheme } from "../../context/ThemeContext";

const Tab = ({ item, isActive }: any) => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    tabUnderline: {
      width: "100%",
      height: normalizeHeight(4),
      backgroundColor: theme?.colors.title,
      marginTop: normalizeHeight(5),
    },
    tabText: {
      fontSize: normalizeWidth(18),
      fontWeight: "600",
    },
  });
  return (
    <View>
      <Text
        style={[
          styles.tabText,
          { color: isActive ? theme?.colors.title : "#9E9E9E" },
        ]}
        key={item}
      >
        {item.title}
      </Text>
      {isActive && <View style={styles.tabUnderline} />}
    </View>
  );
};

const Tabs = ({ data, activeTab, setActiveTab }: any) => {
  const styles = StyleSheet.create({
    tabsContainer: {
      justifyContent: "space-between",
      flex: 1,
      flexDirection: "row",
    },
  });
  return (
    <View
      style={{ width: "35%", paddingTop: normalizeHeight(30), marginLeft: normalizeWidth(10) }}
    >
      <View style={styles.tabsContainer}>
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

const DashboardTab = ({ data }: IDashboardChildrenProps) => {
  const [activeTab, setActiveTab] = React.useState("Tokens");
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme?.colors.background, height: "100%" }}>
      <Tabs
        data={[
          { key: "1", component: "1", title: "Tokens" },
          { key: "2", component: "1", title: "NFTs" },
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <View>
        {activeTab === "Tokens" && <Tokens data={data} />}
        {activeTab === "NFTs" && <NFTs data={data} />}
      </View>
    </View>
  );
};

export default DashboardTab;
