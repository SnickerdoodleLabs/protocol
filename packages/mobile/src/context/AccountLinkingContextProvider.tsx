import {
  EChain,
  LanguageCode,
  AccountAddress,
  Signature,
} from "@snickerdoodlelabs/objects";
import React, { useContext, useEffect, useState } from "react";
import { useAppContext } from "./AppContextProvider";
import { useLayoutContext, ELoadingStatusType } from "./LayoutContext";
import { BlockchainActions } from "../newcomponents/Settings/BlockchainActions";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";
export interface IAccountLinkingContext {
  onWCButtonClicked: () => void;
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
  const [signClick, setSignClick] = useState(false);
  const { mobileCore, isUnlocked } = useAppContext();
  const [credentials] = useState<ICredentials>(initialCredentials);
  const { setLoadingStatus } = useLayoutContext();

  useEffect(() => {
    if (credentials.accountAddress) {
      setTimeout(manageAccountCredentials, 1000);
    }
  }, [JSON.stringify(credentials)]);

  const onConnect = () => {
    handleButtonPress();
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
        enLangueCode,
        EChain.EthereumMainnet,
      );
    } else {
      accountService.addAccount(
        credentials.accountAddress!,
        credentials.signature!,
        enLangueCode,
        EChain.EthereumMainnet,
      );
    }
  };

  const [clientId, setClientId] = React.useState<string>();
  const { isConnected, provider, open } = useWalletConnectModal();
  const handleButtonPress = async () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    return open();
  };

  useEffect(() => {
    async function getClientId() {
      if (provider && isConnected) {
        const _clientId = await provider?.client?.core.crypto.getClientId();
        setClientId(_clientId);
        setSignClick(true);
      } else {
        setClientId(undefined);
      }
    }

    getClientId();
  }, [isConnected, provider]);

  return (
    <AccountLinkingContext.Provider value={{ onWCButtonClicked: onConnect }}>
      {children}
      <BlockchainActions
        signStatus={signClick}
        onDisconnect={handleButtonPress}
      />
    </AccountLinkingContext.Provider>
  );
};

export default AccountLinkingContextProvider;

export const useAccountLinkingContext = () => useContext(AccountLinkingContext);
