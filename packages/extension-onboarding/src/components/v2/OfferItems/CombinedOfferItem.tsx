import { EChain } from "@snickerdoodlelabs/objects";
import { IMultiQuestionItem } from "@snickerdoodlelabs/shared-components";
import React, { useCallback } from "react";

import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { IOfferItemCommonProps } from "@extension-onboarding/components/v2/OfferItems/OfferItemCommon.interface";
import Renderer from "@extension-onboarding/components/v2/OfferItems/Renderer";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";

interface IOfferItemProps extends IOfferItemCommonProps {
  offer: IMultiQuestionItem;
}

export const CombinedOfferItem: React.FC<IOfferItemProps> = ({
  offer,
  onProcceed,
  brandImage,
  ...props
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
      onPrimaryButtonClick: () => onProcceed(offer.queryStatus.queryCID),
      customProps: { offer: offer.queryStatus, brandImage },
    });
  }, [linkedAccounts, brandImage]);

  return (
    <Renderer
      {...props}
      brandImage={brandImage || ""}
      points={offer.queryStatus.points}
      name={offer.queryStatus.name}
      icon={offer.queryStatus.image ?? brandImage ?? ""}
      description={offer.queryStatus.description || "_"}
      onClick={onClick}
    />
  );
};
