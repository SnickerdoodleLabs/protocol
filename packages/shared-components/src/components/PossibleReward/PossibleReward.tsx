import { Box, Grow, Typography, Zoom } from "@material-ui/core";
import { Permissions } from "@shared-components/components/Permissions";
import { EBadgeType } from "@shared-components/objects";
import { useRewardItemsStyles } from "@shared-components/styles/rewardItem";
import {
  EVMContractAddress,
  EWalletDataType,
  PossibleReward,
  QueryTypePermissionMap,
} from "@snickerdoodlelabs/objects";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface IPossibleRewardProps {
  reward: PossibleReward;
  consentContractAddress: EVMContractAddress;
  badgeType?: EBadgeType;
  displayType?: "default" | "compact" | "list";
  onClick?: () => void;
  ipfsBaseUrl: string;
}
export const PossibleRewardComponent = ({
  reward,
  badgeType = EBadgeType.None,
  displayType = "default",
  ipfsBaseUrl,
  onClick = () => {},
}: IPossibleRewardProps) => {
  const rewardItemsClasses = useRewardItemsStyles();
  const [lockHovered, setLockHovered] = useState<boolean>(false);
  const [compactItemHovered, setCompactItemHovered] = useState<boolean>(false);
  const [unlockAnimation, setUnlockAnimation] = useState<boolean>(false);

  const compactItemRef = useRef(null);

  const previousStatus = useRef<EBadgeType>(badgeType);

  const permissions: EWalletDataType[] = useMemo(
    () =>
      reward.estimatedQueryDependencies.map(
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
          src={`${ipfsBaseUrl}${reward.image}`}
        />
      ),
      [displayType],
    );

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
              Claimable - data required
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
          onClick={onClick}
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
              src={`${ipfsBaseUrl}${reward.image}`}
            />
            <Box position="absolute" top={0} zIndex={1}>
              {badgeType === EBadgeType.MorePermissionRequired && (
                <img
                  width={23}
                  height={23}
                  src={
                    "https://storage.googleapis.com/dw-assets/shared/icons/lock.png"
                  }
                />
              )}
              <Zoom in={unlockAnimation} unmountOnExit>
                <img
                  width={23}
                  height={23}
                  src={
                    "https://storage.googleapis.com/dw-assets/shared/icons/unlocked.png"
                  }
                />
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
                      Price:
                    </Typography>
                  </Box>
                  <Permissions
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
          onClick={onClick}
          px={2}
          py={2.5}
        >
          <Box flex={2} display="flex" alignItems="center">
            <Box width={32} mr={1.25}>
              <img
                className={rewardItemsClasses.imgCircle}
                src={`${ipfsBaseUrl}${reward.image}`}
              />
            </Box>
            <Typography className={rewardItemsClasses.listTitle}>
              {reward.name}
            </Typography>
          </Box>
          <Box flex={2}>
            <Permissions
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
        onClick={onClick}
      >
        <Box width="100%" position="relative">
          <img
            className={rewardItemsClasses.img}
            src={`${ipfsBaseUrl}${reward.image}`}
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
                <img
                  width="30%"
                  height="auto"
                  src={
                    "https://storage.googleapis.com/dw-assets/shared/gifs/waiting.gif"
                  }
                />
              </Box>
            )}
            <Zoom in={unlockAnimation} unmountOnExit>
              <img
                height={53}
                style={{ zIndex: 1 }}
                src={
                  "https://storage.googleapis.com/dw-assets/shared/icons/unlocked.png"
                }
              />
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
                <img
                  height={53}
                  style={{ zIndex: 1 }}
                  src={
                    "https://storage.googleapis.com/dw-assets/shared/icons/lock.png"
                  }
                />
                <Grow
                  unmountOnExit
                  in={lockHovered}
                  timeout={{ enter: 500, exit: 200 }}
                >
                  <img
                    style={{ marginLeft: -53 }}
                    height={53}
                    src={
                      "https://storage.googleapis.com/dw-assets/shared/icons/lock-expanded.png"
                    }
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
            rowItemProps={{ width: 20, mr: 0.75 }}
            permissions={permissions}
          />
        </Box>
      </Box>
    );
  };

  return <>{renderComponent()}</>;
};
