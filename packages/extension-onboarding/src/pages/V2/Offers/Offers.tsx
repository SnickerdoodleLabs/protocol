import Container from "@extension-onboarding/components/v2/Container";
import PageBanners from "@extension-onboarding/components/v2/PageBanners";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import BrandItem from "@extension-onboarding/pages/V2/Offers/BrandItem";
import { Box } from "@material-ui/core";
import {
  EQueryProcessingStatus,
  EVMContractAddress,
  IpfsCID,
  QueryStatus,
  SDQLQueryRequest,
} from "@snickerdoodlelabs/objects";
import { SDTypography, colors } from "@snickerdoodlelabs/shared-components";
import { ResultUtils } from "neverthrow-result-utils";
import React, { useCallback, useEffect, useMemo } from "react";
import { Subscription } from "rxjs";

interface OfferItem {
  contractAddress: EVMContractAddress;
  ipfsCID: IpfsCID;
  offers: QueryStatus[];
}

const Offers = () => {
  const { optedInContracts } = useAppContext();
  const { sdlDataWallet } = useDataWalletContext();
  const [items, setItems] = React.useState<OfferItem[]>();
  const queryPostedEventSubscription = React.useRef<Subscription>();

  useEffect(() => {
    queryPostedEventSubscription.current =
      sdlDataWallet.events.onQueryPosted.subscribe((q) => {
        console.log("Query posted", q);
        onQueryPosted(q);
      });
    return () => {
      queryPostedEventSubscription.current?.unsubscribe();
    };
  }, []);

  const onQueryPosted = useCallback(
    (queryStatus: SDQLQueryRequest) => {
      if (!!items) {
        reCalculateOffersForContract(queryStatus.consentContractAddress);
      }
    },
    [JSON.stringify(items)],
  );

  useEffect(() => {
    getInitialOffers();
  }, [optedInContracts?.size]);

  const getInitialOffers = () => {
    if (optedInContracts) {
      ResultUtils.combine(
        Array.from(optedInContracts.entries()).map(
          ([contractAddress, ipfsCID]) =>
            sdlDataWallet
              .getQueryStatuses(
                contractAddress,
                EQueryProcessingStatus.Received,
              )
              .map((offers) => ({ contractAddress, ipfsCID, offers })),
        ),
      ).map((results) => {
        setItems(results.filter((r) => r.offers.length > 0));
      });
    }
  };

  const reCalculateOffersForContract = useCallback(
    (contractAddress: EVMContractAddress) => {
      if (optedInContracts) {
        sdlDataWallet
          .getQueryStatuses(contractAddress, EQueryProcessingStatus.Received)
          .map((offers) => {
            setItems((prevItems) => {
              const newItems = prevItems!.filter(
                (i) => i.contractAddress !== contractAddress,
              );
              if (offers.length > 0) {
                newItems.push({
                  contractAddress,
                  ipfsCID: optedInContracts.get(contractAddress)!,
                  offers,
                });
              }
              return newItems;
            });
          });
      }
    },
    [optedInContracts, items],
  );

  const pageComponent = useMemo(() => {
    if (!items) {
      return null;
    }

    if (items.length > 0) {
      return (
        <>
          {items.map((item) => (
            <BrandItem
              key={item.contractAddress}
              ipfsCID={item.ipfsCID}
              offers={item.offers}
              reCalculateOffers={() => {
                reCalculateOffersForContract(item.contractAddress);
              }}
            />
          ))}
        </>
      );
    } else {
      return (
        <Box
          width="100%"
          display="flex"
          mt={8.5}
          flexDirection="column"
          alignItems="center"
        >
          <img
            width={34}
            height={34}
            src="https://storage.googleapis.com/dw-assets/spa/icons-v2/offers-icon.svg"
          />

          <SDTypography
            hexColor={colors.GREY600}
            mt={2}
            variant="bodyLg"
            align="center"
          >
            You currently have no offers
          </SDTypography>
        </Box>
      );
    }
  }, [items]);

  return (
    <>
      <PageBanners />
      <Container>
        <Box mt={{ xs: 3, sm: 7 }} />
        {pageComponent}
      </Container>
    </>
  );
};

export default Offers;
