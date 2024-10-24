import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles, Theme } from "@material-ui/core/styles";

import {
  SDTypography,
  Image,
  SDButton,
  CloseButton,
  PermissionSectionTitle,
  PermissionItemWithShareButton,
  PermissionItemWithFillButton,
  CustomSelect,
  FooterPointItem,
  AccountMenuItem,
  SDCheckbox,
} from "@shared-components/v2/components";
import {
  DataTypeGroupProperties,
  getGroupedDataTypesG,
} from "@shared-components/v2/constants";
import { useResponsiveValue, useSafeState } from "@shared-components/v2/hooks";
import { useDialogStyles } from "@shared-components/v2/styles";
import { colors, typograpyVariants } from "@shared-components/v2/theme";
import {
  ISingleQuestionnaireItem,
  ISingleVirtualQuestionnaireItem,
  IMultiQuestionItem,
  QueryQuestionType,
  getQueryStatusItemsForRender,
} from "@shared-components/v2/utils";
import { CombinedQuery } from "@shared-components/v2/widgets/ConsentModal/CombinedQueryItem";
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
  onOptinClicked: (params: IOptInParams) => void;
  consentContractAddress: EVMContractAddress;
  invitationData: IOldUserAgreement | IUserAgreement;
  answerQuestionnaire: (
    id: IpfsCID,
    answers: NewQuestionnaireAnswer[],
  ) => ResultAsync<void, unknown>;
  displayRejectButtons: boolean;
  onRejectClick?: () => void;
  onRejectWithTimestampClick?: () => void;
  getQueryStatuses: (
    contractAddress: EVMContractAddress,
  ) => ResultAsync<QueryStatus[], unknown>;
  getQuestionnairesByCids: (
    cids: IpfsCID[],
  ) => ResultAsync<Questionnaire[], unknown>;
  evmAccounts: EVMAccountAddress[];
}

enum EComponentRenderState {
  RENDER_QUERIES,
  RENDER_AGREEMENT,
}

interface IOptInParams {
  directCall: {
    permissions: {
      dataTypes: EWalletDataType[];
      questionnaires: IpfsCID[];
    };
    approvals: Map<IpfsCID, IDynamicRewardParameter[]>;
  };
  withPermissions: Map<
    IpfsCID,
    {
      permissions: {
        dataTypes: EWalletDataType[];
        questionnaires: IpfsCID[];
      };
      rewardParameters: IDynamicRewardParameter[];
    }
  >;
}

