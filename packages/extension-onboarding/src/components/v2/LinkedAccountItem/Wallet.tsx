import LinkedAccountItem from "@extension-onboarding/components/v2/LinkedAccountItem/LinkedAccountItem";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { LinkedAccount } from "@snickerdoodlelabs/objects";
import {
  SDTypography,
  abbreviateString,
  getChainImageSrc,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

interface IWalletProps {
  account: LinkedAccount;
}

export const Wallet: FC<IWalletProps> = ({ account }) => {
  const { sdlDataWallet } = useDataWalletContext();
  const getResponsiveValue = useResponsiveValue();
  const handleDisconnect = () => {
    sdlDataWallet.account.unlinkAccount(
      account.sourceAccountAddress,
      account.sourceChain,
    );
  };
  return (
    <LinkedAccountItem
      render={
        <>
          <img
            src={getChainImageSrc(account.sourceChain)}
            width={40}
            height={40}
          />
          <SDTypography variant="bodyLg" fontWeight="bold">
            {abbreviateString(
              account.sourceAccountAddress,
              getResponsiveValue({ xs: 9, sm: 21 }),
              getResponsiveValue({ xs: 3, sm: 21 }),
            )}
          </SDTypography>
        </>
      }
      onClick={handleDisconnect}
    />
  );
};
