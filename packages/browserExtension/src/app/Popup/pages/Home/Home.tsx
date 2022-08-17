import React, { FC, useEffect, useState } from "react";
import { Box, LinearProgress, Typography } from "@material-ui/core";
import { useStyles } from "@app/Popup/pages/Home/Home.style";
import { useAppContext } from "@app/Popup/context";
import {
  EmailAddressString,
  FamilyName,
  GivenName,
} from "@snickerdoodlelabs/objects";
import Browser from "webextension-polyfill";
import { PRIVACY_POLICY_URL, SPA_PATHS } from "@app/Popup/constants";
import LinkCard from "@app/Popup/pages/Home/components/LinkCard";

interface IUserInfo {
  givenName: GivenName | null;
  familyName: FamilyName | null;
  email: EmailAddressString | null;
}

const initialValues: IUserInfo = {
  givenName: GivenName(""),
  familyName: FamilyName(""),
  email: EmailAddressString(""),
};

const Home: FC = () => {
  const classes = useStyles();
  const { coreGateway, config } = useAppContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<IUserInfo>(initialValues);

  useEffect(() => {
    getBasicUserInfo();
  }, []);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [JSON.stringify(userInfo), isLoading]);

  const getBasicUserInfo = () => {
    coreGateway
      .getGivenName()
      .andThen((givenName) =>
        coreGateway.getFamilyName().andThen((familyName) =>
          coreGateway.getEmail().map((email) => {
            setUserInfo({ givenName, familyName, email });
          }),
        ),
      )
      .mapErr((e) => {
        setIsLoading(false);
      });
  };

  return (
    <Box px={4}>
      <Box mt={5}>
        {isLoading ? (
          <>
            <LinearProgress />
            <LinearProgress />
          </>
        ) : (
          <>
            <Typography className={classes.nameTx}>{`Welcome ${
              userInfo.givenName ? userInfo.givenName : ""
            } ${userInfo.familyName ? userInfo.familyName : ""}`}</Typography>
            <Typography className={classes.emailTx}>
              {userInfo.email}
            </Typography>
          </>
        )}
      </Box>
      <Box mt={5}>
        <Typography className={classes.title}>Manage Your Data</Typography>
        <LinkCard
          navigateTo={SPA_PATHS.profile}
          icon={Browser.runtime.getURL("assets/icons/profile.svg")}
          title="Personal Info"
        />
        <LinkCard
          navigateTo={SPA_PATHS.onChain}
          icon={Browser.runtime.getURL("assets/icons/on-chain.svg")}
          title="On Chain Info"
        />
        <LinkCard
          navigateTo={SPA_PATHS.rewards}
          icon={Browser.runtime.getURL("assets/icons/reward.svg")}
          title="Rewards"
        />
      </Box>
      <Box mt={5}>
        <Typography
          className={classes.link}
          onClick={() => {
            window.open(PRIVACY_POLICY_URL, "_blank");
          }}
        >
          Privacy Policy
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
