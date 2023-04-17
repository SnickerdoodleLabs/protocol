import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import Tokens from "./Tokens/Tokens";
import { IDashboardChildrenProps } from "./Dashboard";
import NFTs from "./NFTs/NFTs";

const Tab = ({ item, isActive }: any) => {
  return (
    <View>
      <Text
        style={[styles.tabText, { color: isActive ? "#645997" : "#9E9E9E" }]}
        key={item}
      >
        {item.title}
      </Text>
      {isActive && <View style={styles.tabUnderline} />}
    </View>
  );
};

const Tabs = ({ data, activeTab, setActiveTab }: any) => {
  return (
    <View
      style={{ width: "35%", paddingTop: normalizeHeight(30), marginLeft: 20 }}
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
  useEffect(() => {
    console.log("data", data);
  }, [data]);
  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <Tabs
        data={[
          { key: "1", component: "1", title: "Tokens" },
          { key: "2", component: "1", title: "NFT's" },
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <View>
        {activeTab === "Tokens" && <Tokens data={data} />}
        {activeTab === "NFT's" && <NFTs data={data} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
  },
  tabUnderline: {
    width: "100%",
    height: 3,
    backgroundColor: "#645997",
    marginTop: 5,
  },
  tabText: {
    fontSize: normalizeWidth(18),
    fontWeight: "600",
  },
});

export default DashboardTab;