interface IQueryApprovalState {
  queryIds: IpfsCID[];
  points: number;
  dataPermissions: EWalletDataType[];
  questionnairePermissions: IpfsCID[];
  combined: {
    queryId: IpfsCID;
    permissions: {
      dataTypes: EWalletDataType[];
      questionnaires: IpfsCID[];
    };
  }[];
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
  consentContractAddress,
  onRejectClick,
  onRejectWithTimestampClick,
  displayRejectButtons = true,
  getQueryStatuses,
  getQuestionnairesByCids,
  evmAccounts,
}: IConsentModalProps) => {
  const classes = useStyles();
  const dialogClasses = useDialogStyles({ maxWidth: 700 });

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
  const [totalPoints, setTotalPoints] = useSafeState<number>();
  const [combinedItemToHandle, setCombinedItemToHandle] =
    useSafeState<IMultiQuestionItem>();
  const getResponsiveValue = useResponsiveValue();

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
        points:
          queryStatuses.virtualQuestionnaireQueries.reduce(
            (acc, q) => acc + q.queryStatus.points,
            0,
          ) +
          questionnaires.answeredQuestionnaires.reduce(
            (acc, q) => acc + q.query.queryStatus.points,
            0,
          ),
        questionnairePermissions: questionnaires.answeredQuestionnaires.map(
          (q) => q.query.questionnaireCID,
        ),
        combined: [],
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

      const _totalPoints =
        res.length > 0 ? res.reduce((acc, q) => acc + q.points, 0) : undefined;

      setTotalPoints(_totalPoints);
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

  const handleCombinedItemModalAction = useCallback(
    (dataTypes: EWalletDataType[], questionnaires: IpfsCID[]) => {
      if (!combinedItemToHandle) {
        return;
      }
      if (dataTypes.length === 0 && questionnaires.length === 0) {
        if (queryApprovalState) {
          const existingItem = queryApprovalState.combined.find(
            (q) => q.queryId === combinedItemToHandle.queryStatus.queryCID,
          );
          if (existingItem) {
            setQueryApprovalState((p) => {
              if (!p) {
                return p;
              }
              return {
                ...p,
                points: p.points - combinedItemToHandle.queryStatus.points,
                combined: p.combined.filter(
                  (c) =>
                    c.queryId !== combinedItemToHandle.queryStatus.queryCID,
                ),
              };
            });
          }
        }
        setCombinedItemToHandle(undefined);
        return;
      }
      setQueryApprovalState((p) => {
        if (!p) {
          return p;
        }
        const combinedItem = {
          queryId: combinedItemToHandle.queryStatus.queryCID,
          permissions: {
            dataTypes,
            questionnaires,
          },
        };
        const existingItem = p.combined.find(
          (q) => q.queryId === combinedItemToHandle.queryStatus.queryCID,
        );

        return {
          ...p,
          ...(!existingItem && {
            points: p.points + combinedItemToHandle.queryStatus.points,
          }),
          combined: existingItem
            ? p.combined.map((c) =>
                c.queryId === combinedItemToHandle.queryStatus.queryCID
                  ? combinedItem
                  : c,
              )
            : p.combined.concat(combinedItem),
        };
      });
      setCombinedItemToHandle(undefined);
    },
    [combinedItemToHandle, JSON.stringify(queryApprovalState)],
  );

  const onDataPermissionClick = useCallback(
    (queryCID: IpfsCID, dataType: EWalletDataType, itemPoints: number) => {
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
            points: p.points - itemPoints,
            dataPermissions: dataPermissionsCopy,
          };
        }
        return {
          ...p,
          queryIds: [...p.queryIds, queryCID],
          points: p.points + itemPoints,
          dataPermissions: [...p.dataPermissions, dataType],
        };
      });
    },
    [],
  );

  const onQuestionnairePermissionClick = useCallback(
    (queryCID: IpfsCID, questionnaireCID: IpfsCID, itemPoints: number) => {
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
            points: p.points - itemPoints,
            questionnairePermissions: questionnairePermissionsCopy,
          };
        }
        return {
          ...p,
          queryIds: [...p.queryIds, queryCID],
          points: p.points + itemPoints,
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
            if (!q) {
              return q;
            }
            const otherQueriesUsesSameQuestionnaire =
              q.unAnsweredQuestionnaires.filter(
                (q) =>
                  q.query.questionnaireCID ===
                    questionnaireToAnswer.query.questionnaireCID &&
                  q.query.queryStatus.queryCID !==
                    questionnaireToAnswer.query.queryStatus.queryCID,
              );
            return {
              ...q,
              answeredQuestionnaires: [
                ...q.answeredQuestionnaires.concat({
                  query: questionnaireToAnswer.query,
                  questionnaire:
                    answeredQuestionnaire as QuestionnaireWithAnswers,
                }),
                ...otherQueriesUsesSameQuestionnaire.map((q) => ({
                  query: q.query,
                  questionnaire:
                    answeredQuestionnaire as QuestionnaireWithAnswers,
                })),
              ],
              unAnsweredQuestionnaires: q.unAnsweredQuestionnaires.filter(
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
              points: p.points + questionnaireToAnswer.query.queryStatus.points,
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
    const optInParams: IOptInParams = {
      directCall: {
        permissions: {
          dataTypes: queryApprovalState.dataPermissions,
          questionnaires: queryApprovalState.questionnairePermissions,
        },
        approvals: new Map(
          queryApprovalState.queryIds.map((id) => {
            const calculatedParameters: IDynamicRewardParameter[] = [];
            JSON.parse(getRewardParameters(id)).forEach(
              (rp: IDynamicRewardParameter) => {
                calculatedParameters.push({
                  ...rp,
                  recipientAddress: {
                    ...rp.recipientAddress,
                    value: receivingAddress,
                  },
                });
              },
            );
            return [id, calculatedParameters];
          }),
        ),
      },
      withPermissions: new Map(
        queryApprovalState.combined.map((c) => {
          const calculatedParameters: IDynamicRewardParameter[] = [];
          JSON.parse(getRewardParameters(c.queryId)).forEach(
            (rp: IDynamicRewardParameter) => {
              calculatedParameters.push({
                ...rp,
                recipientAddress: {
                  ...rp.recipientAddress,
                  value: receivingAddress,
                },
              });
            },
          );
          return [
            c.queryId,
            {
              permissions: c.permissions,
              rewardParameters: calculatedParameters,
            },
          ];
        }),
      ),
    };

    onOptinClicked(optInParams);
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
              {/* <Box display="flex" alignItems="center" width="fit-content">
                <FooterPointItem
                  icon={
                    invitationData["brandInformation"]?.["image"] ??
                    invitationData.image ??
                    ""
                  }
                  points={queryApprovalState?.points ?? 0}
                />
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
              </Box> */}
            </Box>
            <Box display="flex" alignItems="center" width="fit-content">
              <FooterPointItem
                icon={
                  invitationData["brandInformation"]?.["image"] ??
                  invitationData.image ??
                  ""
                }
                points={queryApprovalState?.points ?? 0}
                totalPoints={totalPoints}
              />
              <Box ml={2} />
              <SDButton
                disabled={!agreementConsented}
                variant="contained"
                color="primary"
                onClick={() => {
                  handleShareClicked();
                }}
              >
                {queryApprovalState?.queryIds.length === 0 &&
                queryApprovalState?.combined.length === 0
                  ? "Accept"
                  : "Share"}
              </SDButton>
            </Box>
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
  }, [
    componentRenderState,
    evmAccounts,
    receivingAddress,
    agreementConsented,
    handleShareClicked,
    JSON.stringify(invitationData),
    totalPoints,
    queryApprovalState?.points,
    queryApprovalState?.queryIds.length === 0,
    queryApprovalState?.combined.length === 0,
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
              componentRenderState === EComponentRenderState.RENDER_AGREEMENT
                ? setComponentRenderState(EComponentRenderState.RENDER_QUERIES)
                : onClose();
            }}
          />
        </Box>
        <Image
          src={brandLogo}
          width={getResponsiveValue({ xs: 72, sm: 120 })}
          height={getResponsiveValue({ xs: 72, sm: 120 })}
        />
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
    componentRenderState,
    getResponsiveValue,
  ]);

  const isQueriesReady = useMemo(() => {
    return (
      !!questionnaires &&
      !!queryStatuses &&
      !!groupedDataTypes &&
      !!queryApprovalState
    );
  }, [questionnaires, queryStatuses, groupedDataTypes, queryApprovalState]);

  // if there is only one questionnaire query -no answered- and no other queries, open the questionnaire directly
  useEffect(() => {
    if (isQueriesReady) {
      if (
        queryStatuses?.multiQuestionQueries.length === 0 &&
        queryStatuses?.virtualQuestionnaireQueries.length === 0 &&
        queryStatuses?.questionnaireQueries.length === 1 &&
        questionnaires?.unAnsweredQuestionnaires.length === 1
      ) {
        setQuestionnaireToAnswer(questionnaires.unAnsweredQuestionnaires[0]);
      }
    }
  }, [isQueriesReady]);

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
                            q.query.queryStatus.points,
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
                                item.queryStatus.points,
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
              {(queryStatuses?.multiQuestionQueries.length ?? 0) > 0 && (
                <PermissionSectionTitle title="Multi-question Queries" />
              )}
              {queryStatuses?.multiQuestionQueries.map((q) => (
                <PermissionItemWithShareButton
                  key={q.queryStatus.queryCID}
                  name={q.queryStatus.name}
                  icon={q.queryStatus.image || ""}
                  point={q.queryStatus.points}
                  pointIcon={
                    invitationData["brandInformation"]?.["image"] ??
                    invitationData.image ??
                    ""
                  }
                  onClick={() => {
                    setCombinedItemToHandle(q);
                  }}
                  active={
                    queryApprovalState?.combined
                      ?.map((c) => c.queryId)
                      .includes(q.queryStatus.queryCID) ?? false
                  }
                />
              ))}
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
          maxWidth={700}
          actionText="Save & Share"
          questionnaire={questionnaireToAnswer.questionnaire}
          onQuestionnaireSubmit={(answers) => {
            onQuestionnaireSubmit(answers);
          }}
        />
      )}
      {combinedItemToHandle && (
        <CombinedQuery
          offer={combinedItemToHandle.queryStatus}
          getQuestionnairesByCids={getQuestionnairesByCids}
          defaultPermissions={
            queryApprovalState?.combined.find(
              (q) => q.queryId === combinedItemToHandle.queryStatus.queryCID,
            )?.permissions
          }
          onPrimaryButtonClick={({ dataTypes, questionnaires }) => {
            handleCombinedItemModalAction(dataTypes, questionnaires);
          }}
          answerQuestionnaire={answerQuestionnaire}
          closeModal={() => {
            setCombinedItemToHandle(undefined);
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
