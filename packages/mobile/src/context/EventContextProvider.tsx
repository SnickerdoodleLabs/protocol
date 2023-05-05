import {
  DataWalletAddress,
  EDynamicRewardParameterType,
  IDynamicRewardParameter,
  LinkedAccount,
  SDQLQueryRequest,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import React, { useContext, useEffect, useState } from "react";

import { useAppContext } from "./AppContextProvider";
import { useLayoutContext } from "./LayoutContext";

export interface IEventCtx {}

export const EventCtx = React.createContext<IEventCtx>({} as IEventCtx);

const EventContextProvider = ({ children }) => {
  const { mobileCore, setUnlockState, updateLinkedAccounts } = useAppContext();
  const [appLevelNotifications, setAppLevelNotifications] = useState();
  const [infoLevelNotification, setInfoLevelNotification] = useState();
  const { cancelLoading } = useLayoutContext();
  useEffect(() => {
    mobileCore.getEvents().map((events) => {
      events.onInitialized.subscribe(onInitialized);
      events.onAccountAdded.subscribe(onAccountAdded);
      events.onQueryPosted.subscribe(onQueryPosted);
    });
  }, []);

  const onInitialized = (address: DataWalletAddress) => {
    console.error("INITIALIZED", address);
    setUnlockState(true);
    updateLinkedAccounts();
    cancelLoading();
  };
  const onAccountAdded = (account: LinkedAccount) => {
    updateLinkedAccounts();
    cancelLoading();
  };

  const onQueryPosted = (request: SDQLQueryRequest) => {
    console.log(
      `Extension: query posted with contract address: ${request.consentContractAddress} and CID: ${request.query.cid}`,
    );
    console.debug(request.query.query);

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

    mobileCore.invitationService
      .getReceivingAddress(request.consentContractAddress)
      .map((accountAddress) => {
        request.rewardsPreview.forEach((eligibleReward) => {
          if (request.dataWalletAddress !== null) {
            parameters.push({
              recipientAddress: {
                type: EDynamicRewardParameterType.Address,
                value: accountAddress,
              },
              CompensationKey: {
                type: EDynamicRewardParameterType.CompensationKey,
                value: eligibleReward.compensationKey,
              },
            } as IDynamicRewardParameter);
          }
        });

        mobileCore
          .getCore()
          .approveQuery(
            request.consentContractAddress,
            {
              cid: request.query.cid,
              query: getStringQuery(),
            },
            parameters,
          )
          .map(() => {
            console.log(
              `Processing Query! Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`,
            );
          })
          .mapErr((e) => {
            console.error(
              `Error while processing query! Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`,
            );
            console.error(e);
          });
      });
  };

  return <EventCtx.Provider value={{}}>{children}</EventCtx.Provider>;
};

export default EventContextProvider;

export const useEventContext = () => useContext(EventCtx);
