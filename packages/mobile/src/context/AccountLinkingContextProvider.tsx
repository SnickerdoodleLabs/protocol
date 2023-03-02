import { View } from "@motify/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EChain,
  LanguageCode,
  AccountAddress,
  Signature,
} from "@snickerdoodlelabs/objects";
import WalletConnectProvider, {
  useWalletConnect,
} from "@walletconnect/react-native-dapp";
import { okAsync, ResultAsync } from "neverthrow";
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Dimensions, Platform, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useAppContext } from "./AppContextProvider";

export interface IAccountLinkingContext {
  onWCButtonClicked: () => ResultAsync<void, never>;
}

interface ICredentials {
  accountAddress: AccountAddress | null;
  signature: Signature | null;

  languageCode: LanguageCode | null;
}

const enLangueCode: LanguageCode = LanguageCode("en");

const initialCredentials: ICredentials = {
  accountAddress: null,
  signature: null,
  languageCode: null,
};

export const AccountLinkingContext =
  React.createContext<IAccountLinkingContext>({} as IAccountLinkingContext);

const AccountLinkingContextProvider = ({ children }) => {
  const { coreContext, isUnlocked, linkedAccounts } = useAppContext();
  const [askForSignature, setAskForSignature] = useState<boolean>(false);
  const [credentials, setCredentials] =
    useState<ICredentials>(initialCredentials);

  const wcConnector = useWalletConnect();

  useEffect(() => {
    AsyncStorage.getItem("SD_Accounts").then((a) =>
      console.error("SIKTIRGIT", a),
    );
    AsyncStorage.getItem("dw-account-info").then((a) => console.log(a));
  }, []);
  useEffect(() => {
    if (askForSignature) {
      setTimeout(sign, 500);
    }
  }, [askForSignature]);

  const resetConnection = () => {
    setAskForSignature(false);
    wcConnector.killSession();
  };

  useEffect(() => {
    if (credentials.accountAddress) {
      setTimeout(manageAccountCredentials, 1000);
    }
  }, [JSON.stringify(credentials)]);
  const sign = () => {
    const accountService = coreContext.getAccountService();

    return accountService
      .getUnlockMessage(enLangueCode)
      .andThen((message) =>
        ResultAsync.fromPromise(
          wcConnector.signPersonalMessage([message, wcConnector.accounts[0]]),
          (e) => e,
        ),
      )
      .map((signature) => {
        console.log({ signature });
        if (signature) {
          setCredentials({
            accountAddress: wcConnector.accounts[0] as AccountAddress,
            languageCode: enLangueCode,
            signature: Signature(signature),
          });
        }
      })
      .orElse((e) => {
        console.warn("FFFFFFFFF", e);
        return okAsync(undefined);
      })
      .map(() => {
        resetConnection();
      });
  };

  const onConnect = () => {
    return ResultAsync.fromPromise(wcConnector.connect(), (e) => e)
      .andThen((sessionstatus) => {
        return okAsync(setAskForSignature(true));
      })
      .orElse((e) => {
        console.error(e);
        return okAsync(undefined);
      });
  };

  const manageAccountCredentials = () => {
    const accountService = coreContext.getAccountService();
    if (!isUnlocked) {
      accountService.unlock(
        credentials.accountAddress!,
        credentials.signature!,
        EChain.EthereumMainnet,
        enLangueCode,
      );
      // .map(() => wcConnector.killSession());
    } else {
      accountService.addAccount(
        credentials.accountAddress!,
        credentials.signature!,
        EChain.EthereumMainnet,
        enLangueCode,
      );
      // .map(() => wcConnector.killSession());
    }
  };

  return (
    <AccountLinkingContext.Provider value={{ onWCButtonClicked: onConnect }}>
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 9999,
          display: "flex",
          padding: 40,
          backgroundColor: "red",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          minHeight: Dimensions.get("window").height * 0.25,
          width: Dimensions.get("window").width,
        }}
      >
        <Text>{isUnlocked ? "true" : "false"}</Text>
        <Text>{JSON.stringify(linkedAccounts)}</Text>
      </View>
      {askForSignature && (
        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 9999,
            display: "flex",
            padding: 40,
            backgroundColor: "white",
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            minHeight: Dimensions.get("window").height * 0.25,
            width: Dimensions.get("window").width,
          }}
        >
          <Text>Signature waiting</Text>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: "green",
                padding: 10,
                borderRadius: 16,
                marginBottom: 20,
              }}
              onPress={() => {
                sign();
              }}
            >
              <Text>Ask for signature again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "red",
                padding: 10,
                borderRadius: 16,
              }}
              onPress={() => {
                resetConnection();
              }}
            >
              <Text>Kill Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {children}
    </AccountLinkingContext.Provider>
  );
};

export default AccountLinkingContextProvider;

export const useAccountLinkingContext = () => useContext(AccountLinkingContext);
