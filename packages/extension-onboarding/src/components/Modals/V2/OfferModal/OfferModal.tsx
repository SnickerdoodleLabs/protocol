import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
} from "@material-ui/core";
import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import {
  EChain,
  EQuestionnaireStatus,
  EVMAccountAddress,
  EWalletDataType,
  IDynamicRewardParameter,
  IpfsCID,
  NewQuestionnaireAnswer,
  QueryStatus,
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
  abbreviateString,
  CustomSelect,
  AccountMenuItem,
  FooterPointItem,
} from "@snickerdoodlelabs/shared-components";
import { okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";

export interface IOfferModal {
  offer: QueryStatus;
  brandImage?: string;
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

const OfferModal: FC = () => {
  const { modalState, closeModal, setLoadingStatus } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { offer, brandImage } = customProps as IOfferModal;
  const classes = useDialogStyles();
  const { sdlDataWallet } = useDataWalletContext();
  const [questionnaireToAnswer, setQuestionnaireToAnswer] =
    useSafeState<Questionnaire>();

  const [questionnaires, setQuestionnaires] =
    useSafeState<IQuestionnairesState>();
  const [permissions, setPermissions] = useSafeState<IPermissionsState>();
  const permissionsRef = useRef<IPermissionsState>();
  const { linkedAccounts, setLinkerModalOpen } = useAppContext();
  const [receivingAddress, setReceivingAddress] =
    useSafeState<EVMAccountAddress>();
  const initialAccountRef = useRef<boolean>(false);

  const offerPermissions = useRef<(IpfsCID | EWalletDataType)[]>([
    ...offer.virtualQuestionnaires,
    ...offer.questionnaires,
  ]);
  const evmAccounts = useMemo(() => {
    return linkedAccounts
      .filter((account) => account.sourceChain === EChain.EthereumMainnet)
      .map((account) => account.sourceAccountAddress) as EVMAccountAddress[];
  }, [linkedAccounts]);

  useEffect(() => {
    const evmAccounts = linkedAccounts.filter(
      (account) => account.sourceChain === EChain.EthereumMainnet,
    );
    if (evmAccounts.length > 0 && !initialAccountRef.current) {
      setReceivingAddress(
        evmAccounts[0].sourceAccountAddress as EVMAccountAddress,
      );
      initialAccountRef.current = true;
    }
  }, [linkedAccounts]);

  useEffect(() => {
    getQuestionnairesWithInitialPermissions();
  }, []);

  useEffect(() => {
    if (permissions) {
      permissionsRef.current = permissions;
    }
  }, [JSON.stringify(permissions)]);

  const getQuestionnaires = () => {
    return sdlDataWallet.questionnaire
      .getByCIDs(offer.questionnaires)
      .map((res) => {
        setQuestionnaires({
          answeredQuestionnaires: res.filter(
            (q) => q.status === EQuestionnaireStatus.Complete,
          ) as QuestionnaireWithAnswers[],
          unAnsweredQuestionnaires: res.filter(
            (q) => q.status === EQuestionnaireStatus.Available,
          ),
        });
        return res;
      });
  };

  const getQuestionnairesWithInitialPermissions = () => {
    return ResultUtils.combine([getQuestionnaires(), getPermissions()]).map(
      ([qs, p]) => {
        const incomingQuestionnaireIDs = qs
          .filter((q) => q.status === EQuestionnaireStatus.Complete)
          .map((q) => q.id);
        setPermissions({
          dataTypes: Array.from(
            new Set([...p.dataTypes, ...offer.virtualQuestionnaires]),
          ),
          questionnaires: Array.from(
            new Set([...p.questionnaires, ...incomingQuestionnaireIDs]),
          ),
        });
      },
    );
  };

  const getPermissions = () => {
    return dummyPermissionGetter();
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

  const handleOfferApprove = () => {
    const calculatedParameters: IDynamicRewardParameter[] = [];
    const rewardsParameters = ObjectUtils.deserialize<
      IDynamicRewardParameter[]
    >(offer.rewardsParameters);

    rewardsParameters.forEach((rp) => {
      calculatedParameters.push({
        ...rp,
        recipientAddress: {
          ...rp.recipientAddress,
          value: receivingAddress!,
        },
      });
    });
    dummyPermissionSetter(permissionsRef.current).andThen(() => {
      return sdlDataWallet
        .approveQuery(offer.queryCID, calculatedParameters)
        .map(() => {
          onPrimaryButtonClick();
          closeModal();
        });
    });
  };

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
            {receivingAddress && (
              <CustomSelect
                value={receivingAddress}
                onChange={(e) => {
                  setReceivingAddress(e.target.value as EVMAccountAddress);
                }}
              >
                {evmAccounts.map((account) => (
                  <MenuItem key={account} value={account}>
                    <AccountMenuItem account={account} />
                  </MenuItem>
                ))}
              </CustomSelect>
            )}
            <Box marginLeft="auto">
              <SDButton
                disabled={
                  ![
                    ...(permissions?.dataTypes ?? []),
                    ...(permissions?.questionnaires ?? []),
                  ].some((p) => offerPermissions.current.includes(p))
                }
                color="primary"
                onClick={handleOfferApprove}
              >
                Share
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

export default OfferModal;
