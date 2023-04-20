import {
  AccountAddress,
  EWalletDataType,
  Invitation,
  IOpenSeaMetadata,
} from "@snickerdoodlelabs/objects";
import LottieView from "lottie-react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import UnlockLottie from "../assets/lotties/unlock.json";
import { useAppContext } from "./AppContextProvider";
import { IInvitationParams } from "./InvitationContext";
import Dropdown from "../newcomponents/Dashboard/Dropdown";
import { normalizeHeight, normalizeWidth } from "../themes/Metrics";
import BottomSheetComponenet from "../newcomponents/Custom/BottomSheetComponenet";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../constants";
import CustomSwitch from "../newcomponents/Custom/CustomSwitch";

var styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    width: "100%",
  },
  modalView: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    // fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: normalizeWidth(24),
    lineHeight: normalizeHeight(29),
    marginLeft: normalizeWidth(25),
    marginTop: normalizeHeight(20),
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
  sidebar: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    paddingHorizontal: 16,
    zIndex: 999,
  },
  borderBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#EAECF0",
    borderRadius: normalizeWidth(24),
    marginTop: normalizeHeight(24),
    paddingVertical: normalizeHeight(20),
    paddingHorizontal: normalizeWidth(0),
  },
  row: {
    borderWidth: 0,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: normalizeWidth(20),
    paddingVertical: normalizeHeight(0),
    marginBottom: 16,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  toggleContainer: {
    marginBottom: 20,
  },
});

export interface ILayoutContext {
  setLoadingStatus: (loadingStatus: ILoadingStatus) => void;
  setInvitationStatus: (
    status: boolean,
    data: any,
    invitationParams: any,
  ) => void;
  cancelLoading: () => void;
}

export const LayoutContext = React.createContext<ILayoutContext>(
  {} as ILayoutContext,
);

export enum ELoadingStatusType {
  IDLE,
  UNLOCKING,
  ADDING_ACCOUNT,
}

export interface ILoadingStatus {
  loading: boolean;
  type: ELoadingStatusType;
}
export interface IInvitationStatus {
  status: boolean;
  data?: IOpenSeaMetadata;
  invitationParams?: Invitation;
}

const initialLoadingStatus: ILoadingStatus = {
  loading: false,
  type: ELoadingStatusType.IDLE,
};

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

