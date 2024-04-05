import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@material-ui/core";
import {
  CloseButton,
  Image,
  SDButton,
  SDTypography,
} from "@shared-components/v2/components";
import { QuestionnaireForm } from "@shared-components/v2/components/QuestionnaireForm";
import { useResponsiveValue } from "@shared-components/v2/hooks";
import { useDialogStyles } from "@shared-components/v2/styles";
import {
  NewQuestionnaireAnswer,
  Questionnaire,
} from "@snickerdoodlelabs/objects";
import React, { FC, ReactNode } from "react";

interface IFillQuestionnaireModalProps {
  questionnaire: Questionnaire;
  onQuestionnaireSubmit: (answers: NewQuestionnaireAnswer[]) => void;
  open: boolean;
  onClose: () => void;
  actionText?: string;
  leftAction?: ReactNode;
  maxWidth?: number;
}
export const FillQuestionnaireModal: FC<IFillQuestionnaireModalProps> = ({
  open,
  onClose,
  questionnaire,
  onQuestionnaireSubmit,
  actionText = "Save to Vault",
  leftAction,
  maxWidth = 960,
}) => {
  const dialogClasses = useDialogStyles({ maxWidth });
  const getResponsiveValue = useResponsiveValue();

  return (
    <Dialog
      fullWidth
      open={open}
      disablePortal
      onClose={onClose}
      className={dialogClasses.dialog}
    >
      <DialogTitle>
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box
            display="flex"
            gridGap={24}
            width="fit-content"
            alignItems="center"
          >
            <Image
              width={getResponsiveValue({ xs: 32, sm: 72 })}
              height={getResponsiveValue({ xs: 32, sm: 72 })}
              style={{
                borderRadius: 8,
              }}
              src={questionnaire.image ?? ""}
            />
            <Box>
              <SDTypography variant="titleMd" fontWeight="bold">
                {questionnaire.title}
              </SDTypography>
              {questionnaire.description && (
                <SDTypography mt={2} variant="titleSm">
                  {questionnaire.description}
                </SDTypography>
              )}
            </Box>
          </Box>
          <Box>
            <CloseButton onClick={onClose} />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          margin="auto"
          p={{ xs: 2, sm: 4 }}
          pt={{ xs: 3, sm: 4 }}
          bgcolor={"cardBgColor"}
          borderRadius={8}
          borderColor="borderColor"
          border="1px solid"
        >
          <QuestionnaireForm
            questionnaire={questionnaire}
            onSubmit={onQuestionnaireSubmit}
            renderItem={(text, input, isLast) => (
              <>
                <Box py={4}>
                  {text}
                  <Box mt={2.5} />
                  {input}
                </Box>
                {!isLast && <Divider />}
              </>
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Box width="100%" display="flex" alignItems="center">
          {leftAction && leftAction}
          <Box marginLeft="auto">
            <SDButton type="submit" form="questionnarie">
              {actionText}
            </SDButton>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
