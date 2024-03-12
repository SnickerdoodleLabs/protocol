import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
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
import { ffSupportedPermissions } from "@shared-components/v2/constants";
import { useSafeState } from "@shared-components/v2/hooks";
import { useDialogStyles } from "@shared-components/v2/styles";
import { colors, typograpyVariants } from "@shared-components/v2/theme";
import { FillQuestionnaireModal } from "@shared-components/v2/widgets/FillQuestionnaireModal";
import { Permissions } from "@shared-components/v2/widgets/Permissions";
import {
  EQuestionnaireQuestionType,
  EQuestionnaireStatus,
  EWalletDataType,
  IOldUserAgreement,
  IUserAgreement,
  IpfsCID,
  MarketplaceTag,
  NewQuestionnaireAnswer,
  ProxyError,
  Questionnaire,
  QuestionnaireAnswer,
  QuestionnaireQuestion,
  QuestionnaireWithAnswers,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import parse from "html-react-parser";
import { ResultAsync, okAsync } from "neverthrow";
import React, { useMemo } from "react";

interface IConsentModalProps {
  onClose: () => void;
  open: boolean;
  onOptinClicked: () => void;
  invitationData: IOldUserAgreement | IUserAgreement;
  answerQuestionnaire: (
    id: IpfsCID,
    answers: NewQuestionnaireAnswer[],
  ) => ResultAsync<void, ProxyError>;
}

enum EComponentRenderState {
  RENDER_PERMISSIONS,
  RENDER_AGREEMENT,
}

export const ConsentModal = ({
  open,
  invitationData,
  onClose,
  onOptinClicked,
  answerQuestionnaire,
}: IConsentModalProps) => {
  const classes = useStyles();
  const dialogClasses = useDialogStyles();
  const [componentRenderState, setComponentRenderState] = useSafeState(
    EComponentRenderState.RENDER_PERMISSIONS,
  );
  const [dataPermissions, setDataPermissions] = useSafeState<EWalletDataType[]>(
    ffSupportedPermissions
  );
  const [questionnairePermissions, setQuestionnairePermissions] = useSafeState<
    IpfsCID[]
  >([]);
  const [agreementConsented, setAgreementConsented] =
    useSafeState<boolean>(false);

  const [questionnaireToAnswer, setQuestionnaireToAnswer] =
    useSafeState<Questionnaire>();

  const onDataPermissionClick = (dataType: EWalletDataType) => {
    if (dataPermissions.includes(dataType)) {
      setDataPermissions(dataPermissions.filter((d) => d !== dataType));
    } else {
      setDataPermissions([...dataPermissions, dataType]);
    }
  };

  const onQuestionnairePermissionClick = (questionnaireCID: IpfsCID) => {
    if (questionnairePermissions?.includes(questionnaireCID)) {
      setQuestionnairePermissions(
        questionnairePermissions.filter((q) => q !== questionnaireCID),
      );
    } else {
      setQuestionnairePermissions([
        ...(questionnairePermissions ?? []),
        questionnaireCID,
      ]);
    }
  };

  const setPermissions = () => {
    return okAsync(undefined);
  };

  const handleShareClicked = () => {
    setPermissions().map(() => {
      onOptinClicked();
    });
  };

  const onQuestionnarieSubmit = (
    answers: NewQuestionnaireAnswer[],
    id: IpfsCID,
  ) => {
    answerQuestionnaire(id, answers).map(() => {
      onQuestionnairePermissionClick(id);
      setQuestionnaireToAnswer(undefined);
    });
  };

  const actions = useMemo(() => {
    if (componentRenderState === EComponentRenderState.RENDER_AGREEMENT) {
      return (
        <Box
          display="flex"
          key={EComponentRenderState.RENDER_AGREEMENT}
          className={classes.mountAnimation}
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <SDButton
            variant="outlined"
            color="primary"
            onClick={() => {
              setComponentRenderState(EComponentRenderState.RENDER_PERMISSIONS);
              setAgreementConsented(true);
            }}
          >
            Done
          </SDButton>
        </Box>
      );
    } else {
      return (
        <Box
          alignItems="center"
          key={EComponentRenderState.RENDER_PERMISSIONS}
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
            label={
              <SDTypography variant="bodyMd">
                I agree to{" "}
                <span
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: colors.DARKPURPLE500,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setComponentRenderState(
                      EComponentRenderState.RENDER_AGREEMENT,
                    );
                  }}
                >
                  Terms and Conditions
                </span>
              </SDTypography>
            }
          />
          <SDButton
            disabled={!agreementConsented}
            variant="contained"
            color="primary"
            onClick={() => {
              handleShareClicked();
            }}
          >
            Share Selected
          </SDButton>
        </Box>
      );
    }
  }, [componentRenderState, agreementConsented]);

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
              componentRenderState === EComponentRenderState.RENDER_AGREEMENT
                ? setComponentRenderState(
                    EComponentRenderState.RENDER_PERMISSIONS,
                  )
                : onClose();
            }}
            size={24}
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
  }, [JSON.stringify(invitationData), componentRenderState]);

  const content = () => {
    if (componentRenderState === EComponentRenderState.RENDER_PERMISSIONS) {
      return (
        <Permissions
          onAnswerRequestClick={(q) => {
            setQuestionnaireToAnswer(q);
          }}
          answeredQuestionnaires={[
            new QuestionnaireWithAnswers(
              1 as unknown as IpfsCID,
              MarketplaceTag(1 + ": 0x123"),
              EQuestionnaireStatus.Available,
              "Questionnaire",
              "",
              null,
              [
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
              ],
              [new QuestionnaireAnswer(1 as unknown as IpfsCID, 0, 0)],
              null as unknown as UnixTimestamp,
            ),
          ]}
          unAnsweredQuestionnaires={[
            new Questionnaire(
              1 as unknown as IpfsCID,
              MarketplaceTag(1 + ": 0x123"),
              EQuestionnaireStatus.Available,
              "Questionnaire",
              "",
              null,
              [
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
                new QuestionnaireQuestion(
                  0,
                  EQuestionnaireQuestionType.MultipleChoice,
                  "To be or not to be?",
                  ["a", "b"],
                  null,
                  null,
                  null,
                ),
              ],
            ),
          ]}
          dataTypes={ffSupportedPermissions}
          onDataPermissionClick={onDataPermissionClick}
          onQuestionnairePermissionClick={onQuestionnairePermissionClick}
          dataTypePermissions={dataPermissions}
          questionnairePermissions={questionnairePermissions}
        />
      );
    } else {
      return (
        <Box key={"aggrementPolicy"} className={classes.mountAnimation}>
          {agreementPolicy}
        </Box>
      );
    }
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

      {questionnaireToAnswer && (
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
      )}
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
