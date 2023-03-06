import {
  DataWalletAddress,
  DomainName,
  EVMAccountAddress,
  EVMContractAddress,
  IDynamicRewardParameter,
  Invitation,
  IOpenSeaMetadata,
  LinkedAccount,
  RecipientAddressType,
  SDQLQueryRequest,
  SDQLString,
  TokenId,
} from "@snickerdoodlelabs/objects";
import LottieView from "lottie-react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import UnlockLottie from "../assets/lotties/unlock.json";
import { useAppContext } from "./AppContextProvider";
import { IInvitationParams } from "./InvitationContext";

var styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
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
  data?: any;
  invitationParams?: IInvitationParams;
}

const initialLoadingStatus: ILoadingStatus = {
  loading: false,
  type: ELoadingStatusType.IDLE,
};

const LayoutContextProvider = ({ children }) => {
  const { coreContext } = useAppContext();
  const [loadingStatus, _setLoadingStatus] =
    useState<ILoadingStatus>(initialLoadingStatus);
  const [invitationData, setInvitationData] = useState<IOpenSeaMetadata>();
  const [invitation, setInvitation] = useState<IInvitationParams | null>(null);
  const setLoadingStatus = (loadingStatus: ILoadingStatus) => {
    _setLoadingStatus(loadingStatus);
  };
  const [invitationStatus, _setInvitationStatus] = useState<IInvitationStatus>({
    status: false,
  });
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

  useEffect(() => {
    console.log("falanfilaninv", invitation);
  }, [invitation]);

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
              <LottieView source={UnlockLottie} autoPlay loop />
            </View>
          );
      }
      return null;
    }
  }, [loadingStatus]);

  const InvitationPopUp = useMemo(() => {
    if (invitationStatus) {
      return (
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
              <View
                style={{
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                }}
              >
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
                      name="close"
                      size={30}
                      color="black"
                      style={{ paddingBottom: 10 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={{ uri: invitationData?.image }}
                  style={{ width: 250, height: 250 }}
                />
                <View style={{ paddingTop: 10 }}>
                  <Text style={{ fontSize: 16, textAlign: "center" }}>
                    {invitationData?.title}
                  </Text>
                  <Text style={{ fontSize: 14, textAlign: "center" }}>
                    {invitationData?.description}
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Button
                    title="Reject"
                    onPress={() => {
                      coreContext
                        .getInvitationService()
                        .rejectInvitation(
                          new Invitation(
                            "" as DomainName,
                            invitation?.consentAddress ??
                              ("" as EVMContractAddress),
                            TokenId(BigInt(invitation?.tokenId ?? 0)),
                            invitation?.signature ?? null,
                          ),
                        );
                    }}
                  />
                  <Button
                    title="Accept"
                    onPress={() => {
                      const inv = new Invitation(
                        "" as DomainName,
                        invitation?.consentAddress ??
                          ("" as EVMContractAddress),
                        invitation?.tokenId,
                        invitation?.signature ?? null,
                      );
                      console.log("inv22", inv);
                      coreContext
                        .getInvitationService()
                        .acceptInvitation(inv, null);
                      setInvitationStatus(false,null,null);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      );
    }
  }, [invitationStatus]);

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
