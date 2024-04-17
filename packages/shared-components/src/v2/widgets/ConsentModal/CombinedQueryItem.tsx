import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  CloseButton,
  FooterPointItem,
  Image,
  SDButton,
  SDTypography,
} from "@shared-components/v2/components";
import { useSafeState } from "@shared-components/v2/hooks";
import { useDialogStyles } from "@shared-components/v2/styles";
import { colors } from "@shared-components/v2/theme";
import { Permissions } from "@shared-components/v2/widgets";
import { FillQuestionnaireModal } from "@shared-components/v2/widgets/FillQuestionnaireModal";
import {
  EQuestionnaireStatus,
  EWalletDataType,
  IpfsCID,
  NewQuestionnaireAnswer,
  QueryStatus,
  Questionnaire,
  QuestionnaireWithAnswers,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";

export interface ICombinedQueryProps {
  offer: QueryStatus;
  brandImage?: string;
  getQuestionnairesByCids: (
    cids: IpfsCID[],
  ) => ResultAsync<Questionnaire[], unknown>;
  onPrimaryButtonClick: (state: IPermissionsState) => void;
  answerQuestionnaire: (
    id: IpfsCID,
    answers: NewQuestionnaireAnswer[],
  ) => ResultAsync<void, unknown>;
  closeModal: () => void;
  defaultPermissions?: IPermissionsState;
}

interface IQuestionnairesState {
  answeredQuestionnaires: QuestionnaireWithAnswers[];
  unAnsweredQuestionnaires: Questionnaire[];
}

interface IPermissionsState {
  dataTypes: EWalletDataType[];
  questionnaires: IpfsCID[];
}

export const CombinedQuery: FC<ICombinedQueryProps> = ({
  offer,
  brandImage,
  answerQuestionnaire,
  getQuestionnairesByCids,
  onPrimaryButtonClick,
  closeModal,
  defaultPermissions,
}) => {
  const [questionnaireToAnswer, setQuestionnaireToAnswer] =
    useSafeState<Questionnaire>();

  const [questionnaires, setQuestionnaires] =
    useSafeState<IQuestionnairesState>();
  const [permissions, setPermissions] = useSafeState<IPermissionsState>();
  const permissionsRef = useRef<IPermissionsState>();
  const offerPermissions = useRef<(IpfsCID | EWalletDataType)[]>([
    ...offer.virtualQuestionnaires,
    ...offer.questionnaires,
  ]);

  const classes = useDialogStyles();
  useEffect(() => {
    if (permissions) {
      permissionsRef.current = permissions;
    }
  }, [JSON.stringify(permissions)]);

  useEffect(() => {
    getQuestionnaires();
  }, []);

  const onDataPermissionClick = useCallback((dataType: EWalletDataType) => {
    if (permissionsRef.current) {
      const newPermissions = {
        ...permissionsRef.current,
        dataTypes: permissionsRef.current.dataTypes.includes(dataType)
          ? permissionsRef.current.dataTypes.filter((dt) => dt !== dataType)
          : permissionsRef.current.dataTypes.concat(dataType),
      };
      setPermissions(newPermissions);
    }
  }, []);

  const onQuestionnairePermissionClick = useCallback(
    (questionnaireCID: IpfsCID) => {
      if (permissionsRef.current) {
        const newPermissions = {
          ...permissionsRef.current,
          questionnaires: permissionsRef.current.questionnaires.includes(
            questionnaireCID,
          )
            ? permissionsRef.current.questionnaires.filter(
                (cid) => cid !== questionnaireCID,
              )
            : permissionsRef.current.questionnaires.concat(questionnaireCID),
        };
        setPermissions(newPermissions);
      }
    },
    [],
  );
  const getQuestionnaires = () => {
    return getQuestionnairesByCids(offer.questionnaires).map((res) => {
      const answeredQuestionnaires = res.filter(
        (q) => q.status === EQuestionnaireStatus.Complete,
      ) as QuestionnaireWithAnswers[];

      setQuestionnaires({
        answeredQuestionnaires,
        unAnsweredQuestionnaires: res.filter(
          (q) => q.status === EQuestionnaireStatus.Available,
        ),
      });
      defaultPermissions
        ? setPermissions(defaultPermissions)
        : setPermissions({
            dataTypes: offer.virtualQuestionnaires,
            questionnaires: answeredQuestionnaires.map((q) => q.id),
          });
    });
  };

  const handleQuestionnaireAnswer = useCallback(
    (answers: NewQuestionnaireAnswer[]) => {
      if (questionnaireToAnswer) {
        answerQuestionnaire(questionnaireToAnswer.id, answers)
          .map(() => {
            getQuestionnaires();
            setQuestionnaireToAnswer(undefined);
          })
          .mapErr((e) => {
            setQuestionnaireToAnswer(undefined);
            console.error(e);
          });
      }
    },
    [questionnaireToAnswer],
  );

  const isReady = useMemo(() => {
    return !!questionnaires && !!permissions;
  }, [questionnaires, permissions]);
  return (
    <>
      <Dialog className={classes.dialog} fullWidth open onClose={closeModal}>
        <DialogTitle>
          <Box display="flex" position="relative" justifyContent="center">
            <Box display="flex" width="fit-content" alignItems="center">
              <Image
                src={offer.image ?? brandImage ?? ""}
                width={52}
                height={52}
                style={{ borderRadius: 8 }}
              />
              <SDTypography
                ml={2}
                hexColor={colors.DARKPURPLE500}
                variant="titleLg"
                fontWeight="bold"
              >
                {offer.name}
              </SDTypography>
            </Box>
            <Box position="absolute" top={0} right={0}>
              <CloseButton onClick={closeModal} />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            {isReady ? (
              <Permissions
                answeredQuestionnaires={questionnaires!.answeredQuestionnaires}
                unAnsweredQuestionnaires={
                  questionnaires!.unAnsweredQuestionnaires
                }
                onAnswerRequestClick={(questionnaire: Questionnaire) => {
                  setQuestionnaireToAnswer(questionnaire);
                }}
                dataTypes={offer.virtualQuestionnaires}
                onDataPermissionClick={onDataPermissionClick}
                onQuestionnairePermissionClick={onQuestionnairePermissionClick}
                dataTypePermissions={permissions!.dataTypes}
                questionnairePermissions={permissions!.questionnaires}
                useCheckboxOnly
              />
            ) : (
              <Box marginX="auto" py={10}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Box color={colors.GREY500} display="flex" width="100%">
            <FooterPointItem icon={brandImage || ""} points={offer.points} />
            <Box marginLeft="auto">
              <SDButton
                color="primary"
                onClick={() => {
                  onPrimaryButtonClick(permissions!);
                }}
              >
                {![
                  ...(permissions?.dataTypes ?? []),
                  ...(permissions?.questionnaires ?? []),
                ].some((p) => offerPermissions.current.includes(p))
                  ? !!defaultPermissions
                    ? "Revoke Shared"
                    : "Close"
                  : "Share"}
              </SDButton>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
      {questionnaireToAnswer && (
        <FillQuestionnaireModal
          questionnaire={questionnaireToAnswer}
          onQuestionnaireSubmit={(answers: NewQuestionnaireAnswer[]) => {
            handleQuestionnaireAnswer(answers);
          }}
          open={!!questionnaireToAnswer}
          onClose={() => {
            setQuestionnaireToAnswer(undefined);
          }}
        />
      )}
    </>
  );
};
