import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Theme,
  makeStyles,
} from "@material-ui/core";
import {
  SDTypography,
  Image,
  SDButton,
  SDCheckbox,
  CloseButton,
} from "@shared-components/v2/components";
import { useSafeState } from "@shared-components/v2/hooks";
import { useDialogStyles } from "@shared-components/v2/styles";
import { colors, typograpyVariants } from "@shared-components/v2/theme";
import { FillQuestionnaireModal } from "@shared-components/v2/widgets/FillQuestionnaireModal";
import { Permissions } from "@shared-components/v2/widgets/Permissions";
import {
  EQuestionnaireStatus,
  EVMContractAddress,
  EWalletDataType,
  IOldUserAgreement,
  IUserAgreement,
  IpfsCID,
  NewQuestionnaireAnswer,
  PagedResponse,
  PagingRequest,
  Questionnaire,
  QuestionnaireWithAnswers,
} from "@snickerdoodlelabs/objects";
import parse from "html-react-parser";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

interface IConsentModalProps {
  onClose: () => void;
  open: boolean;
  onOptinClicked: () => void;
  consentContractAddress: EVMContractAddress;
  invitationData: IOldUserAgreement | IUserAgreement;
  answerQuestionnaire: (
    id: IpfsCID,
    answers: NewQuestionnaireAnswer[],
  ) => ResultAsync<void, unknown>;
  getQuestionnaires: (
    pagingRequest: PagingRequest,
    consentContractAddress: EVMContractAddress,
  ) => ResultAsync<
    PagedResponse<QuestionnaireWithAnswers | Questionnaire>,
    unknown
  >;
  getVirtualQuestionnaires: (
    consentContractAddress: EVMContractAddress,
  ) => ResultAsync<EWalletDataType[], unknown>;
  setConsentPermissions: (
    consentContractAddress: EVMContractAddress,
    dataTypes: EWalletDataType[],
    questionnaires: IpfsCID[],
  ) => ResultAsync<void, unknown>;
  displayRejectButtons: boolean;
  onRejectClick?: () => void;
  onRejectWithTimestampClick?: () => void;
}

// enum EComponentRenderState {
//   RENDER_PERMISSIONS,
//   RENDER_AGREEMENT,
// }
interface IQuestionnairesState {
  answeredQuestionnaires: QuestionnaireWithAnswers[];
  unAnsweredQuestionnaires: Questionnaire[];
}

interface IPermissionsState {
  dataTypes: EWalletDataType[];
  questionnaires: IpfsCID[];
}

