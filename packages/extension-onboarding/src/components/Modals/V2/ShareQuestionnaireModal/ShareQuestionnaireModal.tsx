import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, MenuItem } from "@material-ui/core";
import {
  EChain,
  EVMAccountAddress,
  NewQuestionnaireAnswer,
  Questionnaire,
} from "@snickerdoodlelabs/objects";
import {
  CustomSelect,
  FillQuestionnaireModal,
  abbreviateString,
  useSafeState,
  Image,
  SDTypography,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, ReactNode, useEffect, useMemo, useRef } from "react";
export interface IShareQuestionnaireModal {
  questionnaire: Questionnaire;
  onSubmitClicked: (
    answers: NewQuestionnaireAnswer[],
    receivingAddress: EVMAccountAddress,
  ) => void;
  maxWidth?: number;
}

const ShareQuestionnaireModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { linkedAccounts } = useAppContext();
  const { questionnaire, onSubmitClicked } =
    customProps as IShareQuestionnaireModal;
  const [receivingAddress, setReceivingAddress] =
    useSafeState<EVMAccountAddress>();
  const initialAccountRef = useRef<boolean>(false);

  const evmAccounts = useMemo(() => {
    return linkedAccounts
      .filter((account) => account.sourceChain === EChain.EthereumMainnet)
      .map((account) => account.sourceAccountAddress);
  }, [linkedAccounts]);

  useEffect(() => {
    const evmAccounts = linkedAccounts.filter(
      (account) => account.sourceChain === EChain.EthereumMainnet,
    );
    if (evmAccounts.length > 0 && !initialAccountRef.current) {
      setReceivingAddress(
        evmAccounts[0].sourceAccountAddress as EVMAccountAddress,
      );
      initialAccountRef.current = true;
    }
  }, [linkedAccounts]);

  return (
    <FillQuestionnaireModal
      questionnaire={questionnaire}
      actionText={"Save and Share"}
      leftAction={
        receivingAddress && (
          <CustomSelect
            value={receivingAddress}
            onChange={(e) => {
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
          </CustomSelect>
        )
      }
      maxWidth={960}
      onQuestionnaireSubmit={(answers) => {
        onSubmitClicked(answers, receivingAddress!);
        closeModal();
      }}
      open={!!questionnaire}
      onClose={closeModal}
    />
  );
};

export default ShareQuestionnaireModal;
