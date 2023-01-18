import {SnickerdoodleCore} from '@snickerdoodlelabs/core';
import {
  AccountAddress,
  BigNumberString,
  DataPermissions,
  EChain,
  EVMContractAddress,
  Invitation,
  IpfsCID,
  ISnickerdoodleCore,
  LanguageCode,
  Signature,
  UnsupportedLanguageError,
} from '@snickerdoodlelabs/objects';
import {ResultAsync} from 'neverthrow';
import * as React from 'react';
import {MobileCore} from '../mobileCore/MobileCore';

export const AppCtx = React.createContext<any | null>(null);

const AppContextProvider = ({children}: any) => {
  const [mobileCore, setMobileCore] = React.useState<MobileCore>(
    new MobileCore(),
  );

  const initConnection = async () => {
    try {
      const sign =
        '0x91aa05467f4fa179ada6a8f537503a649f7ef2e1c0b63178b251b0afb37bbc5138c2df394c50f435721e991e17e44b33fb4c8ac5736bb4f2d58411b6a77998401b';
      const acc = '0xbaa1b174fadca4a99cbea171048edef468c5508b';
      mobileCore.unlock(
        acc as AccountAddress,
        sign as Signature,
        'en' as LanguageCode,
        EChain.EthereumMainnet,
      );
      console.log('Unlock Completed!');
    } catch (err) {
      console.log({err});
    }
  };
  const getAccounts = async () => {
    try {
      return mobileCore.getAccounts();
    } catch (err) {
      console.log({err});
    }
  };

  const getAccountBalances = async () => {
    try {
      return mobileCore.getAccountBalances();
    } catch (err) {
      console.log({err});
    }
  };

  const getAccountNFTs = async () => {
    try {
      return mobileCore.getAccountNFTs();
    } catch (err) {
      console.log({err});
    }
  };
  const isDataWalletAddressInitialized = async () => {
    try {
      return mobileCore.isDataWalletAddressInitialized();
    } catch (err) {
      console.log({err});
    }
  };
  const checkInvitationStatus = async (
    consentAddress: EVMContractAddress,
    signature?: Signature,
    tokenId?: BigNumberString,
  ) => {
    try {
      return mobileCore.checkInvitationStatus(
        consentAddress,
        signature,
        tokenId,
      );
    } catch (err) {
      console.log({err});
    }
  };

  const getConsentContractCID = (consentAddress: EVMContractAddress) => {
    return mobileCore.getConsentContractCID(consentAddress);
  };
  const getInvitationMetadataByCID = (ipfsCID: IpfsCID) => {
    return mobileCore.getInvitationMetadataByCID(ipfsCID);
  };
  const getUnlockMessage = (): ResultAsync<
    string,
    UnsupportedLanguageError
  > => {
    return mobileCore.getUnlockMessage();
  };
  const acceptInvitation = (
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
  ) => {
    return mobileCore.acceptInvitation(invitation, dataPermissions);
  };

  return (
    <AppCtx.Provider
      value={{
        mobileCore,
        initConnection,
        getAccounts,
        getAccountBalances,
        getAccountNFTs,
        isDataWalletAddressInitialized,
        checkInvitationStatus,
        getConsentContractCID,
        getInvitationMetadataByCID,
        getUnlockMessage,
        acceptInvitation
      }}>
      {children}
    </AppCtx.Provider>
  );
};

export default AppContextProvider;
