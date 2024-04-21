import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import {
  defaultLanguageCode,
  EChain,
  AccountAddress,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ConnectModal, useWallet, WalletProvider } from "@suiet/wallet-kit";
import { ResultAsync } from "neverthrow";
import React, { FC, memo, useCallback, useEffect } from "react";
import "@suiet/wallet-kit/style.css";

interface IProps {
  openWarningModal: () => void;
  isSuiOpen: boolean;
  startLoadingIndicator: () => void;
  endLoadingIndicator: () => void;
  closeSui: () => void;
}

const WrapperComponent: FC = memo(({ children }) => {
  return <WalletProvider autoConnect={false}>{children}</WalletProvider>;
});

const SuietKitLogic: FC<IProps> = ({
  openWarningModal,
  isSuiOpen,
  closeSui,
  startLoadingIndicator,
  endLoadingIndicator,
}) => {
  const suiWallet = useWallet();
  const { sdlDataWallet } = useDataWalletContext();

  useEffect(() => {
    if (suiWallet.connected) {
      handleSuiWalletConnect();
    }
  }, [suiWallet.connected]);

  const { linkedAccounts } = useAppContext();

  const handleSuiWalletConnect = useCallback(() => {
    if (suiWallet.connected) {
      if (
        linkedAccounts?.find(
          (linkedAccount) =>
            linkedAccount.sourceAccountAddress ===
            (suiWallet.account?.address || ""),
        )
      ) {
        closeSui();
        suiWallet.disconnect();
        return openWarningModal();
      }
      return sdlDataWallet.account
        .getLinkAccountMessage(defaultLanguageCode)
        .andThen((message) => {
          return ResultAsync.fromPromise(
            suiWallet.signMessage({
              message: new TextEncoder().encode(message),
            }),
            () => new Error("Error signing message"),
          ).andThen((signature) => {
            startLoadingIndicator();
            return sdlDataWallet.account
              .addAccount(
                (suiWallet.account?.address || "") as AccountAddress,
                signature.signature as Signature,
                defaultLanguageCode,
                EChain.Sui,
              )
              .mapErr((e) => {
                console.error(e);
                endLoadingIndicator();
              })
              .map(() => {
                closeSui();
                endLoadingIndicator();
              });
          });
        })
        .mapErr(() => {
          closeSui();

          suiWallet.disconnect();
        })
        .map(() => {
          suiWallet.disconnect();
        });
    }
    return;
  }, [suiWallet, linkedAccounts]);

  return <ConnectModal onOpenChange={closeSui} open={isSuiOpen} />;
};

const SuietKit: FC<IProps> = (props) => {
  return (
    <WrapperComponent>
      <SuietKitLogic {...props} />
    </WrapperComponent>
  );
};

export default SuietKit;
