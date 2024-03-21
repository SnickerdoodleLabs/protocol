import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Theme,
  makeStyles,
} from "@material-ui/core";
import { abbreviateString } from "@shared-components/utils";
import {
  SDTypography,
  Image,
  SDButton,
  SDCheckbox,
  CloseButton,
  PermissionSectionTitle,
  PermissionItemWithShareButton,
  PermissionItemWithFillButton,
} from "@shared-components/v2/components";
import {
  DataTypeGroupProperties,
  getGroupedDataTypesG,
} from "@shared-components/v2/constants";
import { useSafeState } from "@shared-components/v2/hooks";
import { useDialogStyles } from "@shared-components/v2/styles";
import { colors, typograpyVariants } from "@shared-components/v2/theme";
import {
  ISingleQuestionnaireItem,
  ISingleVirtualQuestionnaireItem,
  IMultiQuestionItem,
  QueryQuestionType,
  getQueryStatusItemsForRender,
} from "@shared-components/v2/utils";
import { FillQuestionnaireModal } from "@shared-components/v2/widgets/FillQuestionnaireModal";
import {
  EQuestionnaireStatus,
  EVMAccountAddress,
  EVMContractAddress,
  EWalletDataType,
  IDynamicRewardParameter,
  IOldUserAgreement,
  IUserAgreement,
  IpfsCID,
  JSONString,
  NewQuestionnaireAnswer,
  QueryStatus,
  Questionnaire,
  QuestionnaireWithAnswers,
} from "@snickerdoodlelabs/objects";
import parse from "html-react-parser";
import { ResultAsync } from "neverthrow";
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
  setConsentPermissions: (
    consentContractAddress: EVMContractAddress,
    dataTypes: EWalletDataType[],
    questionnaires: IpfsCID[],
  ) => ResultAsync<void, unknown>;
  displayRejectButtons: boolean;
  onRejectClick?: () => void;
  onRejectWithTimestampClick?: () => void;
  getQueryStatuses: (
    contractAddress: EVMContractAddress,
  ) => ResultAsync<QueryStatus[], unknown>;
  batchApproveQueries: (
    contractAddress: EVMContractAddress,
    queries: Map<IpfsCID, IDynamicRewardParameter[]>,
  ) => ResultAsync<void, unknown>;
  getQuestionnairesByCids: (
    cids: IpfsCID[],
  ) => ResultAsync<Questionnaire[], unknown>;
  evmAccounts: EVMAccountAddress[];
}

enum EComponentRenderState {
  RENDER_QUERIES,
  RENDER_AGREEMENT,
}

interface IQueryApprovalState {
  queryIds: IpfsCID[];
  dataPermissions: EWalletDataType[];
  questionnairePermissions: IpfsCID[];
}
interface IQuestionnaireWithQuery {
  query: ISingleQuestionnaireItem;
  questionnaire: Questionnaire;
}
interface IAnsweredQuestionnaireWithQuery {
  query: ISingleQuestionnaireItem;
  questionnaire: QuestionnaireWithAnswers;
}
interface IQuestionnairesState {
  answeredQuestionnaires: IAnsweredQuestionnaireWithQuery[];
  unAnsweredQuestionnaires: IQuestionnaireWithQuery[];
}

interface IQueryStatusesState {
  virtualQuestionnaireQueries: ISingleVirtualQuestionnaireItem[];
  questionnaireQueries: ISingleQuestionnaireItem[];
  multiQuestionQueries: IMultiQuestionItem[];
}

