import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import OfferItem from "@extension-onboarding/pages/V2/Offers/OfferItem";
import { Box } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  IOldUserAgreement,
  IUserAgreement,
  IpfsCID,
  QueryStatus,
} from "@snickerdoodlelabs/objects";
import {
  useSafeState,
  SDTypography,
  Image,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useMemo } from "react";

interface IBrandItemProps {
  ipfsCID: IpfsCID;
  offers: QueryStatus[];
  reCalculateOffers: () => void;
}

const BrandItem: FC<IBrandItemProps> = ({
  ipfsCID,
  offers,
  reCalculateOffers,
}) => {
  const { sdlDataWallet } = useDataWalletContext();
  const [agreementData, setAgreementData] = useSafeState<
    IOldUserAgreement | IUserAgreement
  >();
  const getAgreementData = () => {
    return sdlDataWallet.getInvitationMetadataByCID(ipfsCID).map((data) => {
      setAgreementData(data);
    });
  };

  useEffect(() => {
    getAgreementData();
  }, []);

  const { name, icon, imageUrl } = useMemo(() => {
    if (!agreementData) {
      return {
        name: (
          <SDTypography variant="titleSm" ml={1.75}>
            <Skeleton width={70} />
          </SDTypography>
        ),
        icon: <Skeleton variant="rect" width={40} height={40} />,
        imageUrl: undefined,
      };
    } else {
      const brandName =
        agreementData["brandInformation"]?.["name"] ?? "Unknown";
      const brandLogo =
        agreementData["brandInformation"]?.["image"] ??
        agreementData.image ??
        "";
      return {
        name: (
          <SDTypography
            fontWeight="bold"
            color="textBody"
            ml={1.75}
            variant="titleSm"
          >
            {brandName}
          </SDTypography>
        ),
        icon: (
          <Image
            src={brandLogo}
            style={{ borderRadius: 8 }}
            width={40}
            height={40}
          />
        ),
        imageUrl: brandLogo,
      };
    }
  }, [JSON.stringify(agreementData)]);

  return (
    <Box display="flex" flexDirection="column">
      <Box mb={3} display="flex" alignItems="center">
        {icon} {name}
      </Box>
      {offers.map((offer) => (
        <OfferItem
          key={offer.queryCID}
          brandImage={imageUrl}
          offer={offer}
          reCalculateOffers={() => {
            reCalculateOffers;
          }}
        />
      ))}
    </Box>
  );
};

export default BrandItem;
