import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import {
  EQuestionnaireQuestionType,
  EQuestionnaireStatus,
  EVMContractAddress,
  EWalletDataType,
  IpfsCID,
  NewQuestionnaireAnswer,
  PagingRequest,
  Questionnaire,
  QuestionnaireWithAnswers,
} from "@snickerdoodlelabs/objects";
import {
  CloseButton,
  FillQuestionnaireModal,
  Image,
  SDButton,
  SDTypography,
  colors,
  useDialogStyles,
  useSafeState,
  Permissions,
} from "@snickerdoodlelabs/shared-components";
import { okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
export interface IBrandPermissionsModal {
  consentAddress: EVMContractAddress;
  icon: string;
  brandName: string;
  dataTypes: EWalletDataType[];
  questionnaireCIDs: IpfsCID[];
}

interface IQuestionnairesState {
  answeredQuestionnaires: QuestionnaireWithAnswers[];
  unAnsweredQuestionnaires: Questionnaire[];
}

interface IPermissionsState {
  dataTypes: EWalletDataType[];
  questionnaires: IpfsCID[];
}

// @TODO
const dummyPermissionGetter = (...args) => {
  return okAsync({ dataTypes: [], questionnaires: [] });
};
const dummyPermissionSetter = (...args) => {
  return okAsync(undefined);
};

const QuestionnaireModal: FC = () => {
  const { modalState, closeModal, setLoadingStatus } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { icon, brandName, dataTypes, questionnaireCIDs, consentAddress } =
    customProps as IBrandPermissionsModal;
  const classes = useDialogStyles();
  const { sdlDataWallet } = useDataWalletContext();
  const [questionnaireToAnswer, setQuestionnaireToAnswer] =
    useSafeState<Questionnaire>();

  const [questionnaires, setQuestionnaires] =
    useSafeState<IQuestionnairesState>();
  const [consentDataTypes, setConsentDataTypes] =
    useSafeState<EWalletDataType[]>();
  const [permissions, setPermissions] = useSafeState<IPermissionsState>();
  const permissionsRef = useRef<IPermissionsState>();

  useEffect(() => {
    if (permissions) {
      permissionsRef.current = permissions;
    }
  }, [JSON.stringify(permissions)]);

  useEffect(() => {
    ResultUtils.combine([
      getQuestionnaires(),
      getVirtualQuestionnaires(),
      getPermissions(),
    ]).mapErr((e) => console.error(e));
  }, []);

  const getQuestionnaires = () => {
    return sdlDataWallet.questionnaire
      .getQuestionnairesForConsentContract(
        new PagingRequest(1, 100),
        consentAddress,
      )
      .map((res) => {
        setQuestionnaires({
          answeredQuestionnaires: res.response.filter(
            (q) => q.status === EQuestionnaireStatus.Complete,
          ) as QuestionnaireWithAnswers[],
          unAnsweredQuestionnaires: res.response.filter(
            (q) => q.status === EQuestionnaireStatus.Available,
          ) as Questionnaire[],
        });
      });
  };

  const getVirtualQuestionnaires = () => {
    return sdlDataWallet.questionnaire
      .getVirtualQuestionnaires(consentAddress)
      .map((res) => {
        setConsentDataTypes(res);
      });
  };

  const getPermissions = () => {
    return dummyPermissionGetter().map((res) => {
      setPermissions({
        dataTypes: res.dataTypes,
        questionnaires: res.questionnaires,
      });
    });
  };

  const handleQuestionnaireAnswer = useCallback(
    (answers: NewQuestionnaireAnswer[]) => {
      if (questionnaireToAnswer) {
        sdlDataWallet.questionnaire
          .answerQuestionnaire(questionnaireToAnswer.id, answers)
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

  const onDataPermissionClick = useCallback((dataType: EWalletDataType) => {
    if (permissionsRef.current) {
      const newPermissions = {
        ...permissionsRef.current,
        dataTypes: permissionsRef.current.dataTypes.includes(dataType)
          ? permissionsRef.current.dataTypes.filter((dt) => dt !== dataType)
          : permissionsRef.current.dataTypes.concat(dataType),
      };
      dummyPermissionSetter(newPermissions).map(() => {
        setPermissions(newPermissions);
      });
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
        dummyPermissionSetter(newPermissions).map(() => {
          setPermissions(newPermissions);
        });
      }
    },
    [],
  );

  const isReady = useMemo(() => {
    return !!questionnaires && !!consentDataTypes && !!permissions;
  }, [questionnaires, consentDataTypes, permissions]);

  const handleOptOut = () => {
    setLoadingStatus(true);
    sdlDataWallet
      .leaveCohort(consentAddress)
      .map(() => {
        setLoadingStatus(false);
        closeModal();
      })
      .mapErr(() => {
        setLoadingStatus(false);
      });
  };

  return (
    <>
      <Dialog className={classes.dialog} fullWidth open onClose={closeModal}>
        <DialogTitle>
          <Box display="flex" position="relative" justifyContent="center">
            <Box display="flex" width="fit-content" alignItems="center">
              <Image
                src={icon}
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
                {brandName}
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
                dataTypes={consentDataTypes!}
                onDataPermissionClick={onDataPermissionClick}
                onQuestionnairePermissionClick={onQuestionnairePermissionClick}
                dataTypePermissions={permissions!.dataTypes}
                questionnairePermissions={permissions!.questionnaires}
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
            <SDButton
              onClick={() => {
                handleOptOut();
              }}
              startIcon={<Delete />}
              variant="text"
              color="inherit"
            >
              Stop Sharing All
            </SDButton>
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

export default QuestionnaireModal;
