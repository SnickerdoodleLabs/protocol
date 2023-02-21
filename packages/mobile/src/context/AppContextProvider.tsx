import * as React from "react";
import { MobileCore } from "../services/implementations/Gateway";

export interface IAppCtx {
  coreContext?: MobileCore;
}

export const AppCtx = React.createContext<IAppCtx>({});

const AppContextProvider = ({ children }: any) => {
  const [coreContext, setCoreContext] = React.useState<MobileCore>(
    new MobileCore(),
  );

  /*   const initConnection = async () => {
    try {
      const sign =
        "0x91aa05467f4fa179ada6a8f537503a649f7ef2e1c0b63178b251b0afb37bbc5138c2df394c50f435721e991e17e44b33fb4c8ac5736bb4f2d58411b6a77998401b";
      const acc = "0xbaa1b174fadca4a99cbea171048edef468c5508b";
      coreContext.unlock(
        acc as AccountAddress,
        sign as Signature,
        "en" as LanguageCode,
        EChain.EthereumMainnet,
      );
      console.log("Unlock Completed!");
    } catch (err) {
      console.log({ err });
    }
  };
  const getAccounts = async () => {
    try {
      return coreContext.getAccounts();
    } catch (err) {
      console.log({ err });
    }
  };

  const getAccountBalances = async () => {
    try {
      return coreContext.getAccountBalances();
    } catch (err) {
      console.log({ err });
    }
  };

  const getAccountNFTs = async () => {
    try {
      return coreContext.getAccountNFTs();
    } catch (err) {
      console.log({ err });
    }
  };
  const isDataWalletAddressInitialized = async () => {
    try {
      return coreContext.isDataWalletAddressInitialized();
    } catch (err) {
      console.log({ err });
    }
  };
  const checkInvitationStatus = async (
    consentAddress: EVMContractAddress,
    signature?: Signature,
    tokenId?: BigNumberString,
  ) => {
    try {
      return coreContext.checkInvitationStatus(
        consentAddress,
        signature,
        tokenId,
      );
    } catch (err) {
      console.log({ err });
    }
  };

  const getConsentContractCID = (consentAddress: EVMContractAddress) => {
    return coreContext.getConsentContractCID(consentAddress);
  };
  const getInvitationMetadataByCID = (ipfsCID: IpfsCID) => {
    return coreContext.getInvitationMetadataByCID(ipfsCID);
  };
  const getUnlockMessage = (): ResultAsync<
    string,
    UnsupportedLanguageError
  > => {
    return coreContext.getUnlockMessage();
  };
  const acceptInvitation = (
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
  ) => {
    return coreContext.acceptInvitation(invitation, dataPermissions);
  }; */

  return (
    <AppCtx.Provider
      value={{
        coreContext,
        /* initConnection,
        getAccounts,
        getAccountBalances,
        getAccountNFTs,
        isDataWalletAddressInitialized,
        checkInvitationStatus,
        getConsentContractCID,
        getInvitationMetadataByCID,
        getUnlockMessage,
        acceptInvitation, */
      }}
    >
      {children}
    </AppCtx.Provider>
  );
};

export default AppContextProvider;
