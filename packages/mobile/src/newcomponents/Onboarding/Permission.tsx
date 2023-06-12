import { Age, EWalletDataType } from "@snickerdoodlelabs/objects";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import { useAppContext } from "../../context/AppContextProvider";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import CustomSwitch from "../Custom/CustomSwitch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/ThemeContext";

const ToggleRow = ({ title, perms }: { title: string; perms: Array<any> }) => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      width: normalizeWidth(380),
      marginTop: normalizeHeight(20),
    },
    row: {
      borderWidth: 1,
      borderColor: theme?.colors.border,
      borderRadius: normalizeWidth(16),
      paddingHorizontal: normalizeWidth(20),
      paddingVertical: normalizeHeight(20),
      marginBottom: normalizeHeight(16),
    },
    rowTitle: {
      fontSize: normalizeWidth(18),
      fontWeight: "bold",
      marginBottom: normalizeHeight(15),
      color: theme?.colors.title,
    },
    toggleContainer: {
      marginBottom: normalizeHeight(14),
    },
  });

  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{title}</Text>
      {perms.map((item) => (
        <View style={styles.toggleContainer} key={item}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{color:theme?.colors.description}}>{item.name}</Text>
            <CustomSwitch
              value={item.state.status}
              onValueChange={() => {
                if (!item.state.status) {
                  item.setPermissions((prevItems) => [
                    ...prevItems,
                    item.ewalletType,
                  ]);
                } else {
                  const newItems = item.permissions.filter(
                    (val) => val != item.ewalletType,
                  );
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
  const { mobileCore, isUnlocked } = useAppContext();
  const theme = useTheme();

  interface IPermissionStateProps {
    walletDataType: EWalletDataType;
    status: boolean;
  }

  // Personal Info
  const [age, setAge] = useState<IPermissionStateProps>({
    walletDataType: EWalletDataType.Age,
    status: false,
  });
  const [gender, setGender] = useState<IPermissionStateProps>({
    walletDataType: EWalletDataType.Gender,
    status: false,
  });
  const [location, setLocation] = useState<IPermissionStateProps>({
    walletDataType: EWalletDataType.Location,
    status: false,
  });
  const [siteVisited, setSiteVisited] = useState<IPermissionStateProps>({
    walletDataType: EWalletDataType.SiteVisits,
    status: false,
  });
  // Crypto Accounts
  const [nfts, setNFTs] = useState<IPermissionStateProps>({
    walletDataType: EWalletDataType.AccountNFTs,
    status: false,
  });
  const [tokenBalance, setTokenBalance] = useState<IPermissionStateProps>({
    walletDataType: EWalletDataType.AccountBalances,
    status: false,
  });
  const [transactionHistory, setTransactionHistory] =
    useState<IPermissionStateProps>({
      walletDataType: EWalletDataType.EVMTransactions,
      status: false,
    });
  // Discord
  const [discord, setDiscord] = useState<IPermissionStateProps>({
    walletDataType: EWalletDataType.Discord,
    status: false,
  });
  const [permissions, setPermissions] = useState<EWalletDataType[]>([]);
  useEffect(() => {
    if (isUnlocked) {
      mobileCore.dataPermissionUtils.getPermissions().map((permission) => {
        AsyncStorage.getItem("permissionSetted").then((setted) => {
          if (permission.length === 0 && setted == null) {
            AsyncStorage.setItem("permissionSetted", "true");
            mobileCore.dataPermissionUtils.setPermissions([
              EWalletDataType.Age,
              EWalletDataType.Gender,
              EWalletDataType.Location,
              EWalletDataType.SiteVisits,
              EWalletDataType.AccountNFTs,
              EWalletDataType.AccountBalances,
              EWalletDataType.EVMTransactions,
              EWalletDataType.Discord,
            ]);

            setPermissions([
              EWalletDataType.Age,
              EWalletDataType.Gender,
              EWalletDataType.Location,
              EWalletDataType.SiteVisits,
              EWalletDataType.AccountNFTs,
              EWalletDataType.AccountBalances,
              EWalletDataType.EVMTransactions,
              EWalletDataType.Discord,
            ]);
          } else {
            setPermissions(permission);
          }
        });
      });
    }
  }, [isUnlocked]);

  useEffect(() => {
    mobileCore.dataPermissionUtils.setPermissions(permissions);

    permissions.map((perm) => {
      if (age.walletDataType === perm) {
        setAge({ walletDataType: perm, status: true });
      }
      if (gender.walletDataType === perm) {
        setGender({ walletDataType: perm, status: true });
      }
      if (location.walletDataType == perm) {
        setLocation({ walletDataType: perm, status: true });
      }
      if (siteVisited.walletDataType == perm) {
        setSiteVisited({ walletDataType: perm, status: true });
      }
      if (nfts.walletDataType == perm) {
        setNFTs({ walletDataType: perm, status: true });
      }
      if (tokenBalance.walletDataType == perm) {
        setTokenBalance({ walletDataType: perm, status: true });
      }
      if (transactionHistory.walletDataType == perm) {
        setTransactionHistory({ walletDataType: perm, status: true });
      }
      if (discord.walletDataType === perm) {
        setDiscord({ walletDataType: perm, status: true });
      }
    });
  }, [permissions, isUnlocked]);

  return (
    <View style={styles.container}>
      <ToggleRow
        title="Personal Info"
        perms={[
          {
            name: "Year of Birth",
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
            name: "Country",
            state: location,
            setState: setLocation,
            ewalletType: EWalletDataType.Location,
            permissions,
            setPermissions,
          },
          {
            name: "Browser History",
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
            name: "Token Balances",
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
            ewalletType: EWalletDataType.Discord,
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
    borderRadius: normalizeWidth(16),
    paddingHorizontal: normalizeWidth(20),
    paddingVertical: normalizeHeight(20),
    marginBottom: normalizeHeight(16),
  },
  rowTitle: {
    fontSize: normalizeWidth(18),
    fontWeight: "bold",
    marginBottom: normalizeHeight(15),
  },
  toggleContainer: {
    marginBottom: normalizeHeight(14),
  },
});

export default Permission;
