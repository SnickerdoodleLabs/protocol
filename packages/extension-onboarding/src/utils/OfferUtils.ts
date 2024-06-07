import { EWalletDataType, QueryStatus } from "@snickerdoodlelabs/objects";
import {
  getQueryStatusItemsForRender,
  QueryQuestionType,
  ISingleVirtualQuestionnaireItem,
  ISingleQuestionnaireItem,
  IMultiQuestionItem,
  uiSupportedPermissions,
  EWalletDataTypeGroup,
} from "@snickerdoodlelabs/shared-components";

export const calculateOffers = (queryStatuses: QueryStatus[]) => {
  const items = getQueryStatusItemsForRender(queryStatuses);
  return items.reduce(
    (acc, item) => {
      if (
        item.questionType === QueryQuestionType.SINGLE_VIRTUAL_QUESTIONNAIRE
      ) {
        acc.virtualQuestionnaireQueries.push(
          item as ISingleVirtualQuestionnaireItem,
        );
      } else if (item.questionType === QueryQuestionType.SINGLE_QUESTIONNAIRE) {
        acc.questionnaireQueries.push(item as ISingleQuestionnaireItem);
      } else if (item.questionType === QueryQuestionType.MULTI_QUESTION) {
        acc.multiQuestionQueries.push(item);
      }
      return acc;
    },
    {
      virtualQuestionnaireQueries: [] as ISingleVirtualQuestionnaireItem[],
      questionnaireQueries: [] as ISingleQuestionnaireItem[],
      multiQuestionQueries: [] as IMultiQuestionItem[],
    },
  );
};

export const getGroupedOffersbyDataType = <
  T extends { dataType: EWalletDataType },
>(
  items: T[],
) => {
  return items.reduce((acc, item) => {
    const permission = uiSupportedPermissions.find(
      (permission) => permission.key === item.dataType,
    );
    const groupKey = permission
      ? permission.groupKey
      : EWalletDataTypeGroup.UNKNOWN;

    const group = acc.get(groupKey) || [];
    group.push(item);
    acc.set(groupKey, group);

    return acc;
  }, new Map<EWalletDataTypeGroup, T[]>());
};

export const isAccountLinkingPreemptive = (
  dataType: EWalletDataType | EWalletDataType[],
) => {
  const dataTypes = Array.isArray(dataType) ? dataType : [dataType];
  const walletRelatedDataTypes = uiSupportedPermissions
    .filter((p) => p.groupKey === EWalletDataTypeGroup.WALLET)
    .map((p) => p.key);
  return dataTypes.some((type) => walletRelatedDataTypes.includes(type));
};
