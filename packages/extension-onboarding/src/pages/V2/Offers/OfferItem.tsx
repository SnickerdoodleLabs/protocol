import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import RenderOfferItem from "@extension-onboarding/pages/V2/Offers/RenderOfferItem";
import { EChain } from "@snickerdoodlelabs/objects";
import { IMultiQuestionItem } from "@snickerdoodlelabs/shared-components";
import React, { useCallback } from "react";

interface IOfferItemProps {
  offer: IMultiQuestionItem;
  reCalculateOffers: () => void;
  brandImage?: string;
}

const OfferItem: React.FC<IOfferItemProps> = ({
  offer,
  reCalculateOffers,
  brandImage,
}) => {
  const { setModal } = useLayoutContext();
  const { linkedAccounts, setLinkerModalOpen } = useAppContext();

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
      customProps: { offer: offer.queryStatus, brandImage },
    });
  }, [linkedAccounts, brandImage]);

  return (
    <RenderOfferItem
      brandImage={brandImage || ""}
      points={offer.queryStatus.points}
      name={offer.queryStatus.name}
      icon={offer.queryStatus.image ?? brandImage ?? ""}
      description={offer.queryStatus.description || "_"}
      onClick={onClick}
    />
  );
};

export default OfferItem;
