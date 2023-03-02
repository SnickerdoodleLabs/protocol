import {
  DataWalletAddress,
  IDynamicRewardParameter,
  LinkedAccount,
  RecipientAddressType,
  SDQLQueryRequest,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import LottieView from "lottie-react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Dimensions, View } from "react-native";

import UnlockLottie from "../assets/lotties/unlock.json";

export interface ILayoutContext {
  setLoadingStatus: (loadingStatus: ILoadingStatus) => void;
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

const initialLoadingStatus: ILoadingStatus = {
  loading: false,
  type: ELoadingStatusType.IDLE,
};

const LayoutContextProvider = ({ children }) => {
  const [loadingStatus, _setLoadingStatus] =
    useState<ILoadingStatus>(initialLoadingStatus);
  const setLoadingStatus = (loadingStatus: ILoadingStatus) => {
    _setLoadingStatus(loadingStatus);
  };

  const cancelLoading = () => {
    _setLoadingStatus(initialLoadingStatus);
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
              <LottieView source={UnlockLottie} autoPlay loop />
            </View>
          );
      }
      return null;
    }
  }, [loadingStatus]);

  return (
    <LayoutContext.Provider value={{ cancelLoading, setLoadingStatus }}>
      {loadingComponent}
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContextProvider;

export const useLayoutContext = () => useContext(LayoutContext);
