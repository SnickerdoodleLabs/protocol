import {
  DataWalletAddress,
  IDynamicRewardParameter,
  LinkedAccount,
  RecipientAddressType,
  SDQLQueryRequest,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import React, { useContext, useEffect, useState } from "react";

import { useAppContext } from "./AppContextProvider";
import { useLayoutContext } from "./LayoutContext";

export interface IEventCtx {}

export const EventCtx = React.createContext<IEventCtx>({} as IEventCtx);

const EventContextProvider = ({ children }) => {
  const { coreContext, setUnlockState, updateLinkedAccounts } = useAppContext();
  const [appLevelNotifications, setAppLevelNotifications] = useState();
  const [infoLevelNotification, setInfoLevelNotification] = useState();
  const { cancelLoading } = useLayoutContext();
  useEffect(() => {
    coreContext.getEvents().map((events) => {
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
    request.rewardsPreview.forEach((element) => {
      if (request.dataWalletAddress !== null) {
        parameters.push({
          recipientAddress: {
            type: "address",
            value: RecipientAddressType(
              request.accounts[0].sourceAccountAddress,
            ),
          },
        } as IDynamicRewardParameter);
      }
    });

    coreContext
      .getCore()
      .processQuery(
        request.consentContractAddress,
        {
          cid: request.query.cid,
          query: getStringQuery(),
        },
        parameters as IDynamicRewardParameter[],
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
  };

  return <EventCtx.Provider value={{}}>{children}</EventCtx.Provider>;
};

export default EventContextProvider;

export const useEventContext = () => useContext(EventCtx);
