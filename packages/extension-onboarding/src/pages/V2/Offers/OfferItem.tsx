import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box } from "@material-ui/core";
import { CallMade } from "@material-ui/icons";
import { EChain, QueryStatus } from "@snickerdoodlelabs/objects";
import {
  useResponsiveValue,
  Image,
  SDTypography,
  colors,
  SDButton,
} from "@snickerdoodlelabs/shared-components";
import React, { useCallback } from "react";

interface IOfferItemProps {
  offer: QueryStatus;
  reCalculateOffers: () => void;
  brandImage?: string;
}

const OfferItem: React.FC<IOfferItemProps> = ({
  offer,
  reCalculateOffers,
  brandImage,
}) => {
  const getResponsiveValue = useResponsiveValue();
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
      customProps: { offer, brandImage },
    });
  }, [linkedAccounts, brandImage]);

  return (
    <Box
      mt={1.5}
      bgcolor={colors.WHITE}
      alignItems="center"
      border="1px solid"
      borderColor="borderColor"
      borderRadius={8}
      overflow="hidden"
      display="flex"
    >
      <Image
        src={offer.image ?? brandImage ?? ""}
        width={getResponsiveValue({ xs: 96, sm: 128 })}
        height={getResponsiveValue({ xs: 96, sm: 128 })}
      />
      <Box
        flex={1}
        ml={3}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box
          pr={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <SDTypography
            variant="titleMd"
            fontWeight="bold"
            hexColor={colors.DARKPURPLE500}
          >
            {offer.name}
          </SDTypography>
          <SDButton onClick={onClick} variant="outlined" endIcon={<CallMade />}>
            Start
          </SDButton>
        </Box>
        <SDTypography
          mt={1.5}
          variant="bodyMd"
          fontWeight="medium"
          hexColor={colors.GREY600}
        >
          {offer.description ? offer.description : "_"}
        </SDTypography>
      </Box>
    </Box>
  );
};

export default OfferItem;
