import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import Card from "@extension-onboarding/pages/V2/Home/Card";
import { Box, Grid } from "@material-ui/core";
import CallMadeIcon from "@material-ui/icons/CallMade";
import {
  EQuestionnaireStatus,
  IpfsCID,
  NewQuestionnaireAnswer,
  PagedResponse,
  PagingRequest,
  Questionnaire,
} from "@snickerdoodlelabs/objects";
import {
  SDButton,
  SDTypography,
  Image,
  colors,
  useResponsiveValue,
  useSafeState,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const QuestionnairesCard = () => {
  const [questionnaires, setQuestionnaires] =
    useSafeState<PagedResponse<Questionnaire>>();
  const { sdlDataWallet } = useDataWalletContext();
  const { setModal } = useLayoutContext();
  const navigate = useNavigate();
  const getResponsiveValue = useResponsiveValue();

  const fetchQuestionnaires = () => {
    sdlDataWallet.questionnaire
      .getAllQuestionnaires(new PagingRequest(1, 4))
      .map((questionnaire) => {
        setQuestionnaires(questionnaire);
      });
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const questionnairesToDisplay = useMemo(() => {
    if (!questionnaires) {
      return null;
    }
    return questionnaires.response.filter(
      (q) => q.status === EQuestionnaireStatus.Available,
    );
  }, [questionnaires]);

  const onQuestionnarieSubmit = (
    answers: NewQuestionnaireAnswer[],
    id: IpfsCID,
  ) => {
    sdlDataWallet.questionnaire.answerQuestionnaire(id, answers).map((res) => {
      fetchQuestionnaires();
    });
  };

  return (
    <Card
      image="https://storage.googleapis.com/dw-assets/spa/icons-v2/cookie-vault-card.svg"
      title="Jumpstart the Profile"
      description="Share your social presence without divulging your full social account information."
      cardBgColor="#FFECCB"
      cardColor={colors.DARKPURPLE500}
      descriptionColor={colors.DARKPURPLE400}
      renderAction={
        <SDButton
          variant="outlined"
          color="inherit"
          endIcon={<CallMadeIcon />}
          onClick={() => {
            navigate(EPathsV2.COOKIE_VAULT);
          }}
        >
          Go to Cookie Vault
        </SDButton>
      }
      renderBottom={
        (questionnairesToDisplay?.length ?? 0) > 0 && (
          <Box display="flex" mt={{ xs: 2, sm: 4 }}>
            <Grid container spacing={2}>
              {questionnairesToDisplay?.map((q) => (
                <Grid item key={q.id} xs={12} sm={6} md={3}>
                  <Box
                    height={"100%"}
                    bgcolor="#FFDEA5"
                    borderRadius={8}
                    display="flex"
                    alignItems={{ xs: "center", sm: "flex-start" }}
                    p={{ xs: 2, sm: 4 }}
                    flexDirection="column"
                  >
                    <Image src={q.image || ""} width={50} height={50} />
                    <SDTypography
                      color="inherit"
                      mt={getResponsiveValue({ xs: 1, sm: 3 })}
                      mb={1}
                      variant={getResponsiveValue({
                        xs: "titleSm",
                        sm: "titleMd",
                      })}
                      fontWeight="bold"
                    >
                      {q.title}
                    </SDTypography>
                    <SDTypography
                      mb={getResponsiveValue({ xs: 2, sm: 5.5 })}
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        lineClamp: "2",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                      }}
                      variant={getResponsiveValue({
                        xs: "bodyMd",
                        sm: "bodyLg",
                      })}
                      hexColor="#8C764F"
                    >
                      {q.description}
                    </SDTypography>
                    <Box mt="auto">
                      <SDButton
                        onClick={() => {
                          const hasAnswers =
                            q.status === EQuestionnaireStatus.Complete;
                          setModal({
                            modalSelector: hasAnswers
                              ? EModalSelectors.ANSWERED_QUESTIONNAIRE_MODAL
                              : EModalSelectors.QUESTIONNAIRE_MODAL,
                            onPrimaryButtonClick: () => {},
                            customProps: {
                              questionnaire: q,
                              onSubmitClicked: (
                                answers: NewQuestionnaireAnswer[],
                              ) => {
                                onQuestionnarieSubmit(answers, q.id);
                              },
                            },
                          });
                        }}
                        variant="outlined"
                        color="inherit"
                      >
                        Fill Out
                      </SDButton>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )
      }
    />
  );
};

export default QuestionnairesCard;
