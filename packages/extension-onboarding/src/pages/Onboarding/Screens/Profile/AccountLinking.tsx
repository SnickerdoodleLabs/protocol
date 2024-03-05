import { Wallet } from "@extension-onboarding/components/v2/LinkedAccountItem";
import { WalletMenu } from "@extension-onboarding/components/v2/LinkingAccountMenu";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box } from "@material-ui/core";
import {
  SDButton,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, Fragment } from "react";

interface IAccountLinkingProps {
  onComplete: () => void;
}

const AccountLinking: FC<IAccountLinkingProps> = ({ onComplete }) => {
  const { linkedAccounts } = useAppContext();
  const getResponsiveValue = useResponsiveValue();
  return (
    <>
      <WalletMenu />
      {linkedAccounts.length > 0 && (
        <>
          <Box mt={{ xs: 2.5, sm: 4 }} />
          {linkedAccounts.map((account, index) => (
            <Fragment key={index}>
              <Wallet account={account} key={index} />
              {index !== linkedAccounts.length - 1 && (
                <Box mt={{ xs: 1.5, sm: 3 }} />
              )}
            </Fragment>
          ))}
        </>
      )}
      <Box mt="auto">
        <Box mt={{ xs: 2, sm: 6 }}>
          <SDButton
            variant={linkedAccounts.length > 0 ? "contained" : "outlined"}
            fullWidth={getResponsiveValue({ xs: true, sm: false })}
            color="primary"
            onClick={() => {
              onComplete();
            }}
          >
            {linkedAccounts.length > 0 ? "Next" : "Skip"}
          </SDButton>
        </Box>
      </Box>
    </>
  );
};

export default AccountLinking;
