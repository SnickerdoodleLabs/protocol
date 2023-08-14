import "reflect-metadata";
import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
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
import { Container } from "inversify";
import { ResultAsync } from "neverthrow";

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
    const timeUtils = this.iocContainer.get<ITimeUtils>(ITimeUtilsType);
    const configProvider =
      this.iocContainer.get<IConfigProvider>(IConfigProviderType);
    const logUtils = this.iocContainer.get<ILogUtils>(ILogUtilsType);

    logUtils.log("Initializing Iframe Form Factor");

    return coreListener
      .activateModel()
      .andThen(() => {
        return coreProvider.getCore();
      })
      .andThen((core) => {
        return core.getEvents().andThen((events) => {
          // Subscribe to onQueryPosted and approve all incoming queries
          events.onQueryPosted.subscribe((request) => {
            this.respondToQuery(request, core, logUtils);
          });

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
