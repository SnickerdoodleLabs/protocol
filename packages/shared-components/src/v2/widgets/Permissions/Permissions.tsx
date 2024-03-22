import {
  PermissionItemWithFillButton,
  PermissionItemWithShareButton,
  PermissionSectionTitle,
  SDTypography,
} from "@shared-components/v2/components";
import {
  DataTypeGroupProperties,
  getGroupedDataPermissions,
} from "@shared-components/v2/constants";
import { colors } from "@shared-components/v2/theme";
import {
  EWalletDataType,
  IpfsCID,
  Questionnaire,
  QuestionnaireWithAnswers,
} from "@snickerdoodlelabs/objects";
import React, { FC, useMemo } from "react";

interface IPermissionsProps {
  onAnswerRequestClick: (questionnaire: Questionnaire) => void;
  answeredQuestionnaires: QuestionnaireWithAnswers[];
  unAnsweredQuestionnaires: Questionnaire[];
  dataTypes: EWalletDataType[];
  onDataPermissionClick: (dataType: EWalletDataType) => void;
  onQuestionnairePermissionClick: (questionnaireCID: IpfsCID) => void;
  dataTypePermissions: EWalletDataType[];
  questionnairePermissions: IpfsCID[];
  useCheckboxOnly?: boolean;
}

export const Permissions: FC<IPermissionsProps> = ({
  dataTypes,
  onAnswerRequestClick,
  answeredQuestionnaires,
  unAnsweredQuestionnaires,
  onDataPermissionClick,
  onQuestionnairePermissionClick,
  questionnairePermissions,
  dataTypePermissions,
  useCheckboxOnly,
}) => {
  const dataPermissionsToDisplay = useMemo(() => {
    return getGroupedDataPermissions(dataTypes);
  }, []);

  const isEmpty = useMemo(() => {
    return (
      [...answeredQuestionnaires, ...unAnsweredQuestionnaires, ...dataTypes]
        .length === 0
    );
  }, [answeredQuestionnaires, unAnsweredQuestionnaires, dataTypes]);

  return (
    <>
      {isEmpty ? null : (
        <>
          <SDTypography
            mb={1}
            variant="bodyMd"
            hexColor={colors.GREY600}
            align="center"
          >
            Check off the items you are willing to <b>share anonymously</b> with
            them to continue
          </SDTypography>
          {((answeredQuestionnaires?.length ?? 0) > 0 ||
            (unAnsweredQuestionnaires?.length ?? 0) > 0) && (
            <>
              <PermissionSectionTitle title="Questionnaires" />
              {unAnsweredQuestionnaires.map((questionnaire) => {
                return (
                  <PermissionItemWithFillButton
                    key={questionnaire.id}
                    name={questionnaire.title}
                    icon={questionnaire.image || ""}
                    onClick={() => onAnswerRequestClick(questionnaire)}
                  />
                );
              })}

              {answeredQuestionnaires.map((questionnaire) => {
                return (
                  <PermissionItemWithShareButton
                    key={questionnaire.id}
                    name={questionnaire.title}
                    icon={questionnaire.image || ""}
                    onClick={() =>
                      onQuestionnairePermissionClick(questionnaire.id)
                    }
                    active={questionnairePermissions.includes(questionnaire.id)}
                  />
                );
              })}
            </>
          )}
          {Object.entries(dataPermissionsToDisplay)
            .sort(
              ([q1, _], [q2, __]) =>
                DataTypeGroupProperties[q1].order -
                DataTypeGroupProperties[q2].order,
            )
            .map(([groupKey, permissions]) => {
              return (
                <div key={groupKey}>
                  <PermissionSectionTitle
                    title={DataTypeGroupProperties[groupKey].name}
                  />
                  {permissions.map((permission) => {
                    return (
                      <PermissionItemWithShareButton
                        key={permission.key}
                        name={permission.name}
                        icon={permission.icon}
                        onClick={() => onDataPermissionClick(permission.key)}
                        active={dataTypePermissions.includes(permission.key)}
                        useCheckboxOnly={useCheckboxOnly}
                      />
                    );
                  })}
                </div>
              );
            })}
        </>
      )}
    </>
  );
};
