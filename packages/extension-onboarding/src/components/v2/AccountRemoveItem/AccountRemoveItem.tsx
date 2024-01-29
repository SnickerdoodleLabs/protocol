import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { DeleteIcon } from "@extension-onboarding/components/v2/Icons";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { LinkedAccount } from "@snickerdoodlelabs/objects";
import { abbreviateString } from "@snickerdoodlelabs/shared-components";
import React from "react";
interface IProps {
  account: LinkedAccount;
}
export default ({ account }: IProps) => {
  const { sdlDataWallet } = useDataWalletContext();
  const { setModal } = useLayoutContext();
  const removeAccount = () => {
    sdlDataWallet.account
      .unlinkAccount(account.sourceAccountAddress, account.sourceChain)
      .mapErr((err) => {
        console.log("promise rejected");
      });
  };

  return (
    <DeleteIcon
      color="error"
      onClick={() => {
        setModal({
          modalSelector: EModalSelectors.OTP_MODAL,
          onPrimaryButtonClick: removeAccount,
          customProps: {
            title: "Unlink Account",
            subtitle: "This will permanently disconnect your account.",
            description: (
              <span>
                Are you sure you want to remove account
                <strong>
                  {` ${abbreviateString(account.sourceAccountAddress)} `}
                </strong>
                ? If you are sure, you can continue the process by entering the
                code below.
              </span>
            ),
            actionText: "Confirm",
          },
        });
      }}
    />
  );
};
