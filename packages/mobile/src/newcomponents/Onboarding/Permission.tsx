import { Age, EWalletDataType } from "@snickerdoodlelabs/objects";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import { useAppContext } from "../../context/AppContextProvider";
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
              value={item.state.status}
              onValueChange={() => {
                if (!item.state.status) {
                  console.log("myITems", item);
                  item.setPermissions((prevItems) => [
                    ...prevItems,
                    item.ewalletType,
                  ]);
                } else {
                  const newItems = item.permissions.filter(
                    (val) => val != item.ewalletType,
                  );
                  console.log("newItems", newItems);
                  item.setPermissions(newItems);
                }
                item.setState({
                  walletDataType: item.walletDataType,
                  status: !item.state.status,
                });
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const Permission = () => {
  const { mobileCore } = useAppContext();

  interface IPermissionStateProps {
    walletDataType: EWalletDataType;
    status: boolean;
  }

  // Personal Info
  const [age, setAge] = useState<IPermissionStateProps>({
    walletDataType: EWalletDataType.Age,
    status: true,
  });
  const [gender, setGender] = useState<IPermissionStateProps>({
    walletDataType: EWalletDataType.Gender,
    status: true,
  });
  const [location, setLocation] = useState<IPermissionStateProps>({
    walletDataType: EWalletDataType.Location,
    status: true,
  });
  const [siteVisited, setSiteVisited] = useState<IPermissionStateProps>({
    walletDataType: EWalletDataType.SiteVisits,
    status: true,
  });
  // Crypto Accounts
  const [nfts, setNFTs] = useState<IPermissionStateProps>({
    walletDataType: EWalletDataType.AccountNFTs,
    status: true,
  });
  const [tokenBalance, setTokenBalance] = useState<IPermissionStateProps>({
    walletDataType: EWalletDataType.AccountBalances,
    status: true,
  });
  const [transactionHistory, setTransactionHistory] =
    useState<IPermissionStateProps>({
      walletDataType: EWalletDataType.EVMTransactions,
      status: true,
    });
  // Discord
  const [discord, setDiscord] = useState<IPermissionStateProps>({
    walletDataType: 11,
    status: true,
  });
  const [permissions, setPermissions] = useState<EWalletDataType[]>([]);
  React.useEffect(() => {
    mobileCore.dataPermissionUtils.getPermissions().map((permission) => {
      if ((permission.length == 0)) {
        mobileCore.dataPermissionUtils.setPermissions([
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        ]);
      }
      else{
        
      }
      setPermissions(permission);
    });
  }, []);

  useEffect(() => {
    permissions.map((perm) => {
      if (age.walletDataType === perm) {
        setAge({ walletDataType: perm, status: true });
      }
      if (gender.walletDataType === perm) {
        setGender({ walletDataType: perm, status: true });
      }
      if (location.walletDataType === perm) {
        setLocation({ walletDataType: perm, status: true });
      }
      if (siteVisited.walletDataType === perm) {
        setSiteVisited({ walletDataType: perm, status: true });
      }
      if (nfts.walletDataType === perm) {
        setNFTs({ walletDataType: perm, status: true });
      }
      if (tokenBalance.walletDataType === perm) {
        setTokenBalance({ walletDataType: perm, status: true });
      }
      if (transactionHistory.walletDataType === perm) {
        setTransactionHistory({ walletDataType: perm, status: true });
      }
    });
    mobileCore.dataPermissionUtils.setPermissions(permissions);
  }, [permissions]);

  return (
    <View style={styles.container}>
      <ToggleRow
        title="Personal Info"
        perms={[
          {
            name: "Age",
            state: age,
            setState: setAge,
            ewalletType: EWalletDataType.Age,
            permissions,
            setPermissions,
          },
          {
            name: "Gender",
            state: gender,
            setState: setGender,
            ewalletType: EWalletDataType.Gender,
            permissions,
            setPermissions,
          },
          {
            name: "Location",
            state: location,
            setState: setLocation,
            ewalletType: EWalletDataType.Location,
            permissions,
            setPermissions,
          },
          {
            name: "Sites Visited",
            state: siteVisited,
            setState: setSiteVisited,
            ewalletType: EWalletDataType.SiteVisits,
            permissions,
            setPermissions,
          },
        ]}
      />
      <ToggleRow
        title="Crypto Accounts"
        perms={[
          {
            name: "NFTs",
            state: nfts,
            setState: setNFTs,
            ewalletType: EWalletDataType.AccountNFTs,
            permissions,
            setPermissions,
          },
          {
            name: "Token Balance",
            state: tokenBalance,
            setState: setTokenBalance,
            ewalletType: EWalletDataType.AccountBalances,
            permissions,
            setPermissions,
          },
          {
            name: "Transaction History",
            state: transactionHistory,
            setState: setTransactionHistory,
            ewalletType: EWalletDataType.EVMTransactions,
            permissions,
            setPermissions,
          },
        ]}
      />
      <ToggleRow
        title="Social Media"
        perms={[
          {
            name: "Discord",
            state: discord,
            setState: setDiscord,
            ewalletType: 11,
            permissions,
            setPermissions,
          },
        ]}
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
