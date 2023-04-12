import lockExpandedIcon from "@extension-onboarding/assets/icons/lock-expanded.png";
import lockIcon from "@extension-onboarding/assets/icons/lock.png";
import unlockedIcon from "@extension-onboarding/assets/icons/unlocked.png";
import waitingIcon from "@extension-onboarding/assets/icons/waiting.png";
import availableBadge from "@extension-onboarding/assets/images/badge-available.svg";
import permissionRequiredBadge from "@extension-onboarding/assets/images/badge-permission-required.svg";
import waitingBadge from "@extension-onboarding/assets/images/badge-waiting.svg";
import Permissions from "@extension-onboarding/components/Permissions";
import { useStyles } from "@extension-onboarding/components/RewardItems/PossibleReward/PossibleReward.style";
import { useRewardItemsStyles } from "@extension-onboarding/components/RewardItems/RewardItems.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { EBadgeType } from "@extension-onboarding/objects";
import {
  Box,
  Collapse,
  Fade,
  Grow,
  Slide,
  Typography,
  Zoom,
} from "@material-ui/core";
import {
  EVMContractAddress,
  EWalletDataType,
  PossibleReward,
  QueryTypePermissionMap,
} from "@snickerdoodlelabs/objects";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

interface IPossibleRewardProps {
  reward: PossibleReward;
  consentContractAddress: EVMContractAddress;
  badgeType?: EBadgeType;
  displayType?: "default" | "compact" | "list";
}
export default ({
  reward,
  consentContractAddress,
  badgeType = EBadgeType.None,
  displayType = "default",
}: IPossibleRewardProps) => {
  const { apiGateway } = useAppContext();
  const classes = useStyles();
  const rewardItemsClasses = useRewardItemsStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [lockHovered, setLockHovered] = useState<boolean>(false);
  const [compactItemHovered, setCompactItemHovered] = useState<boolean>(false);
  const [unlockAnimation, setUnlockAnimation] = useState<boolean>(false);

  const compactItemRef = useRef(null);

  const previousStatus = useRef<EBadgeType>(badgeType);

  const permissions: EWalletDataType[] = useMemo(
    () =>
      reward.queryDependencies.map(
        (dependency) => QueryTypePermissionMap.get(dependency)!,
      ),
    [reward],
  );

  useEffect(() => {
    if (unlockAnimation) {
      setTimeout(() => {
        setUnlockAnimation(false);
      }, 500);
    }
  }, [unlockAnimation]);

  useEffect(() => {
    if (
      badgeType === EBadgeType.Available &&
      previousStatus.current === EBadgeType.MorePermissionRequired
    ) {
      setUnlockAnimation(true);
    }
    previousStatus.current = badgeType;
  }, [badgeType]);

  const image = () =>
    useMemo(
      () => (
        <img
          className={
            displayType === "list"
              ? rewardItemsClasses.imgCircle
              : displayType === "compact"
              ? rewardItemsClasses.imgCompactItem
              : rewardItemsClasses.img
          }
          src={`${apiGateway.config.ipfsFetchBaseUrl}${reward.image}`}
        />
      ),
      [displayType],
    );

  const getBadgeImageSrc = () => {
    switch (true) {
      case badgeType === EBadgeType.MorePermissionRequired:
        return permissionRequiredBadge;
      case badgeType === EBadgeType.Waiting:
        return waitingBadge;
      default:
        return null;
    }
  };

  const getAvailability = () => {
    switch (true) {
      case badgeType === EBadgeType.MorePermissionRequired:
        return (
          <Box
            width="fit-content"
            bgcolor="#FDEFEF"
            px={1}
            py={0.5}
            borderRadius={4}
          >
            <Typography className={rewardItemsClasses.listPermissionRequired}>
              Data Permission Needed
            </Typography>
          </Box>
        );
      case badgeType === EBadgeType.Available:
        return (
          <Box
            width="fit-content"
            bgcolor="#F3FCEF"
            px={1}
            py={0.5}
            borderRadius={4}
          >
            <Typography className={rewardItemsClasses.listAvailable}>
              Available
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  const renderComponent = () => {
    if (displayType === "compact") {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          border="0.847302px solid rgba(22, 22, 26, 0.08)"
          py={0.75}
          px={0.25}
          borderRadius={16}
          onClick={() => {
            navigate(`${pathname}/reward-detail`, {
              state: {
                consentContractAddress,
                reward,
              },
            });
          }}
        >
          <Box
            width="100%"
            position="relative"
            onMouseEnter={() => {
              setCompactItemHovered(true);
            }}
            onMouseLeave={() => {
              setCompactItemHovered(false);
            }}
          >
            <img
              ref={compactItemRef}
              className={rewardItemsClasses.imgCompactItem}
              src={`${apiGateway.config.ipfsFetchBaseUrl}${reward.image}`}
            />
            <Box position="absolute" top={0} zIndex={1}>
              {badgeType === EBadgeType.MorePermissionRequired && (
                <img width={23} height={23} src={lockIcon} />
              )}
              <Zoom in={unlockAnimation} unmountOnExit>
                <img width={23} height={23} src={unlockedIcon} />
              </Zoom>
            </Box>
            <Box
              position="absolute"
              width="100%"
              display="flex"
              height="100%"
              zIndex={2}
              top={0}
            >
              <Zoom in={compactItemHovered}>
                <Box
                  borderRadius={8}
                  width="100%"
                  display="flex"
                  flexDirection="column"
                  bgcolor="#000000DD"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <Box mb={1}>
                    <Typography className={rewardItemsClasses.compactItemPrice}>
                      Rent Your:
                    </Typography>
                  </Box>
                  <Permissions
                    displayType="row"
                    rowItemProps={{ width: 18, mr: 0.75 }}
                    permissions={permissions}
                  />
                </Box>
              </Zoom>
            </Box>
          </Box>
          <Typography className={rewardItemsClasses.compactTitle}>
            {reward.name}
          </Typography>
        </Box>
      );
    }
    if (displayType === "list") {
      return (
        <Box
          display="flex"
          borderBottom="1px solid #f0f0f0"
          alignItems="center"
          onClick={() => {
            navigate(`${pathname}/reward-detail`, {
              state: {
                consentContractAddress,
                reward,
              },
            });
          }}
          px={2}
          py={2.5}
        >
          <Box flex={2} display="flex" alignItems="center">
            <Box width={32} mr={1.25}>
              <img
                className={rewardItemsClasses.imgCircle}
                src={`${apiGateway.config.ipfsFetchBaseUrl}${reward.image}`}
              />
            </Box>
            <Typography className={rewardItemsClasses.listTitle}>
              {reward.name}
            </Typography>
          </Box>
          <Box flex={2}>
            <Permissions
              displayType="row"
              rowItemProps={{ width: 31, mr: 1.25 }}
              permissions={permissions}
            />
          </Box>
          <Box flex={1}>{getAvailability()}</Box>
        </Box>
      );
    }

    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        border="0.847302px solid rgba(22, 22, 26, 0.08)"
        {...(badgeType === EBadgeType.MorePermissionRequired && {
          boxShadow: "inset 0px 4px 250px rgba(0, 0, 0, 0.25)",
        })}
        p={1}
        borderRadius={14}
        onClick={() => {
          navigate(`${pathname}/reward-detail`, {
            state: {
              consentContractAddress,
              reward,
            },
          });
        }}
      >
        <Box width="100%" position="relative">
          <img
            className={rewardItemsClasses.img}
            src={`${apiGateway.config.ipfsFetchBaseUrl}${reward.image}`}
          />
          <Box
            position="absolute"
            width="100%"
            height="100%"
            zIndex={1}
            top={0}
          >
            {badgeType === EBadgeType.Waiting && (
              <Box
                zIndex={1}
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <img width="30%" height="auto" src={waitingIcon} />
              </Box>
            )}
            <Zoom in={unlockAnimation} unmountOnExit>
              <img height={53} style={{ zIndex: 1 }} src={unlockedIcon} />
            </Zoom>

            {badgeType === EBadgeType.MorePermissionRequired && (
              <Box
                display="flex"
                onMouseEnter={() => {
                  setLockHovered(true);
                }}
                onMouseLeave={() => {
                  setLockHovered(false);
                }}
              >
                <img height={53} style={{ zIndex: 1 }} src={lockIcon} />
                <Grow
                  unmountOnExit
                  in={lockHovered}
                  timeout={{ enter: 500, exit: 200 }}
                >
                  <img
                    style={{ marginLeft: -53 }}
                    height={53}
                    src={lockExpandedIcon}
                  />
                </Grow>
              </Box>
            )}
          </Box>
        </Box>
        <Box mb={0.75} display="flex" flexDirection="column">
          <Typography className={rewardItemsClasses.title}>
            {reward.name}
          </Typography>
        </Box>
        <Box
          py={0.75}
          px={1.5}
          bgcolor="rgba(22, 22, 26, 0.04)"
          borderRadius={10}
        >
          <Box mb={0.5}>
            <Typography className={rewardItemsClasses.priceTitle}>
              Price:
            </Typography>
          </Box>
          <Permissions
            displayType="row"
            rowItemProps={{ width: 20, mr: 0.75 }}
            permissions={permissions}
          />
        </Box>
      </Box>
    );
  };

  return <>{renderComponent()}</>;
};
