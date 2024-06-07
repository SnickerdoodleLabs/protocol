import { EChain } from "@snickerdoodlelabs/objects";
import {
  ISingleVirtualQuestionnaireItem,
  getDataTypeProperties,
} from "@snickerdoodlelabs/shared-components";
import React, { useCallback, useMemo } from "react";

import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { IOfferItemCommonProps } from "@extension-onboarding/components/v2/OfferItems/OfferItemCommon.interface";
import Renderer from "@extension-onboarding/components/v2/OfferItems/Renderer";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";

interface SingleVirtualOfferProps extends IOfferItemCommonProps {
  offer: ISingleVirtualQuestionnaireItem;
}

export const SingleVirtualQuestionnaireOfferItem: React.FC<
  SingleVirtualOfferProps
> = ({
  offer: { queryStatus, dataType },
  onProcceed,
  brandImage,
  ...props
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
      onPrimaryButtonClick: () => {
        onProcceed(queryStatus.queryCID);
      },
      customProps: { offer: queryStatus, brandImage },
    });
  }, [linkedAccounts, brandImage]);

  return (
    <Renderer
      brandImage={brandImage || ""}
      points={queryStatus.points}
      name={dataTypeProperties?.name ?? queryStatus.name}
      icon={dataTypeProperties?.icon ?? brandImage ?? ""}
      description={queryStatus?.description}
      onClick={onClick}
      {...props}
    />
  );
};
