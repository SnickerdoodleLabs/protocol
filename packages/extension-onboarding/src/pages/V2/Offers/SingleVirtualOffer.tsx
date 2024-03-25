import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import RenderOfferItem from "@extension-onboarding/pages/V2/Offers/RenderOfferItem";
import { EChain, QueryStatus } from "@snickerdoodlelabs/objects";
import {
  ISingleVirtualQuestionnaireItem,
  getDataTypeProperties,
} from "@snickerdoodlelabs/shared-components";
import React, { useCallback, useMemo } from "react";

interface SingleVirtualOfferProps {
  offer: ISingleVirtualQuestionnaireItem;
  reCalculateOffers: () => void;
  brandImage?: string;
}

const SingleVirtualOffer: React.FC<SingleVirtualOfferProps> = ({
  offer: { queryStatus, dataType },
  reCalculateOffers,
  brandImage,
}) => {
  const { setModal } = useLayoutContext();
  const { linkedAccounts, setLinkerModalOpen } = useAppContext();
  const dataTypeProperties = useMemo(
    () => getDataTypeProperties(dataType),
    [dataType],
  );
  const onClick = useCallback(() => {
    if (
      linkedAccounts.filter(
        (account) => account.sourceChain === EChain.EthereumMainnet,
      ).length === 0
    ) {
      setLinkerModalOpen();
      return;
    }
    setModal({
      modalSelector: EModalSelectors.OFFER_MODAL,
      onPrimaryButtonClick: reCalculateOffers,
      customProps: { offer: queryStatus, brandImage },
    });
  }, [linkedAccounts, brandImage]);

  return (
    <RenderOfferItem
      brandImage={brandImage || ""}
      points={queryStatus.points}
      name={dataTypeProperties?.name ?? queryStatus.name}
      icon={dataTypeProperties?.icon ?? brandImage ?? ""}
      description={queryStatus?.description}
      onClick={onClick}
    />
  );
};

export default SingleVirtualOffer;
