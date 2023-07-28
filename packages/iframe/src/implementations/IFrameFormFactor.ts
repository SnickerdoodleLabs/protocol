import "reflect-metadata";
import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  EChain,
  EVMAccountAddress,
  ISnickerdoodleCore,
  LanguageCode,
  Signature,
  SiteVisit,
  URLString,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { Container } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { iframeModule } from "@core-iframe/IFrameModule";
import {
  ICoreListener,
  ICoreListenerType,
} from "@core-iframe/interfaces/api/index";
import {
  IBlockchainProviderRepository,
  IBlockchainProviderRepositoryType,
} from "@core-iframe/interfaces/data";
import {
  IConfigProvider,
  IConfigProviderType,
  ICoreProvider,
  ICoreProviderType,
} from "@core-iframe/interfaces/utilities/index";

export class IFrameFormFactor {
  protected iocContainer = new Container();

  public constructor() {
    // Elaborate syntax to demonstrate that we can use multiple modules
    this.iocContainer.load(...[iframeModule]);
  }

  public initialize(): ResultAsync<void, Error> {
    const coreListener =
      this.iocContainer.get<ICoreListener>(ICoreListenerType);
    const coreProvider =
      this.iocContainer.get<ICoreProvider>(ICoreProviderType);
    const storageUtils =
      this.iocContainer.get<IStorageUtils>(IStorageUtilsType);
    const walletProvider = this.iocContainer.get<IBlockchainProviderRepository>(
      IBlockchainProviderRepositoryType,
    );
    const timeUtils = this.iocContainer.get<ITimeUtils>(ITimeUtilsType);
    const configProvider =
      this.iocContainer.get<IConfigProvider>(IConfigProviderType);

    return coreListener
      .activateModel()
      .andThen(() => {
        // Check if we have a stored signature
        return ResultUtils.combine([
          coreProvider.getCore(),
          storageUtils.read<EVMAccountAddress>("storedAccountAddress"),
          storageUtils.read<Signature>("storedSignature"),
          storageUtils.read<EChain>("storedChain"),
          storageUtils.read<LanguageCode>("storedLanguageCode"),
        ]).andThen(([core, accountAddress, signature, chain, languageCode]) => {
          if (
            accountAddress != null &&
            chain != null &&
            signature != null &&
            languageCode != null
          ) {
            console.log(
              "Unlocking Snickerdoodle Core using stored unlock values",
            );
            // If we have a stored signature, we can automatically unlock the
            return core.account.unlock(
              accountAddress,
              signature,
              languageCode,
              chain,
            );
          }
          // If there's no stored signature, we have to ask the user for the unlock signature
          return this.fullUnlock(core, walletProvider, storageUtils);
        });
      })
      .andThen(() => {
        return coreProvider.getCore();
      })
      .andThen((core) => {
        // We want to record the sourceDomain as a site visit
        const now = timeUtils.getUnixNow();
        const config = configProvider.getConfig();
        return core.addSiteVisits([
          new SiteVisit(
            URLString(config.sourceDomain), // We can't get the full URL, but the domain will suffice
            now, // Visit started now
            UnixTimestamp(now + 10), // We're not going to wait, so just record the visit as for 10 seconds
          ),
        ]);
      })
      .map(() => {
        console.log("Snickerdoodle Core CoreListener model activated");
      });
  }

  protected fullUnlock(
    core: ISnickerdoodleCore,
    walletProvider: IBlockchainProviderRepository,
    storageUtils: IStorageUtils,
  ): ResultAsync<void, Error> {
    return walletProvider
      .connect()
      .andThen((accountAddress) => {
        return core.account
          .getUnlockMessage(LanguageCode("en"))
          .andThen((unlockMessage) => {
            return walletProvider.getSignature(unlockMessage);
          })
          .andThen((signature) => {
            return core.account
              .unlock(
                accountAddress,
                signature,
                LanguageCode("en"),
                EChain.EthereumMainnet,
              )
              .andThen(() => {
                // Store the unlock values in local storage
                console.log("Storing unlock values in local storage");
                return ResultUtils.combine([
                  storageUtils.write("storedAccountAddress", accountAddress),
                  storageUtils.write("storedSignature", signature),
                  storageUtils.write("storedChain", EChain.EthereumMainnet),
                  storageUtils.write("storedLanguageCode", LanguageCode("en")),
                ]);
              });
          });
      })
      .map(() => {})
      .orElse((e) => {
        console.error("Error storing unlock values", e);
        return okAsync(undefined);
      });
  }
}
