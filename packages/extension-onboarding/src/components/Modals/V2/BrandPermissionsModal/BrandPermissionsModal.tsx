import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Delete } from "@material-ui/icons";

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import {
  EVMContractAddress,
  EWalletDataType,
  IpfsCID,
  Questionnaire,
} from "@snickerdoodlelabs/objects";
import {
  CloseButton,
  Image,
  SDButton,
  SDTypography,
  colors,
  ffSupportedPermissions,
  useDialogStyles,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";
import { Permissions } from "@snickerdoodlelabs/shared-components";
export interface IBrandPermissionsModal {
  consentAddress: EVMContractAddress;
  icon: string;
  brandName: string;
  dataTypes: EWalletDataType[];
  questionnaireCIDs: IpfsCID[];
}

const QuestionnaireModal: FC = () => {
  const { modalState, closeModal, setLoadingStatus } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { icon, brandName, dataTypes, questionnaireCIDs, consentAddress } =
    customProps as IBrandPermissionsModal;
  const classes = useDialogStyles();
  const { sdlDataWallet } = useDataWalletContext();

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
          <Permissions
            onAnswerRequestClick={function (
              questionnaire: Questionnaire,
            ): void {
              throw new Error("Function not implemented.");
            }}
            dataTypes={ffSupportedPermissions}
            onDataPermissionClick={function (dataType: EWalletDataType): void {
              throw new Error("Function not implemented.");
            }}
            onQuestionnairePermissionClick={function (
              questionnaireCID: IpfsCID,
            ): void {
              throw new Error("Function not implemented.");
            }}
            dataTypePermissions={[]}
            questionnairePermissions={[]}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Box color={colors.GREY500} display="flex" width="100%">
          <SDButton
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

export default QuestionnaireModal;
