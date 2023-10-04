import {
  DataWalletAddress,
  ESolidityAbiParameterType,
  IDynamicRewardParameter,
  LinkedAccount,
  SDQLQueryRequest,
  SDQLString,
  EarnedReward,
} from "@snickerdoodlelabs/objects";

import React, { useContext, useEffect } from "react";
import { useCoreContext } from "./CoreContext";

export interface IEventCtx {}

export const EventCtx = React.createContext<IEventCtx>({} as IEventCtx);

const EventContextProvider = ({ children }: any) => {
  const { snickerdoodleCore } = useCoreContext();
  useEffect(() => {
    snickerdoodleCore.getEvents().map((events) => {
      events.onInitialized.subscribe(onInitialized.bind(this));
      events.onAccountAdded.subscribe(onAccountAdded.bind(this));
      events.onAccountRemoved.subscribe(onAccountRemoved.bind(this));
      events.onQueryPosted.subscribe(onQueryPosted.bind(this));
      events.onCohortJoined.subscribe(onCohortJoined.bind(this));
      events.onEarnedRewardsAdded.subscribe(onEarnedRewardsAdded.bind(this));
    });
  }, []);

  const onInitialized = (dataWalletAddress: DataWalletAddress) => {
    console.warn(
      `Event: Initialized data wallet with address ${dataWalletAddress}`
    ); /*   setUnlockState(true);
      updateLinkedAccounts();
      cancelLoading(); */
  };

  const onAccountAdded = (account: LinkedAccount) => {
    console.warn(`Event: account ${account.sourceAccountAddress} added`);

    /*     updateLinkedAccounts();
      cancelLoading(); */
  };

  const onAccountRemoved = (account: LinkedAccount) => {
    console.warn(`Event: account ${account.sourceAccountAddress} removed`);

    /*     updateLinkedAccounts();
      cancelLoading(); */
  };

  const onQueryPosted = (request: SDQLQueryRequest) => {
    console.warn(
      `Event: query posted with contract address: ${request.consentContractAddress} and CID: ${request.query.cid}`
    );
    console.log("Event Request:", request.query.query);

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

    snickerdoodleCore
      .getReceivingAddress(request.consentContractAddress)
      .map((accountAddress) => {
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

        snickerdoodleCore
          .approveQuery(
            request.consentContractAddress,
            {
              cid: request.query.cid,
              query: getStringQuery(),
            },
            parameters
          )
          .map(() => {
            console.log(
              `Processing Query! Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`
            );
          })
          .mapErr((e) => {
            console.log(
              `Error while processing query! Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`
            );
            console.log(e);
          });
      });
  };
  const onCohortJoined = () => {
    console.warn("Event : onCohortJoined");
  };
  const onEarnedRewardsAdded = (rewards: EarnedReward[]) => {
    console.warn("Event : onEarnedRewardsAdded", rewards);
    /*     updateLinkedAccounts();
      cancelLoading(); */
  };

  return <EventCtx.Provider value={{}}>{children}</EventCtx.Provider>;
};

export default EventContextProvider;

export const useEventContext = () => useContext(EventCtx);
