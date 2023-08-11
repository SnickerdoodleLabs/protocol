import "reflect-metadata";
import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EChain,
  EVMAccountAddress,
  LanguageCode,
  Signature,
  SiteVisit,
  URLString,
  UnixTimestamp,
  SDQLString,
  IDynamicRewardParameter,
  SDQLQueryRequest,
  ISnickerdoodleCore,
  PersistenceError,
  ESolidityAbiParameterType,
  AjaxError,
  ConsentError,
  EvaluationError,
  IPFSError,
  QueryFormatError,
  UnauthorizedError,
  UninitializedError,
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
    const timeUtils = this.iocContainer.get<ITimeUtils>(ITimeUtilsType);
    const configProvider =
      this.iocContainer.get<IConfigProvider>(IConfigProviderType);
    const logUtils = this.iocContainer.get<ILogUtils>(ILogUtilsType);

    logUtils.log("Initializing Iframe Form Factor");

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
            logUtils.log(
              "Unlocking Snickerdoodle Core using stored unlock values",
            );
            // If we have a stored signature, we can automatically unlock the
            return core.account
              .unlock(accountAddress, signature, languageCode, chain)
              .map(() => {
                logUtils.log(
                  "Snickerdoodle Core unlocked using stored unlock values",
                );
              });
          }
          // If there's no stored signature, we have to wait for unlock to be called
          return okAsync(undefined);
        });
      })
      .andThen(() => {
        return coreProvider.getCore();
      })
      .andThen((core) => {
        // We want to record the sourceDomain as a site visit
        const now = timeUtils.getUnixNow();
        const config = configProvider.getConfig();
        return core
          .addSiteVisits([
            new SiteVisit(
              URLString(config.sourceDomain), // We can't get the full URL, but the domain will suffice
              now, // Visit started now
              UnixTimestamp(now + 10), // We're not going to wait, so just record the visit as for 10 seconds
            ),
          ])
          .andThen(() => {
            return core.getEvents();
          })
          .map((events) => {
            events.onQueryPosted.subscribe((request) => {
              this.respondToQuery(request, core, logUtils);
            });
          });
      })
      .map(() => {
        logUtils.log("Snickerdoodle Core CoreListener initialized");
      });
  }

  protected respondToQuery(
    request: SDQLQueryRequest,
    core: ISnickerdoodleCore,
    logUtils: ILogUtils,
  ): ResultAsync<
    void,
    | PersistenceError
    | AjaxError
    | UninitializedError
    | UnauthorizedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | EvaluationError
  > {
    logUtils.log(
      `IFrame: query posted with contract address: ${request.consentContractAddress} and CID: ${request.query.cid}`,
    );
    logUtils.debug(request.query.query);

    // @TODO - remove once ipfs issue is resolved
    const getStringQuery = () => {
      const queryObjOrStr = request.query.query;
      let queryString: SDQLString;
      if (typeof queryObjOrStr === "object") {
        queryString = JSON.stringify(queryObjOrStr) as SDQLString;
      } else {
        queryString = queryObjOrStr;
      }
      return queryString;
    };

    // DynamicRewardParameters added to be returned
    const parameters: IDynamicRewardParameter[] = [];
    // request.accounts.filter((acc.sourceAccountAddress == request.dataWalletAddress) ==> (acc))

    return core
      .getReceivingAddress(request.consentContractAddress)
      .andThen((accountAddress) => {
        request.rewardsPreview.forEach((eligibleReward) => {
          if (request.dataWalletAddress !== null) {
            parameters.push({
              recipientAddress: {
                type: ESolidityAbiParameterType.address,
                value: accountAddress,
              },
              compensationKey: {
                type: ESolidityAbiParameterType.string,
                value: eligibleReward.compensationKey,
              },
            } as IDynamicRewardParameter);
          }
        });

        return core.approveQuery(
          request.consentContractAddress,
          {
            cid: request.query.cid,
            query: getStringQuery(),
          },
          parameters,
        );
      })
      .map(() => {
        logUtils.log(
          `Processing Query! Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`,
        );
      })
      .mapErr((e) => {
        logUtils.error(
          `Error while processing query! Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`,
        );
        logUtils.error(e);
        return e;
      });
  }
}