const LayoutContextProvider = ({ children }) => {
  const navigation = useNavigation();
  const { mobileCore } = useAppContext();
  const { linkedAccounts } = useAppContext();
  const [loadingStatus, _setLoadingStatus] =
    useState<ILoadingStatus>(initialLoadingStatus);
  const [selectedAccount, setSelectedAccount] = React.useState(
    linkedAccounts[0],
  );
  const [pickerLinkedAccounts, setPickerLinkedAccount] = React.useState<any[]>(
    [],
  );
  const [invitationData, setInvitationData] = useState<IOpenSeaMetadata>();
  const [invitation, setInvitation] = useState<IInvitationParams | null>(null);
  const setLoadingStatus = (loadingStatus: ILoadingStatus) => {
    _setLoadingStatus(loadingStatus);
  };
  const [invitationStatus, _setInvitationStatus] = useState<IInvitationStatus>({
    status: false,
  });

  const [nestedPopup, setNestedPopup] = React.useState(false);
  const [nestedSettings, setNestedSettings] = React.useState(false);
  const [invitationSuccess, setInvitationSuccess] = React.useState(false);

  const [permissions, setPermissions] = useState<EWalletDataType[]>([]);
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
    status: false,
  });

  React.useEffect(() => {
    mobileCore.dataPermissionUtils.getPermissions().map((permission) => {
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

  const onSelect = (item) => {
    console.log("SSSS", invitation, item.label as AccountAddress);
    mobileCore
      .getCore()
      .setReceivingAddress(
        invitation?.consentContractAddress,
        item.label as AccountAddress,
      );

    mobileCore
      .getCore()
      .setDefaultReceivingAddress(item.label as AccountAddress);

    setSelectedAccount(item.label);
  };
  useEffect(() => {
    let accs = [];
    linkedAccounts?.map((acc) => {
      accs.push({ label: acc as string, value: acc as string });
    });
    setPickerLinkedAccount(accs);
    mobileCore
      .getCore()
      .getReceivingAddress(invitation?.consentContractAddress)
      .map((receivingAccount) => {
        setSelectedAccount(receivingAccount);
      });
  }, [linkedAccounts]);

  const setInvitationStatus = (
    status: boolean,
    data: any,
    invitationParams: any,
  ) => {
    setInvitationData(data.value);
    setInvitation(invitationParams);
    _setInvitationStatus({ status, data, invitationParams });
  };

  const cancelLoading = () => {
    _setLoadingStatus(initialLoadingStatus);
  };

  const acceptInvitationHandle = () => {
    mobileCore.dataPermissionUtils.getPermissions().map((perms) => {
      if (perms.length == 0) {
        mobileCore.dataPermissionUtils
          .generateDataPermissionsClassWithDataTypes([
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
          ])
          .map((dataPermissions) => {
            mobileCore.invitationService.acceptInvitation(
              invitationStatus.invitationParams!,
              dataPermissions,
            );
          });
      } else {
        mobileCore.dataPermissionUtils
          .generateDataPermissionsClassWithDataTypes(perms)
          .map((dataPermissions) => {
            mobileCore.invitationService.acceptInvitation(
              invitationStatus.invitationParams!,
              dataPermissions,
            );
          });
      }

      setNestedPopup(false);
      setNestedSettings(false);
      setInvitationSuccess(true);
    });
  };
  const rejectInvitationHandle = () => {
    mobileCore.invitationService.rejectInvitation(
      invitationStatus.invitationParams!,
    );
    setInvitationStatus(
      false,
      invitationStatus.data,
      invitationStatus.invitationParams,
    );
  };

  const handleNestedPopup = () => {
    setNestedPopup(!nestedPopup);
  };

  const loadingComponent = useMemo(() => {
    if (loadingStatus.loading) {
      switch (true) {
        case loadingStatus.type === ELoadingStatusType.ADDING_ACCOUNT:
          return (
            <View
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                zIndex: 99999,
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{ width: 250, height: 250 }}
                source={require("../assets/images/S-loading6.gif")}
              />
              {/*  <LottieView source={UnlockLottie} autoPlay loop /> */}
            </View>
          );
      }
      return null;
    }
  }, [loadingStatus]);

  const InvitationPopUp = useMemo(() => {
    if (invitationStatus) {
      return (
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={invitationStatus.status}
            onRequestClose={() => {
              setInvitationStatus(false, invitationStatus.data, invitation);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{ paddingTop: normalizeHeight(20) }}>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        setInvitationStatus(
                          false,
                          invitationStatus.data,
                          invitation,
                        );
                      }}
                    >
                      <Icon
                        name="arrow-back-outline"
                        size={30}
                        color="black"
                        style={{ paddingBottom: 10 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.containerBox}></View>
                <View
                  style={{
                    alignItems: "center",
                    zIndex: 999,
                    marginTop: normalizeHeight(20),
                  }}
                >
                  <Text
                    style={{
                      color: "#212121",
                      fontWeight: "400",
                      fontSize: normalizeWidth(18),
                      paddingBottom: normalizeHeight(20),
                    }}
                  >
                    Your current receiving account
                  </Text>
                  <Dropdown
                    items={pickerLinkedAccounts}
                    onSelect={onSelect}
                    selected={selectedAccount}
                  />
                </View>
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Image
                    source={{ uri: invitationStatus.data?.image }}
                    style={{
                      width: normalizeWidth(380),
                      height: normalizeHeight(380),
                      marginTop: normalizeHeight(30),
                    }}
                  />
                  <View style={{ paddingTop: normalizeHeight(10) }}>
                    <Text
                      style={{
                        fontSize: normalizeWidth(24),
                        textAlign: "center",
                        color: "#424242",
                        fontWeight: "700",
                        paddingTop: normalizeHeight(20),
                      }}
                    >
                      Claim your {invitationStatus.data?.title} NFT!
                    </Text>
                    <Text
                      style={{
                        fontSize: normalizeWidth(16),
                        textAlign: "center",
                        fontWeight: "400",
                        color: "#616161",
                        lineHeight: normalizeHeight(22),
                        paddingHorizontal: normalizeWidth(24),
                        paddingTop: normalizeHeight(16),
                      }}
                    >
                      {/*   {invitationStatus.data?.description} */}
                      Connect your wallet with the Snickerdoodle Data Wallet to
                      claim NFTs and other rewards!
                    </Text>
                  </View>

                  <View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#6E62A6",
                        width: normalizeWidth(380),
                        height: normalizeHeight(58),
                        borderRadius: normalizeWidth(100),
                        justifyContent: "center",
                        marginTop: normalizeHeight(18),
                      }}
                      onPress={handleNestedPopup}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: "white",
                          fontWeight: "700",
                          fontSize: normalizeWidth(16),
                        }}
                      >
                        Claim Reward
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        backgroundColor: "#D2CEE3",
                        width: normalizeWidth(380),
                        height: normalizeHeight(58),
                        borderRadius: normalizeWidth(100),
                        justifyContent: "center",
                        marginTop: normalizeHeight(10),
                      }}
                      onPress={rejectInvitationHandle}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: "white",
                          fontWeight: "700",
                          fontSize: normalizeWidth(16),
                        }}
                      >
                        Not Interested
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={invitationSuccess}
                onRequestClose={handleNestedPopup}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 400,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <View style={{ backgroundColor: "white", borderRadius: 32 }}>
                    <View style={{ alignItems: "center" }}>
                      <Image
                        source={{
                          uri: `${invitationStatus.data?.image}`,
                        }}
                        style={{
                          width: normalizeWidth(350),
                          height: normalizeHeight(350),
                          marginTop: normalizeHeight(30),
                          borderRadius: normalizeWidth(32),
                        }}
                      />
                      <Text
                        style={{
                          color: "#424242",
                          fontSize: normalizeWidth(24),
                          fontWeight: "700",
                          lineHeight: normalizeHeight(29),
                          textAlign: "center",
                          paddingHorizontal: normalizeWidth(40),
                          paddingVertical: normalizeHeight(12),
                        }}
                      >
                        {`You have successfully \n claimed your reward!`}
                      </Text>
                      <Text
                        style={{
                          color: "#616161",
                          fontSize: normalizeWidth(16),
                          fontWeight: "400",
                          lineHeight: normalizeHeight(22),
                          textAlign: "center",
                          paddingHorizontal: normalizeWidth(40),
                        }}
                      >
                        Once it is ready, your reward will appear on your
                        portfolio. This may take upto 24 hours.
                      </Text>
                    </View>
                    <View
                      style={{
                        alignItems: "center",
                        paddingVertical: normalizeHeight(24),
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#6E62A6",
                          width: normalizeWidth(380),
                          height: normalizeHeight(58),
                          borderRadius: normalizeWidth(100),
                          justifyContent: "center",
                          marginTop: normalizeHeight(28),
                        }}
                        onPress={() => {
                          setInvitationStatus(
                            false,
                            invitationStatus.data,
                            invitationStatus.invitationParams,
                          );
                          setNestedPopup(false);
                          setNestedSettings(false);
                          setInvitationSuccess(false);
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
                          OK
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>

            <View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={nestedPopup}
                onRequestClose={handleNestedPopup}
              >
                {!nestedSettings && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "white",
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: 350,
                        borderRadius: 50,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: normalizeWidth(24),
                          textAlign: "center",
                          color: "#424242",
                          fontWeight: "700",
                          paddingTop: normalizeHeight(40),
                        }}
                      >
                        Your Data Permissions
                      </Text>
                      <Text
                        style={{
                          fontSize: normalizeWidth(16),
                          textAlign: "center",
                          fontWeight: "400",
                          color: "#616161",
                          lineHeight: normalizeHeight(22),
                          paddingHorizontal: normalizeWidth(24),
                          paddingTop: normalizeHeight(5),
                        }}
                      >
                        By clicking “Accept All” you are giving permission for
                        the use of your demographic info and wallet activity.
                      </Text>

                      <View style={{ alignItems: "center" }}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#6E62A6",
                            width: normalizeWidth(380),
                            height: normalizeHeight(58),
                            borderRadius: normalizeWidth(100),
                            justifyContent: "center",
                            marginTop: normalizeHeight(28),
                          }}
                          onPress={acceptInvitationHandle}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              color: "white",
                              fontWeight: "700",
                              fontSize: normalizeWidth(16),
                            }}
                          >
                            Claim Reward
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#D2CEE3",
                            width: normalizeWidth(380),
                            height: normalizeHeight(58),
                            borderRadius: normalizeWidth(100),
                            justifyContent: "center",
                            marginTop: normalizeHeight(10),
                          }}
                          onPress={() => {
                            setNestedSettings(true);
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
                            Settings
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}

                {nestedSettings && (
                  <SafeAreaView
                    style={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#f0f0f0",
                      borderRadius: 50,
                    }}
                  >
                    <View style={{ paddingLeft: 20, paddingTop: 20 }}>
                      <TouchableOpacity
                        onPress={() => {
                          setNestedSettings(false);
                        }}
                      >
                        <Icon
                          name="arrow-back-outline"
                          size={30}
                          color="black"
                          style={{ paddingBottom: 10 }}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        fontSize: normalizeWidth(24),
                        textAlign: "center",
                        color: "#424242",
                        fontWeight: "700",
                        paddingTop: normalizeHeight(40),
                      }}
                    >
                      Manage Your Data Permissions
                    </Text>
                    <Text
                      style={{
                        fontSize: normalizeWidth(16),
                        textAlign: "center",
                        fontWeight: "400",
                        color: "#616161",
                        lineHeight: normalizeHeight(22),
                        paddingHorizontal: normalizeWidth(24),
                        paddingTop: normalizeHeight(16),
                      }}
                    >
                      Choose your data permissions to control what information
                      you share.
                    </Text>

                    <View
                      style={{
                        alignItems: "center",
                        marginTop: normalizeHeight(20),
                      }}
                    >
                      <View style={{ width: 350 }}>
                        <ToggleRow
                          title=""
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
                      </View>
                    </View>
                  </SafeAreaView>
                )}
              </Modal>
            </View>
          </Modal>
        </View>
      );
    }
  }, [
    invitationStatus,
    nestedPopup,
    nestedSettings,
    permissions,
    invitationSuccess,
  ]);

  return (
    <LayoutContext.Provider
      value={{ cancelLoading, setLoadingStatus, setInvitationStatus }}
    >
      {loadingComponent}
      {InvitationPopUp}
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContextProvider;

export const useLayoutContext = () => useContext(LayoutContext);