export const ConsentModal = ({
  open,
  invitationData,
  onClose,
  onOptinClicked,
  answerQuestionnaire,
  setConsentPermissions,
  consentContractAddress,
  onRejectClick,
  onRejectWithTimestampClick,
  displayRejectButtons = true,
  getQueryStatuses,
  batchApproveQueries,
  getQuestionnairesByCids,
  evmAccounts,
}: IConsentModalProps) => {
  const classes = useStyles();
  const dialogClasses = useDialogStyles();

  const [componentRenderState, setComponentRenderState] = useSafeState(
    EComponentRenderState.RENDER_QUERIES,
  );
  const [queryStatuses, setQueryStatuses] = useSafeState<IQueryStatusesState>();
  const [questionnaires, setQuestionnaires] =
    useSafeState<IQuestionnairesState>();
  const initialApproveStateCalculation = React.useRef<boolean>(false);
  const [queryApprovalState, setQueryApprovalState] =
    useSafeState<IQueryApprovalState>();
  const [agreementConsented, setAgreementConsented] =
    useSafeState<boolean>(false);
  const [questionnaireToAnswer, setQuestionnaireToAnswer] =
    useSafeState<IQuestionnaireWithQuery>();
  const [receivingAddress, setReceivingAddress] =
    useSafeState<EVMAccountAddress>(evmAccounts[0]);

  const groupedDataTypes = useMemo(() => {
    if (!queryStatuses) {
      return undefined;
    }
    return getGroupedDataTypesG(queryStatuses.virtualQuestionnaireQueries);
  }, [queryStatuses]);

  useEffect(() => {
    _getQueryStatuses();
  }, []);

  useEffect(() => {
    if (
      queryStatuses &&
      questionnaires &&
      !initialApproveStateCalculation.current
    ) {
      initialApproveStateCalculation.current = true;
      const ids = [
        ...queryStatuses.virtualQuestionnaireQueries.map(
          (q) => q.queryStatus.queryCID,
        ),
        ...questionnaires.answeredQuestionnaires.map(
          (q) => q.query.queryStatus.queryCID,
        ),
      ];

      setQueryApprovalState({
        queryIds: ids,
        dataPermissions: queryStatuses.virtualQuestionnaireQueries.map(
          (q) => q.dataType,
        ),
        questionnairePermissions: questionnaires.answeredQuestionnaires.map(
          (q) => q.query.questionnaireCID,
        ),
      });
    }
  }, [JSON.stringify(queryStatuses), JSON.stringify(questionnaires)]);

  useEffect(() => {
    if (queryStatuses) {
      ResultUtils.combine(
        queryStatuses.questionnaireQueries.map((q) =>
          getQuestionnairesByCids([q.questionnaireCID]).map((questionnaire) => {
            return questionnaire.length
              ? { questionnaire: questionnaire[0], query: q }
              : null;
          }),
        ),
      ).map((res) => {
        const answeredQuestionnaires = res.filter(
          (q) => q && q.questionnaire.status === EQuestionnaireStatus.Complete,
        ) as IAnsweredQuestionnaireWithQuery[];
        const unAnsweredQuestionnaires = res.filter(
          (q) => q && q.questionnaire.status === EQuestionnaireStatus.Available,
        ) as IQuestionnaireWithQuery[];
        setQuestionnaires({
          answeredQuestionnaires,
          unAnsweredQuestionnaires,
        });
      });
    }
  }, [queryStatuses]);

  const _getQueryStatuses = () => {
    return getQueryStatuses(consentContractAddress).map((res) => {
      const items = getQueryStatusItemsForRender(res);

      const groupedItems = items.reduce(
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
      setQueryStatuses(groupedItems);
    });
  };

  const getRewardParameters = useCallback(
    (id: IpfsCID): JSONString => {
      if (!queryStatuses) {
        return `[]` as JSONString;
      }
      const res = [
        ...queryStatuses.virtualQuestionnaireQueries,
        ...queryStatuses.multiQuestionQueries,
        ...queryStatuses.questionnaireQueries,
      ].find((q) => q.queryStatus.queryCID === id);

      return res?.queryStatus?.rewardsParameters ?? (`[]` as JSONString);
    },
    [JSON.stringify(queryStatuses)],
  );

  const onDataPermissionClick = useCallback(
    (queryCID: IpfsCID, dataType: EWalletDataType) => {
      setQueryApprovalState((p) => {
        if (!p) {
          return p;
        }
        if (p.queryIds.includes(queryCID)) {
          const dataPermissionsCopy = [...p.dataPermissions];
          const index = dataPermissionsCopy.indexOf(dataType);
          if (index > -1) {
            dataPermissionsCopy.splice(index, 1);
          }
          return {
            ...p,
            queryIds: p.queryIds.filter((id) => id !== queryCID),
            dataPermissions: dataPermissionsCopy,
          };
        }
        return {
          ...p,
          queryIds: [...p.queryIds, queryCID],
          dataPermissions: [...p.dataPermissions, dataType],
        };
      });
    },
    [],
  );

  const onQuestionnairePermissionClick = useCallback(
    (queryCID: IpfsCID, questionnaireCID: IpfsCID) => {
      setQueryApprovalState((p) => {
        if (!p) {
          return p;
        }
        if (p.queryIds.includes(queryCID)) {
          const questionnairePermissionsCopy = [...p.questionnairePermissions];
          const index = questionnairePermissionsCopy.indexOf(questionnaireCID);
          if (index > -1) {
            questionnairePermissionsCopy.splice(index, 1);
          }
          return {
            ...p,
            queryIds: p.queryIds.filter((id) => id !== queryCID),
            questionnairePermissions: questionnairePermissionsCopy,
          };
        }
        return {
          ...p,
          queryIds: [...p.queryIds, queryCID],
          questionnairePermissions: [
            ...p.questionnairePermissions,
            questionnaireCID,
          ],
        };
      });
    },
    [],
  );

  const onQuestionnaireSubmit = useCallback(
    (answers: NewQuestionnaireAnswer[]) => {
      if (!questionnaireToAnswer) {
        return;
      }
      answerQuestionnaire(
        questionnaireToAnswer.query.questionnaireCID,
        answers,
      ).andThen(() => {
        return getQuestionnairesByCids([
          questionnaireToAnswer.query.questionnaireCID,
        ]).map(([answeredQuestionnaire]) => {
          if (
            !answeredQuestionnaire ||
            answeredQuestionnaire.status !== EQuestionnaireStatus.Complete
          ) {
            setQuestionnaireToAnswer(undefined);
            return;
          }
          setQuestionnaires((q) => {
            return {
              ...q,
              answeredQuestionnaires: [
                {
                  query: questionnaireToAnswer.query,
                  questionnaire:
                    answeredQuestionnaire as QuestionnaireWithAnswers,
                },
                ...(q?.answeredQuestionnaires ?? []),
              ],
              unAnsweredQuestionnaires: (
                q?.unAnsweredQuestionnaires ?? []
              ).filter(
                (q) =>
                  q.query.questionnaireCID !==
                  questionnaireToAnswer.query.questionnaireCID,
              ),
            };
          });
          setQueryApprovalState((p) => {
            if (!p) {
              return p;
            }
            return {
              ...p,
              queryIds: [
                questionnaireToAnswer.query.queryStatus.queryCID,
                ...p.queryIds,
              ],
              questionnairePermissions: [
                ...p.questionnairePermissions,
                questionnaireToAnswer.query.questionnaireCID,
              ],
            };
          });
          setQuestionnaireToAnswer(undefined);
        });
      });
    },
    [JSON.stringify(questionnaireToAnswer)],
  );

  const handleShareClicked = useCallback(() => {
    if (!queryApprovalState) {
      return;
    }
    setConsentPermissions(
      consentContractAddress,
      queryApprovalState.dataPermissions,
      queryApprovalState.questionnairePermissions,
    )
      .andThen(() => {
        return batchApproveQueries(
          consentContractAddress,
          new Map(
            queryApprovalState.queryIds.map((id) => {
              const calculatedRewardParameters =
                [] as IDynamicRewardParameter[];
              JSON.parse(getRewardParameters(id)).forEach((rp) => {
                calculatedRewardParameters.push({
                  ...rp,
                  recipientAddress: {
                    ...rp.recipientAddress,
                    value: receivingAddress,
                  },
                });
              });
              return [id, calculatedRewardParameters];
            }),
          ),
        );
      })
      .map(() => {
        onOptinClicked();
      });
  }, [
    JSON.stringify(queryApprovalState),
    getRewardParameters,
    receivingAddress,
  ]);

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
              setComponentRenderState(EComponentRenderState.RENDER_QUERIES);
              setAgreementConsented(true);
            }}
          >
            Done
          </SDButton>
        </Box>
      );
    } else {
      return (
        <Box display="flex" flexDirection="column" width={"100%"}>
          <Box
            alignItems="center"
            className={classes.mountAnimation}
            display="flex"
            justifyContent="space-between"
            width="100%"
          >
            <Box display="flex" gridGap={12} alignItems="center">
              <SDCheckbox
                checked={agreementConsented}
                onChange={() => {
                  setAgreementConsented(!agreementConsented);
                }}
                label={
                  <SDTypography variant="bodyMd">
                    I agree{" "}
                    <span
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        color: colors.DARKPURPLE500,
                        fontWeight: "bold",
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
              <Select
                value={receivingAddress}
                variant="outlined"
                onChange={(e) => {
                  console.log(e);
                  setReceivingAddress(e.target.value as EVMAccountAddress);
                }}
              >
                {evmAccounts.map((account) => (
                  <MenuItem key={account} value={account}>
                    <Box display="flex" alignItems="center" gridGap={12}>
                      <Image
                        src="https://storage.googleapis.com/dw-assets/shared/icons/eth.png"
                        width={16}
                        height={16}
                      />
                      <SDTypography variant="bodyMd" color="textBody">
                        {abbreviateString(account, 14, 0, 3)}
                      </SDTypography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </Box>
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
    }
  }, [componentRenderState, evmAccounts, receivingAddress, agreementConsented]);

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
                ? setComponentRenderState(EComponentRenderState.RENDER_QUERIES)
                : onClose();
            }}
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

  const isQueriesReady = useMemo(() => {
    return (
      !!questionnaires &&
      !!queryStatuses &&
      !!groupedDataTypes &&
      !!queryApprovalState
    );
  }, [questionnaires, queryStatuses, groupedDataTypes, queryApprovalState]);

  const content = () => {
    if (componentRenderState === EComponentRenderState.RENDER_QUERIES) {
      return (
        <Box display="flex" flexDirection="column">
          {isQueriesReady ? (
            <>
              {((questionnaires?.answeredQuestionnaires?.length ?? 0) > 0 ||
                (questionnaires?.unAnsweredQuestionnaires?.length ?? 0) >
                  0) && (
                <>
                  <PermissionSectionTitle title="Questionnaires" />
                  {questionnaires?.unAnsweredQuestionnaires?.map((q) => {
                    return (
                      <PermissionItemWithFillButton
                        key={q.questionnaire.id}
                        name={q.questionnaire.title}
                        icon={q.questionnaire.image || ""}
                        point={q.query.queryStatus.points}
                        pointIcon={
                          invitationData["brandInformation"]?.["image"] ??
                          invitationData.image ??
                          ""
                        }
                        onClick={() => {
                          setQuestionnaireToAnswer(q);
                        }}
                      />
                    );
                  })}

                  {questionnaires?.answeredQuestionnaires?.map((q) => {
                    return (
                      <PermissionItemWithShareButton
                        key={q.query.queryStatus.queryCID}
                        name={q.questionnaire.title}
                        icon={q.questionnaire.image || ""}
                        point={q.query.queryStatus.points}
                        pointIcon={
                          invitationData["brandInformation"]?.["image"] ??
                          invitationData.image ??
                          ""
                        }
                        onClick={() => {
                          onQuestionnairePermissionClick(
                            q.query.queryStatus.queryCID,
                            q.query.questionnaireCID,
                          );
                        }}
                        active={
                          queryApprovalState?.queryIds?.includes(
                            q.query.queryStatus.queryCID,
                          ) ?? false
                        }
                      />
                    );
                  })}
                </>
              )}
              {Object.entries(groupedDataTypes!)
                .sort(
                  ([q1, _], [q2, __]) =>
                    DataTypeGroupProperties[q1].order -
                    DataTypeGroupProperties[q2].order,
                )
                .map(([groupKey, groupItems]) => {
                  return (
                    <div key={groupKey}>
                      <PermissionSectionTitle
                        title={DataTypeGroupProperties[groupKey].name}
                      />
                      {groupItems.map((item) => {
                        return (
                          <PermissionItemWithShareButton
                            key={item.queryStatus.queryCID}
                            name={item.permission.name}
                            icon={item.permission.icon}
                            point={item.queryStatus.points}
                            pointIcon={
                              invitationData["brandInformation"]?.["image"] ??
                              invitationData.image ??
                              ""
                            }
                            onClick={() => {
                              onDataPermissionClick(
                                item.queryStatus.queryCID,
                                item.permission.key,
                              );
                            }}
                            active={
                              queryApprovalState?.queryIds?.includes(
                                item.queryStatus.queryCID,
                              ) ?? false
                            }
                          />
                        );
                      })}
                    </div>
                  );
                })}
            </>
          ) : (
            <Box marginX="auto" py={10}>
              <CircularProgress />
            </Box>
          )}
        </Box>
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
          questionnaire={questionnaireToAnswer.questionnaire}
          onQuestionnaireSubmit={(answers) => {
            onQuestionnaireSubmit(answers);
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
