import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  IUserAgreement,
  IpfsCID,
  QueryStatus,
} from "@snickerdoodlelabs/objects";
import {
  useSafeState,
  SDTypography,
  Image,
  ISingleQuestionnaireItem,
  IMultiQuestionItem,
  ISingleVirtualQuestionnaireItem,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useMemo } from "react";

import {
  CombinedOfferItem,
  SingleQuestionnaireOfferItem,
  SingleVirtualQuestionnaireOfferItem,
} from "@extension-onboarding/components/v2/OfferItems";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { calculateOffers } from "@extension-onboarding/utils/OfferUtils";

interface IBrandItemProps {
  ipfsCID: IpfsCID;
  offers: QueryStatus[];
  reCalculateOffers: () => void;
}

interface IQueryStatusesState {
  virtualQuestionnaireQueries: ISingleVirtualQuestionnaireItem[];
  questionnaireQueries: ISingleQuestionnaireItem[];
  multiQuestionQueries: IMultiQuestionItem[];
}

const BrandItem: FC<IBrandItemProps> = ({
  ipfsCID,
  offers,
  reCalculateOffers,
}) => {
  const { sdlDataWallet } = useDataWalletContext();
  const [agreementData, setAgreementData] = useSafeState<IUserAgreement>();
  const getAgreementData = () => {
    return sdlDataWallet.getInvitationMetadataByCID(ipfsCID).map((data) => {
      setAgreementData(data);
    });
  };

  const {
    virtualQuestionnaireQueries,
    questionnaireQueries,
    multiQuestionQueries,
  } = useMemo(() => {
    return calculateOffers(offers);
  }, [offers]);

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
        agreementData["brandInformation"]?.["logoImage"] ??
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
    <Box display="flex" flexDirection="column" mt={{ xs: 5, sm: 7 }}>
      <Box mb={1.5} display="flex" alignItems="center">
        {icon} {name}
      </Box>
      {multiQuestionQueries.map((offer) => (
        <CombinedOfferItem
          key={offer.queryStatus.queryCID}
          brandImage={imageUrl}
          offer={offer}
          onProcceed={reCalculateOffers}
        />
      ))}
      {questionnaireQueries.map((offer) => (
        <SingleQuestionnaireOfferItem
          key={offer.queryStatus.queryCID}
          brandImage={imageUrl}
          offer={offer}
          onProcceed={reCalculateOffers}
        />
      ))}
      {virtualQuestionnaireQueries.map((offer) => (
        <SingleVirtualQuestionnaireOfferItem
          key={offer.queryStatus.queryCID}
          brandImage={imageUrl}
          offer={offer}
          onProcceed={reCalculateOffers}
        />
      ))}
    </Box>
  );
};

export default BrandItem;
