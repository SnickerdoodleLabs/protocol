import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import RenderOfferItem from "@extension-onboarding/pages/V2/Offers/RenderOfferItem";
import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import {
  EChain,
  EQuestionnaireStatus,
  EVMAccountAddress,
  IDynamicRewardParameter,
  NewQuestionnaireAnswer,
  Questionnaire,
  QuestionnaireWithAnswers,
} from "@snickerdoodlelabs/objects";
import {
  ISingleQuestionnaireItem,
  useSafeState,
} from "@snickerdoodlelabs/shared-components";
import { okAsync } from "neverthrow";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

interface ISingleQuestionnaireOfferProps {
  offer: ISingleQuestionnaireItem;
  reCalculateOffers: () => void;
  brandImage?: string;
}

const SingleQuestionnaireOffer: React.FC<ISingleQuestionnaireOfferProps> = ({
  offer,
  reCalculateOffers,
  brandImage,
}) => {
  const { setModal } = useLayoutContext();
  const { linkedAccounts, setLinkerModalOpen } = useAppContext();
  const { sdlDataWallet } = useDataWalletContext();
  const [questionnaireData, setQuestionnaireData] = useSafeState<
    Questionnaire | QuestionnaireWithAnswers
  >();

  useEffect(() => {
    getQuestionnaireData();
  }, []);

  const getQuestionnaireData = useCallback(() => {
    sdlDataWallet.questionnaire
      .getByCIDs([offer.questionnaireCID])
      .map((data) => {
        if (data.length > 0) {
          setQuestionnaireData(data[0]);
        }
      });
  }, []);

  const handleQuestionnaireAnswer = (
    answers: NewQuestionnaireAnswer[],
    receivingAddress: EVMAccountAddress,
  ) => {
    sdlDataWallet.questionnaire
      .answerQuestionnaire(offer.questionnaireCID, answers)
      .andThen(() => {
        return okAsync(undefined);
      })
      .andThen(() => {
        const calculatedRewardParameters: IDynamicRewardParameter[] = [];

        const rewardsParameters = ObjectUtils.deserialize<
          IDynamicRewardParameter[]
        >(offer.queryStatus.rewardsParameters);

        rewardsParameters.forEach((rp) => {
          calculatedRewardParameters.push({
            ...rp,
            recipientAddress: {
              ...rp.recipientAddress,
              value: receivingAddress,
            },
          });
        });
        return sdlDataWallet
          .approveQuery(offer.queryStatus.queryCID, calculatedRewardParameters)
          .map(() => {
            reCalculateOffers();
          });
      });
  };

  const onClick = () => {
    if (
      linkedAccounts.filter(
        (account) => account.sourceChain === EChain.EthereumMainnet,
      ).length === 0
    ) {
      setLinkerModalOpen();
      return;
    }
    if (!questionnaireData) return;
    setModal(
      questionnaireData.status === EQuestionnaireStatus.Complete
        ? {
            modalSelector: EModalSelectors.OFFER_MODAL,
            onPrimaryButtonClick: reCalculateOffers,
            customProps: { offer: offer.queryStatus, brandImage },
          }
        : {
            modalSelector: EModalSelectors.SHARE_QUESTIONNAIRE_MODAL,
            onPrimaryButtonClick: () => {},
            customProps: {
              questionnaire: questionnaireData,
              maxWidth: 960,
              onSubmitClicked: handleQuestionnaireAnswer,
            },
          },
    );
  };

  return (
    <RenderOfferItem
      brandImage={brandImage || ""}
      points={offer.queryStatus.points}
      name={questionnaireData?.title ?? offer.queryStatus.name}
      icon={questionnaireData?.image ?? brandImage ?? ""}
      description={
        questionnaireData?.description || offer.queryStatus.description || "_"
      }
      onClick={onClick}
    />
  );
};

export default SingleQuestionnaireOffer;
