import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import  MenuItem from "@material-ui/core/MenuItem";
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
  AccountMenuItem,
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
      .map((account) => account.sourceAccountAddress) as EVMAccountAddress[];
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
                <AccountMenuItem account={account} />
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
