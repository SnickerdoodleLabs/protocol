import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import React, { createContext, useContext, useMemo, useState } from "react";
import {
  IConfigOverrides,
  AccountAddress,
  Signature,
  LanguageCode,
  EChain,
} from "@snickerdoodlelabs/objects";
import { MobileStorageUtils } from "../components/MobileStorageUtils";
import { ResultAsync } from "neverthrow";

interface CoreContextType {
  snickerdoodleCore: SnickerdoodleCore;
  isUnlocked: boolean;
  isInitiliazed: boolean;
  setUnlocked: (isUnlocked: boolean) => void;
  getLinkAccountMessage: () => ResultAsync<string, null>;
  addAccount: (
    account: AccountAddress,
    signature: Signature,
    language: LanguageCode,
    chain: EChain
  ) => void;
}
interface ICoreProviderProps {
  children: React.ReactNode;
  configs?: IConfigOverrides | undefined;
}

const CoreContext = createContext<CoreContextType>({} as CoreContextType);

const CoreProvider: React.FC<ICoreProviderProps> = ({ children, configs }) => {
  const snickerdoodleCore = useMemo(
    () => new SnickerdoodleCore(configs, new MobileStorageUtils(), undefined),
    []
  );
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isInitiliazed, setIsInitialized] = useState<boolean>(false);

  const setUnlocked = (state: boolean) => {
    setIsUnlocked(state);
  };
  const addAccount = (
    account: AccountAddress,
    signature: Signature,
    language: LanguageCode,
    chain: EChain
  ) => {
    return snickerdoodleCore.account.addAccount(
      account,
      signature,
      language,
      chain,
      undefined
    );
  };
  const getLinkAccountMessage = () => {
    return snickerdoodleCore.account
      .getLinkAccountMessage(LanguageCode("en"), undefined)
      .map((message) => {
        return message;
      })
      .mapErr((error) => {
        console.log("Error getting link account message", error);
        return null;
      });
  };

  React.useEffect(() => {
    snickerdoodleCore.initialize().map(() => {
      setIsInitialized(true);
    });
  }, []);

  return (
    <CoreContext.Provider
      value={{
        snickerdoodleCore,
        isUnlocked,
        isInitiliazed,
        getLinkAccountMessage,
        setUnlocked,
        addAccount,
      }}
    >
      {children}
    </CoreContext.Provider>
  );
};

export const useCoreContext = () => useContext(CoreContext);
export default CoreProvider;
