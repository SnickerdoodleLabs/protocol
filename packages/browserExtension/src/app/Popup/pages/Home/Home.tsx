import React, { FC, useEffect, useState } from "react";
import { Box, Button, LinearProgress, Typography } from "@material-ui/core";
import { useStyles } from "@app/Popup/pages/Home/Home.style";
import { useAppContext } from "@app/Popup/context";
import { ResultUtils } from "neverthrow-result-utils";
import { okAsync } from "neverthrow";
import {
  EmailAddressString,
  FamilyName,
  GivenName,
} from "@snickerdoodlelabs/objects";
import Browser from "webextension-polyfill";

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
    ResultUtils.combine([
      coreGateway.getGivenName(),
      coreGateway.getFamilyName(),
      coreGateway.getEmail(),
    ])
      .mapErr((e) => {
        setIsLoading(false);
        return e;
      })
      .map(([givenName, familyName, email]) => {
        setUserInfo({ givenName, familyName, email });
      });
  };

  interface IItemProps {
    navigateTo: string;
    icon: string;
    title: string;
  }
  const NavigatorItem = ({ navigateTo, icon, title }: IItemProps) => {
    const navigate = () => {
      window.open(
        `${config.getConfig().onboardingUrl}?${navigateTo}`,
        "_blank",
      );
    };
    return (
      <Box
        onClick={navigate}
        mt={3}
        display="flex"
        alignItems="center"
        height="60px"
        borderRadius={8}
        border=" 1px solid #ECECEC"
      >
        <Box ml={1}>
          <img src={icon} />
        </Box>

        <Typography>{title}</Typography>
        <Box mr={2} marginLeft="auto">
          <img src={Browser.runtime.getURL("assets/icons/arrow.svg")} />
        </Box>
      </Box>
    );
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
        <NavigatorItem
          navigateTo="profile"
          icon={Browser.runtime.getURL("assets/icons/profile.svg")}
          title="Personal Info"
        />
        <NavigatorItem
          navigateTo="on-chain"
          icon={Browser.runtime.getURL("assets/icons/on-chain.svg")}
          title="On Chain Info"
        />
        <NavigatorItem
          navigateTo="rewards"
          icon={Browser.runtime.getURL("assets/icons/reward.svg")}
          title="Rewards"
        />
      </Box>
      <Box mt={5}>
        <Typography
          className={classes.link}
          onClick={() => {
            window.open(
              "https://policy.snickerdoodle.com/snickerdoodle-labs-data-privacy-policy",
              "_blank",
            );
          }}
        >
          Privacy Policy
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