export const ConsentModal = ({
  open,
  invitationData,
  onClose,
  onOptinClicked,
  answerQuestionnaire,
  getQuestionnaires,
  getVirtualQuestionnaires,
  setConsentPermissions,
  consentContractAddress,
  onRejectClick,
  onRejectWithTimestampClick,
  displayRejectButtons = true,
}: IConsentModalProps) => {
  const classes = useStyles();
  const dialogClasses = useDialogStyles();
  // const [componentRenderState, setComponentRenderState] = useSafeState(
  //   EComponentRenderState.RENDER_PERMISSIONS,
  // );
  const [questionnaires, setQuestionnaires] =
    useSafeState<IQuestionnairesState>();
  const [consentDataTypes, setConsentDataTypes] =
    useSafeState<EWalletDataType[]>();
  const [permissions, setPermissions] = useSafeState<IPermissionsState>();
  const initialPermissionsCalculationRef = React.useRef<boolean>(false);
  const permissionsRef = useRef<IPermissionsState>();

  useEffect(() => {
    ResultUtils.combine([
      _getQuestionnaires(),
      _getVirtualQuestionnaires(),
    ]).mapErr((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (permissions) {
      permissionsRef.current = permissions;
    }
  }, [JSON.stringify(permissions)]);

  useEffect(() => {
    if (
      questionnaires &&
      consentDataTypes &&
      !initialPermissionsCalculationRef.current
    ) {
      initialPermissionsCalculationRef.current = true;
      setPermissions({
        dataTypes: consentDataTypes,
        questionnaires: questionnaires.answeredQuestionnaires.map((q) => q.id),
      });
    }
  }, [JSON.stringify(questionnaires), JSON.stringify(consentDataTypes)]);

  const _getQuestionnaires = () => {
    return getQuestionnaires(
      new PagingRequest(1, 100),
      consentContractAddress,
    ).map((res) => {
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

  const _getVirtualQuestionnaires = () => {
    return getVirtualQuestionnaires(consentContractAddress).map((res) => {
      setConsentDataTypes(res);
    });
  };

  const [agreementConsented, setAgreementConsented] =
    useSafeState<boolean>(false);

  const [questionnaireToAnswer, setQuestionnaireToAnswer] =
    useSafeState<Questionnaire>();

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

  const handleShareClicked = useCallback(() => {
    if (permissions) {
      setConsentPermissions(
        consentContractAddress,
        permissions.dataTypes,
        permissions.questionnaires,
      ).map(() => {
        onOptinClicked();
      });
    }
  }, [JSON.stringify(permissions)]);

  const onQuestionnarieSubmit = (
    answers: NewQuestionnaireAnswer[],
    id: IpfsCID,
  ) => {
    answerQuestionnaire(id, answers).map(() => {
      setQuestionnaireToAnswer(undefined);
      _getQuestionnaires();
    });
  };

  const actions = useMemo(() => {
    // if (componentRenderState === EComponentRenderState.RENDER_AGREEMENT) {
    //   return (
    //     <Box
    //       display="flex"
    //       key={EComponentRenderState.RENDER_AGREEMENT}
    //       className={classes.mountAnimation}
    //       alignItems="center"
    //       justifyContent="center"
    //       width="100%"
    //     >
    //       <SDButton
    //         variant="outlined"
    //         color="primary"
    //         onClick={() => {
    //           setComponentRenderState(EComponentRenderState.RENDER_PERMISSIONS);
    //           setAgreementConsented(true);
    //         }}
    //       >
    //         Done
    //       </SDButton>
    //     </Box>
    //   );
    // } else {
    return (
      <Box display="flex" flexDirection="column" width={"100%"}>
        <Box
          alignItems="center"
          className={classes.mountAnimation}
          display="flex"
          justifyContent="space-between"
          width="100%"
        >
          <SDCheckbox
            checked={agreementConsented}
            onChange={() => {
              setAgreementConsented(!agreementConsented);
            }}
            label={<SDTypography variant="bodyMd">I agree</SDTypography>}
          />
          <SDButton
            disabled={!agreementConsented}
            variant="contained"
            color="primary"
            onClick={() => {
              handleShareClicked();
            }}
          >
            Continue
          </SDButton>
        </Box>
        {displayRejectButtons && (
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="center"
            mt={4}
          >
            <SDButton
              variant="text"
              onClick={() => {
                onRejectClick ? onRejectClick() : onClose();
              }}
            >
              Don’t show me this again
            </SDButton>
            <SDButton
              variant="text"
              onClick={() => {
                onRejectWithTimestampClick
                  ? onRejectWithTimestampClick()
                  : onClose();
              }}
            >
              Remind me later
            </SDButton>
          </Box>
        )}
      </Box>
    );
    // }
  }, [
    // componentRenderState,
    agreementConsented,
  ]);

  const agreementPolicy = useMemo(() => {
    const agreementTitle = invitationData["attributes"]
      ? (invitationData as IUserAgreement).attributes.find(
          (attr) => attr.trait_type === "title",
        )?.value
      : (invitationData as IOldUserAgreement).title ?? "Your Data, Your Choice";
    const descriptionText = invitationData.description;

    if (!descriptionText) {
      return (
        <>
          <SDTypography
            variant="titleSm"
            color="textHeading"
            fontWeight="bold"
            align="center"
            mb={3}
          >
            {agreementTitle}
          </SDTypography>
          <SDTypography variant="bodyMd">
            We believe you deserve control over your own data. Here's why we're
            offering a new way - a better way:
            <br />
            <br /> • <strong> Empowerment:</strong> It's your data. We're here
            to ensure you retain control and ownership, always.
            <br /> • <strong>Privacy First:</strong> Thanks to our integration
            with Snickerdoodle, we ensure your data remains anonymous and
            private by leveraging their proprietary tech and Zero Knowledge
            Proofs.
            <br /> • <strong>Enhanced Experience:</strong> Sharing your web3
            data, like token balances, NFTs, and transaction history, allows you
            to access unique experiences tailored just for you.
            <br /> • <strong>Exclusive Rewards:</strong> Unlock exclusive NFTs
            as rewards for sharing your data. It's our way of saying thanks.
            <br />
            <br />
            By clicking "Accept," you acknowledge our web3 data permissions
            policy and terms. Remember, your privacy is paramount to us; we've
            integrated with Snickerdoodle to ensure it.
          </SDTypography>
        </>
      );
    }
    if (descriptionText.trim().startsWith("<")) {
      return (
        <>
          <SDTypography
            variant="titleSm"
            color="textHeading"
            fontWeight="bold"
            align="center"
            mb={3}
          >
            {agreementTitle}
          </SDTypography>
          <span className={classes.rawHtmlWrapper}>
            {parse(descriptionText)}
          </span>
        </>
      );
    }
    return (
      <>
        <SDTypography
          variant="titleSm"
          color="textHeading"
          fontWeight="bold"
          align="center"
          mb={3}
        >
          {agreementTitle}
        </SDTypography>
        <SDTypography variant="bodyMd">{descriptionText}</SDTypography>
      </>
    );
  }, [JSON.stringify(invitationData)]);

  const header = useMemo(() => {
    const brandName = invitationData["brandInformation"]?.["name"] ?? "";

    const brandLogo =
      invitationData["brandInformation"]?.["image"] ??
      invitationData.image ??
      "";
    const brandDescription =
      invitationData["brandInformation"]?.["description"] ?? "";

    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box display="flex" width="100%" justifyContent="flex-end">
          <CloseButton
            onClick={() => {
              // componentRenderState === EComponentRenderState.RENDER_AGREEMENT
              //   ? setComponentRenderState(
              //       EComponentRenderState.RENDER_PERMISSIONS,
              //     )
              //   : onClose();
              onClose();
            }}
            color="#212121"
          />
        </Box>
        <Image src={brandLogo} width={32} height={32} />
        {brandName && (
          <SDTypography
            hexColor={colors.DARKPURPLE500}
            variant="headlineSm"
            fontWeight="bold"
            align="center"
            mt={3}
          >
            {brandName}
          </SDTypography>
        )}
        {brandDescription && (
          <SDTypography
            hexColor={colors.GREY600}
            variant="titleMd"
            align="center"
            mt={1}
          >
            {brandDescription}
          </SDTypography>
        )}
      </Box>
    );
  }, [
    JSON.stringify(invitationData),
    // componentRenderState
  ]);

  const isPermissionsReady = useMemo(() => {
    return !!questionnaires && !!consentDataTypes && !!permissions;
  }, [questionnaires, consentDataTypes, permissions]);

  const content = () => {
    // if (componentRenderState === EComponentRenderState.RENDER_PERMISSIONS) {
    //   return (
    //     <Box display="flex" flexDirection="column">
    //       {isPermissionsReady ? (
    //         <Permissions
    //           onAnswerRequestClick={(q) => {
    //             setQuestionnaireToAnswer(q);
    //           }}
    //           unAnsweredQuestionnaires={
    //             questionnaires!.unAnsweredQuestionnaires
    //           }
    //           answeredQuestionnaires={questionnaires!.answeredQuestionnaires}
    //           dataTypes={consentDataTypes!}
    //           onDataPermissionClick={onDataPermissionClick}
    //           onQuestionnairePermissionClick={onQuestionnairePermissionClick}
    //           dataTypePermissions={permissions!.dataTypes}
    //           questionnairePermissions={permissions!.questionnaires}
    //         />
    //       ) : (
    //         <Box marginX="auto" py={10}>
    //           <CircularProgress />
    //         </Box>
    //       )}
    //     </Box>
    //   );
    // } else {
    return (
      <Box key={"aggrementPolicy"} className={classes.mountAnimation}>
        {agreementPolicy}
      </Box>
    );
    // }
  };

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={onClose}
        className={dialogClasses.dialog}
      >
        <DialogTitle>{header}</DialogTitle>
        <DialogContent>{content()}</DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>

      {/* {questionnaireToAnswer && (
        <FillQuestionnaireModal
          open={!!questionnaireToAnswer}
          onClose={() => {
            setQuestionnaireToAnswer(undefined);
          }}
          questionnaire={questionnaireToAnswer}
          onQuestionnaireSubmit={(answers) => {
            onQuestionnarieSubmit(answers, questionnaireToAnswer.id);
          }}
        />
      )} */}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  "@keyframes disappear": {
    from: {
      opacity: 1,
    },
    to: {
      opacity: 0,
    },
  },
  "@keyframes appear": {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  unmountAnimation: {
    animation: "$disappear 0.4s ease-in-out",
  },
  mountAnimation: {
    animation: "$appear 0.4s ease-in-out",
  },
  rawHtmlWrapper: {
    color: theme.palette.textBody,
    fontSize: typograpyVariants.bodyMd.fontSize,
    fontFamily: theme.typography.fontFamily,
    lineHeight: 1.45,
    "& h1": {
      ...typograpyVariants.titleLg,
    },
    "& h2": {
      ...typograpyVariants.titleMd,
    },
    "& h3": {
      ...typograpyVariants.titleSm,
    },
    "& a:link": {
      color: theme.palette.textLink,
    },
    "& ol, ul": {
      paddingLeft: "1em",
    },
  },
}));
