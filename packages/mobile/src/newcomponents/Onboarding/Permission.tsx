import { Age } from "@snickerdoodlelabs/objects";
import React, { useState } from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import CustomSwitch from "../Custom/CustomSwitch";

const ToggleRow = ({ title, perms }: { title: string; perms: Array<any> }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{title}</Text>
      {perms.map((item) => (
        <View style={styles.toggleContainer} key={item}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>{item.name}</Text>
            <CustomSwitch
              value={item.state}
              onValueChange={() => {
                item.setState(!item.state);
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const Permission = () => {
  // Personal Info
  const [age, setAge] = useState<boolean>(false);
  const [gender, setGender] = useState<boolean>(false);
  const [location, setLocation] = useState<boolean>(false);
  const [siteVisited, setSiteVisited] = useState<boolean>(false);
  // Crypto Accounts
  const [nfts, setNFTs] = useState<boolean>();
  const [tokenBalance, setTokenBalance] = useState<boolean>();
  const [transactionHistory, setTransactionHistory] = useState<boolean>();
  // Discord
  const [discord, setDiscord] = useState<boolean>();
  return (
    <View style={styles.container}>
      <ToggleRow
        title="Personal Info"
        perms={[
          { name: "Age", state: age, setState: setAge },
          { name: "Gender", state: gender, setState: setGender },
          { name: "Location", state: location, setState: setLocation },
          { name: "Sites Visited", state: siteVisited, setState: setSiteVisited },
        ]}
      />
      <ToggleRow
        title="Crypto Accounts"
        perms={[
          { name: "NFTs", state: nfts, setState: setNFTs },
          {
            name: "Token Balance",
            state: tokenBalance,
            setState: setTokenBalance,
          },
          {
            name: "Transaction History",
            state: transactionHistory,
            setState: setTransactionHistory,
          },
        ]}
      />
      <ToggleRow
        title="Social Media"
        perms={[{ name: "Discord", state: discord, setState: setDiscord }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    width: normalizeWidth(380),
    marginTop: normalizeHeight(20),
  },
  row: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: normalizeWidth(20),
    paddingVertical: normalizeHeight(20),
    marginBottom: 16,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  toggleContainer: {
    marginBottom: 8,
  },
});

export default Permission;
