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
import { useLayoutContext, ELoadingStatusType } from "./LayoutContext";

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
  const { mobileCore, isUnlocked, linkedAccounts } = useAppContext();
  const [askForSignature, setAskForSignature] = useState<boolean>(false);
  const [credentials, setCredentials] =
    useState<ICredentials>(initialCredentials);
  const { setLoadingStatus } = useLayoutContext();

  const wcConnector = useWalletConnect();

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
    const accountService = mobileCore.accountService;

    return accountService
      .getUnlockMessage(enLangueCode)
      .andThen((message) =>
        ResultAsync.fromPromise(
          wcConnector.signPersonalMessage([message, wcConnector.accounts[0]]),
          (e) => e,
        ),
      )
      .map((signature) => {
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
        if (
          linkedAccounts.includes(sessionstatus.accounts[0] as AccountAddress)
        ) {
          // @TODO show popup
          wcConnector.killSession();
          return okAsync(undefined);
        }
        return okAsync(setAskForSignature(true));
      })
      .orElse((e) => {
        console.error(e);
        return okAsync(undefined);
      });
  };

  const manageAccountCredentials = () => {
    setLoadingStatus({
      loading: true,
      type: ELoadingStatusType.ADDING_ACCOUNT,
    });
    const accountService = mobileCore.accountService;
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
      {children}
    </AccountLinkingContext.Provider>
  );
};

export default AccountLinkingContextProvider;

export const useAccountLinkingContext = () => useContext(AccountLinkingContext);