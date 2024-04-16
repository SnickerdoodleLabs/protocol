import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Delete from "@material-ui/icons/Delete";
import {
  EQueryProcessingStatus,
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
  colors,
  useDialogStyles,
  useSafeState,
  Permissions,
  getGroupedDataPermissions,
  getGroupedDataTypesG,
  getQueryStatusItemsForRender,
  ISingleQuestionnaireItem,
  QueryQuestionType,
  ISingleVirtualQuestionnaireItem,
  IMultiQuestionItem,
  DataTypeGroupProperties,
  SDTypography,
  PointItem,
} from "@snickerdoodlelabs/shared-components";
import { okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
export interface IBrandPermissionsModal {
  consentAddress: EVMContractAddress;
  icon: string;
  brandName: string;
}

interface IAnsweredQuestionnaireWithQuery {
  query: ISingleQuestionnaireItem;
  questionnaire: QuestionnaireWithAnswers;
}
interface IQueryStatusesState {
  virtualQuestionnaireQueries: ISingleVirtualQuestionnaireItem[];
  questionnaireQueries: ISingleQuestionnaireItem[];
  multiQuestionQueries: IMultiQuestionItem[];
}

interface IItemProps {
  name: string;
  brandIcon?: string;
  point: number;
}
const Item: FC<IItemProps> = ({ name, brandIcon, point }) => (
  <Box
    bgcolor={colors.WHITE}
    borderRadius={8}
    mb={1.5}
    border="1px solid"
    borderColor="borderColor"
    p={2}
    display="flex"
    alignItems="center"
    justifyContent="space-between"
  >
    <SDTypography variant="bodyLg" fontWeight="medium">
      {name}
    </SDTypography>
    <PointItem pointIcon={brandIcon} point={point} active />
  </Box>
);

const BrandPermissionsModal: FC = () => {
  const { modalState, closeModal, setLoadingStatus } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { icon, brandName, consentAddress } =
    customProps as IBrandPermissionsModal;
  const classes = useDialogStyles({ maxWidth: 700 });
  const { sdlDataWallet } = useDataWalletContext();
  const [queryStatuses, setQueryStatuses] = useSafeState<IQueryStatusesState>();
  const [questionnaires, setQuestionnaires] =
    useSafeState<IAnsweredQuestionnaireWithQuery[]>();

  const groupedDataTypes = useMemo(() => {
    if (!queryStatuses) {
      return undefined;
    }
    return getGroupedDataTypesG(queryStatuses.virtualQuestionnaireQueries);
  }, [queryStatuses]);

  useEffect(() => {
    getQueryStatuses();
  }, []);

  const getQueryStatuses = () => {
    sdlDataWallet
      .getQueryStatuses(consentAddress, [
        EQueryProcessingStatus.RewardsReceived,
      ])
      .map((statuses) => {
        const items = getQueryStatusItemsForRender(statuses);

        const groupedItems = items.reduce(
          (acc, item) => {
            if (
              item.questionType ===
              QueryQuestionType.SINGLE_VIRTUAL_QUESTIONNAIRE
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

  useEffect(() => {
    if (queryStatuses) {
      fetchQuestionnaires(queryStatuses.questionnaireQueries);
    }
  }, [JSON.stringify(queryStatuses)]);

  const fetchQuestionnaires = (
    questionnaireQueries: ISingleQuestionnaireItem[],
  ) => {
    ResultUtils.combine(
      questionnaireQueries.map((q) =>
        sdlDataWallet.questionnaire
          .getByCIDs([q.questionnaireCID])
          .map((questionnaire) => {
            return questionnaire.length
              ? { questionnaire: questionnaire[0], query: q }
              : null;
          }),
      ),
    ).map((questionnaires) => {
      setQuestionnaires(questionnaires as IAnsweredQuestionnaireWithQuery[]);
    });
  };

  const isReady = useMemo(() => {
    return !!questionnaires && !!queryStatuses && !!groupedDataTypes;
  }, [queryStatuses, questionnaires, groupedDataTypes]);

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
            <>
              {questionnaires!.map(({ query, questionnaire }) => {
                return (
                  <Item
                    key={query.queryStatus.queryCID}
                    brandIcon={icon}
                    point={query.queryStatus.points}
                    name={questionnaire.title}
                  />
                );
              })}
              {queryStatuses!.multiQuestionQueries.map((item) => (
                <Item
                  key={item.queryStatus.queryCID}
                  name={item.queryStatus.name}
                  brandIcon={icon}
                  point={item.queryStatus.points}
                />
              ))}
              {Object.entries(groupedDataTypes!)
                .sort(
                  ([q1, _], [q2, __]) =>
                    DataTypeGroupProperties[q1].order -
                    DataTypeGroupProperties[q2].order,
                )
                .map(([groupKey, groupItems]) => {
                  return (
                    <div key={groupKey}>
                      {groupItems.map((item) => {
                        return (
                          <Item
                            key={item.queryStatus.queryCID}
                            brandIcon={icon}
                            point={item.queryStatus.points}
                            name={item.permission.name}
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
      </DialogContent>
      <DialogActions>
        <Box color={colors.GREY500} display="flex" width="100%">
          <SDButton
            style={{
              marginLeft: -20,
            }}
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
  );
};

export default BrandPermissionsModal;
