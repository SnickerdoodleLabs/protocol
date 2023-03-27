import {
  AccountAddress,
  EChain,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import LottieView from "lottie-react-native";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Image, View, Dimensions } from "react-native";

import LoadingLottie from "../../assets/lotties/loading.json";
import { useAppContext } from "../../context/AppContextProvider";

import { styles } from "./Initial.styles";

// Make all neccassary checks here

interface IUnlockParams {
  accountAddress: AccountAddress;
  signature: Signature;
  chain: EChain;
  languageCode: LanguageCode;
}

enum EUnlockState {
  "IDLE",
  "NO_ACCOUNT",
  "COMPLETED",
}

const Initial = ({ navigation }) => {
  const { mobileCore, isUnlocked } = useAppContext();
  const [unlockCompleted, setUnlockCompleted] = useState<EUnlockState>(
    EUnlockState.IDLE,
  );
  const allChecksCompleted: boolean = useMemo(() => {
    return (
      (unlockCompleted === EUnlockState.COMPLETED && isUnlocked) ||
      unlockCompleted === EUnlockState.NO_ACCOUNT
    );
  }, [unlockCompleted, isUnlocked]);

  useEffect(() => {
    tryUnlock();
  }, []);

  useEffect(() => {
    if (allChecksCompleted) {
      navigation.replace(isUnlocked ? "Wallet" : "Starter_Tour");
    }
  }, [allChecksCompleted, isUnlocked]);

  const tryUnlock = (): ResultAsync<void, Error> => {
    const accountService = mobileCore.accountService;
    const accountStorageUtils = mobileCore.getAccountStorageUtils();
    return ResultUtils.combine([
      accountStorageUtils.readAccountInfoStorage(),
      accountStorageUtils.readDataWalletAddressFromstorage(),
    ])
      .andThen(([unlockParamsArr, dataWalletAddressOnCookie]) => {
        console.log(
          `Data wallet address on storage ${dataWalletAddressOnCookie}`,
        );
        if (unlockParamsArr?.length) {
          const { accountAddress, signature, languageCode, chain } =
            unlockParamsArr[0];
          return accountService
            .getDataWalletForAccount(
              accountAddress,
              signature,
              languageCode,
              chain ?? EChain.EthereumMainnet,
            )
            .andThen((dataWalletAddress) => {
              console.log(
                `Decrypted data wallet address for account ${accountAddress} ${dataWalletAddress}`,
              );
              if (
                !dataWalletAddress ||
                (dataWalletAddressOnCookie &&
                  dataWalletAddressOnCookie != dataWalletAddress)
              ) {
                console.log(
                  `Datawallet was not able to be unlocked with account address ${accountAddress}`,
                );
                return accountStorageUtils
                  .removeAccountInfoStorage(accountAddress)
                  .map(() => {
                    console.log(`Account ${accountAddress} removed`);
                    tryUnlock();
                  }).mapErr((e)=>{
                    return 'Try Unlock Error'
                  })
              }
              return accountService
                .unlock(
                  accountAddress,
                  signature,
                  chain ?? EChain.EthereumMainnet,
                  languageCode,
                  true,
                )
                .map(() => {
                  console.error("WAITING EVENT");
                  setUnlockCompleted(EUnlockState.COMPLETED);
                });
            });
        } else {
          if (dataWalletAddressOnCookie) {
            console.log(
              `No account info found on cookie for auto unlock ${dataWalletAddressOnCookie} is removing`,
            );
            return accountStorageUtils
              .removeDataWalletAddressFromstorage()
              .map(() => {
                return setUnlockCompleted(EUnlockState.NO_ACCOUNT);
              });
          }
          return okAsync(setUnlockCompleted(EUnlockState.NO_ACCOUNT));
        }
      })
      .orElse((e) => {
        return okAsync(setUnlockCompleted(EUnlockState.NO_ACCOUNT));
      });
  };

  return (
    <View
      style={[
        {
          alignItems: "center",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
        },
      ]}
    >
      <Image
        resizeMode={"cover"}
        source={require("../../assets/images/sd-horizontal.png")}
        style={{
          width: Dimensions.get("window").width * 0.8,
          marginTop: Dimensions.get("window").height * 0.3,
        }}
      />

      <LottieView source={LoadingLottie} autoPlay loop />
    </View>
  );
};

export default Initial;
