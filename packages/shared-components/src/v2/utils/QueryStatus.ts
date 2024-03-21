import {
  EWalletDataType,
  IpfsCID,
  JSONString,
  QueryStatus,
} from "@snickerdoodlelabs/objects";

export enum QueryQuestionType {
  SINGLE_VIRTUAL_QUESTIONNAIRE = "SINGLE_VIRTUAL_QUESTIONNAIRE",
  SINGLE_QUESTIONNAIRE = "SINGLE_QUESTIONNAIRE",
  MULTI_QUESTION = "MULTI_QUESTION",
}

export interface IQueryItem {
  questionType: QueryQuestionType;
  queryCID: IpfsCID;
  queryStatus: QueryStatus;
}

export interface ISingleQuestionnaireItem extends IQueryItem {
  cid: IpfsCID;
}

export interface ISingleVirtualQuestionnaireItem extends IQueryItem {
  dataType: EWalletDataType;
}
export interface IMultiQuestionItem extends IQueryItem {}

export const getQueryStatusItemForRender = (
  queryStatus: QueryStatus,
):
  | ISingleQuestionnaireItem
  | ISingleVirtualQuestionnaireItem
  | IMultiQuestionItem => {
  const {
    virtualQuestionnaires: vq,
    questionnaires: q,
    queryCID,
  } = queryStatus;
  if (vq.length === 1 && q.length === 0) {
    return {
      questionType: QueryQuestionType.SINGLE_VIRTUAL_QUESTIONNAIRE,
      queryStatus,
      queryCID,
      dataType: vq[0],
    } as ISingleVirtualQuestionnaireItem;
  }
  if (vq.length === 0 && q.length === 1) {
    return {
      questionType: QueryQuestionType.SINGLE_QUESTIONNAIRE,
      queryCID,
      queryStatus,
      cid: q[0],
    } as ISingleQuestionnaireItem;
  }
  return {
    questionType: QueryQuestionType.MULTI_QUESTION,
    queryCID,
    queryStatus,
  } as IMultiQuestionItem;
};

export const getQueryStatusItemsForRender = (statuses: QueryStatus[]) => {
  return statuses.map((status) => getQueryStatusItemForRender(status));
};
