import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { EVMContractAddress, IUserAgreement } from "@snickerdoodlelabs/objects";
import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface RequestedItem {
  contractAddress: EVMContractAddress;
  userAgreement: IUserAgreement;
}
interface IOffersModalTriggerContext {
  requestOptIn: (item: RequestedItem) => void;
}

const OffersModalTriggerContext = createContext<IOffersModalTriggerContext>(
  {} as IOffersModalTriggerContext,
);

export const ThemeContextProvider: FC = ({ children }) => {
  const [requestedItem, setRequestedItem] = useState<RequestedItem>();
  const { sdlDataWallet } = useDataWalletContext();
  const { optedInContracts } = useAppContext();

  const requestOptIn = useCallback(
    (item: RequestedItem) => {
      if (
        optedInContracts.has(item.contractAddress) ||
        requestedItem?.contractAddress == item.contractAddress
      ) {
        return;
      }
      setRequestedItem(item);
      sdlDataWallet.requestOptIn(item.contractAddress);
    },
    [optedInContracts, requestedItem, sdlDataWallet],
  );

  useEffect(() => {
    if (!requestedItem) return;
    const triggerModalNeeded = optedInContracts.has(
      requestedItem.contractAddress,
    );
    if (triggerModalNeeded) {
      const requestedItemCopy = { ...requestedItem };
      triggerModal(requestedItemCopy);
      setRequestedItem(undefined);
    }
  }, [requestedItem, optedInContracts.size]);

  const triggerModal = (item: RequestedItem) => {};

  return (
    <OffersModalTriggerContext.Provider value={{ requestOptIn }}>
      {children}
    </OffersModalTriggerContext.Provider>
  );
};

export const useOffersModalTriggerContext = () =>
  useContext(OffersModalTriggerContext);
