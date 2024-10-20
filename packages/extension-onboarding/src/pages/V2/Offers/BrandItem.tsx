import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import OfferItem from "@extension-onboarding/pages/V2/Offers/OfferItem";
import SingleQuestionnaireOffer from "@extension-onboarding/pages/V2/Offers/SingleQuestionnaireOffer";
import SingleVirtualOffer from "@extension-onboarding/pages/V2/Offers/SingleVirtualOffer";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
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
  QueryQuestionType,
  ISingleQuestionnaireItem,
  IMultiQuestionItem,
} from "@snickerdoodlelabs/shared-components";
import {
  ISingleVirtualQuestionnaireItem,
  getQueryStatusItemsForRender,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useMemo } from "react";

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
  const [agreementData, setAgreementData] = useSafeState<
    IOldUserAgreement | IUserAgreement
  >();
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
    const items = getQueryStatusItemsForRender(offers);
    return items.reduce(
      (acc, item) => {
        if (
          item.questionType === QueryQuestionType.SINGLE_VIRTUAL_QUESTIONNAIRE
        ) {
          acc.virtualQuestionnaireQueries.push(
            item as ISingleVirtualQuestionnaireItem,
          );
        } else if (
          item.questionType === QueryQuestionType.SINGLE_QUESTIONNAIRE
        ) {
          acc.questionnaireQueries.push(item as ISingleQuestionnaireItem);
        } else if (item.questionType === QueryQuestionType.MULTI_QUESTION) {
          acc.multiQuestionQueries.push(item);
        }
        return acc;
      },
      {
        virtualQuestionnaireQueries: [],
        questionnaireQueries: [],
        multiQuestionQueries: [],
      } as IQueryStatusesState,
    );
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
    <Box display="flex" flexDirection="column" mt={{ xs: 5, sm: 7 }}>
      <Box mb={1.5} display="flex" alignItems="center">
        {icon} {name}
      </Box>
      {multiQuestionQueries.map((offer) => (
        <OfferItem
          key={offer.queryStatus.queryCID}
          brandImage={imageUrl}
          offer={offer}
          reCalculateOffers={reCalculateOffers}
        />
      ))}
      {questionnaireQueries.map((offer) => (
        <SingleQuestionnaireOffer
          key={offer.queryStatus.queryCID}
          brandImage={imageUrl}
          offer={offer}
          reCalculateOffers={reCalculateOffers}
        />
      ))}
      {virtualQuestionnaireQueries.map((offer) => (
        <SingleVirtualOffer
          key={offer.queryStatus.queryCID}
          brandImage={imageUrl}
          offer={offer}
          reCalculateOffers={reCalculateOffers}
        />
      ))}
    </Box>
  );
};

export default BrandItem;
