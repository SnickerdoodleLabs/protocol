import { Box } from "@material-ui/core";
import { CallMade } from "@material-ui/icons";
import { Image, SDButton, SDCheckbox } from "@shared-components/v2/components";
import { SDTypography } from "@shared-components/v2/components/Typograpy";
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
import React, { FC, memo, useMemo, useRef } from "react";

interface IPermissionsProps {
  onAnswerRequestClick: (questionnaire: Questionnaire) => void;
  answeredQuestionnaires?: QuestionnaireWithAnswers[];
  unAnsweredQuestionnaires?: Questionnaire[];
  dataTypes: EWalletDataType[];
  onDataPermissionClick: (dataType: EWalletDataType) => void;
  onQuestionnairePermissionClick: (questionnaireCID: IpfsCID) => void;
  dataTypePermissions: EWalletDataType[];
  questionnairePermissions: IpfsCID[];
}

const GroupTitle: FC<{ title: string }> = ({ title }) => {
  return (
    <SDTypography
      mt={3}
      mb={2}
      variant="titleSm"
      fontWeight="bold"
      hexColor={colors.GREY500}
    >
      {title}
    </SDTypography>
  );
};

interface IPermissionItemProps {
  icon: string;
  name: string;
}

interface IPermissionItemWithButtonProps extends IPermissionItemProps {
  onClick: () => void;
}
interface IPermissionItemWithShareButtonProps
  extends IPermissionItemWithButtonProps {
  active: boolean;
}
const PermissionItem: FC<IPermissionItemProps> = memo(({ icon, name }) => {
  return (
    <Box display="flex" width="fit-content" alignItems="center">
      <Image src={icon} width={30} height={30} />
      <SDTypography
        variant="titleSm"
        fontWeight="medium"
        hexColor={colors.DARKPURPLE500}
        ml={1.5}
      >
        {name}
      </SDTypography>
    </Box>
  );
});

const PermissionItemWithFillButton: FC<IPermissionItemWithButtonProps> = ({
  icon,
  name,
  onClick,
}) => {
  return (
    <Box
      display="flex"
      mb={1}
      alignItems="center"
      justifyContent="space-between"
      p={1.5}
      bgcolor={colors.WHITE}
      border={`1px solid ${colors.GREY300}`}
      borderRadius={8}
    >
      <PermissionItem icon={icon} name={name} />
      <SDButton onClick={onClick} variant="outlined" endIcon={<CallMade />}>
        Fill
      </SDButton>
    </Box>
  );
};

const PermissionItemWithShareButton: FC<
  IPermissionItemWithShareButtonProps
> = ({ icon, name, onClick, active }) => {
  return (
    <Box
      display="flex"
      mb={1}
      alignItems="center"
      justifyContent="space-between"
      p={1.5}
      border={`1px solid ${colors.GREY300}`}
      bgcolor={colors.WHITE}
      borderRadius={8}
    >
      <PermissionItem icon={icon} name={name} />
      <SDCheckbox
        checked={active}
        onChange={onClick}
        variant="outlined"
        color={colors.MINT500}
        label={
          <SDTypography
            variant="labelLg"
            fontWeight="medium"
            hexColor={active ? colors.WHITE : colors.GREY500}
          >
            Share
          </SDTypography>
        }
      />
    </Box>
  );
};

export const Permissions: FC<IPermissionsProps> = ({
  dataTypes,
  onAnswerRequestClick,
  answeredQuestionnaires,
  unAnsweredQuestionnaires,
  onDataPermissionClick,
  onQuestionnairePermissionClick,
  questionnairePermissions,
  dataTypePermissions,
}) => {
  const dataPermissionsToDisplay = useMemo(() => {
    return getGroupedDataPermissions(dataTypes);
  }, []);

  return (
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
          <GroupTitle title="Questionnaires" />
          {unAnsweredQuestionnaires?.map((questionnaire) => {
            return (
              <PermissionItemWithFillButton
                name={questionnaire.title}
                icon={questionnaire.image || ""}
                onClick={() => onAnswerRequestClick(questionnaire)}
              />
            );
          })}

          {answeredQuestionnaires?.map((questionnaire) => {
            return (
              <PermissionItemWithShareButton
                name={questionnaire.title}
                icon={questionnaire.image || ""}
                onClick={() => onQuestionnairePermissionClick(questionnaire.id)}
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
              <GroupTitle title={DataTypeGroupProperties[groupKey].name} />
              {permissions.map((permission) => {
                return (
                  <PermissionItemWithShareButton
                    name={permission.name}
                    icon={permission.icon}
                    onClick={() => onDataPermissionClick(permission.key)}
                    active={dataTypePermissions.includes(permission.key)}
                  />
                );
              })}
            </div>
          );
        })}
    </>
  );
};
