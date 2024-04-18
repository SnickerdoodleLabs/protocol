import Box from "@material-ui/core/Box";
import CallMade from "@material-ui/icons/CallMade";
import Skeleton from "@material-ui/lab/Skeleton";
import { SDButton } from "@shared-components/v2/components/Button";
import { SDCheckbox } from "@shared-components/v2/components/Checkbox";
import { Image } from "@shared-components/v2/components/Image";
import { SDTypography } from "@shared-components/v2/components/Typograpy";
import { colors } from "@shared-components/v2/theme";
import React, { FC, memo } from "react";

export const PermissionSectionTitle: FC<{ title: string }> = ({ title }) => {
  return (
    <SDTypography
      mt={3}
      mb={2}
      variant="titleSm"
      fontWeight="bold"
      hexColor={colors.GREY500}
    >
      {title}
    </SDTypography>
  );
};

interface IPermissionItemProps {
  icon: string;
  name: string;
}

interface IPermissionItemWithButtonProps extends IPermissionItemProps {
  onClick: () => void;
  pointIcon?: string;
  point?: number;
}
interface IPermissionItemWithShareButtonProps
  extends IPermissionItemWithButtonProps {
  active: boolean;
  useCheckboxOnly?: boolean;
}

interface IPointItemProps {
  pointIcon?: string;
  point?: number;
  active?: boolean;
}

export const PointItem: FC<IPointItemProps> = ({
  point,
  pointIcon,
  active = false,
}) => {
  if (!point) return null;
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="fit-content"
      pl={0.75}
      pr={1.5}
      py={0.75}
      bgcolor={active ? colors.MINT50 : colors.GREY100}
      borderRadius={20}
    >
      <Image
        src={pointIcon || ""}
        errorImageSrc="https://storage.googleapis.com/dw-assets/spa/icons-v2/default-point.svg"
        width={20}
        height={20}
        style={{ borderRadius: 10 }}
      />
      <SDTypography
        variant="titleSm"
        fontWeight="bold"
        hexColor={active ? colors.MINT500 : colors.GREY500}
        ml={0.5}
      >
        {point}
      </SDTypography>
    </Box>
  );
};

const PermissionItem: FC<IPermissionItemProps> = memo(({ icon, name }) => {
  return (
    <Box display="flex" width="fit-content" alignItems="center">
      <Image src={icon} width={30} height={30} />
      <SDTypography
        variant="titleSm"
        fontWeight="medium"
        hexColor={colors.DARKPURPLE500}
        ml={1.5}
      >
        {name}
      </SDTypography>
    </Box>
  );
});

export const PermissionItemWithFillButton: FC<
  IPermissionItemWithButtonProps
> = ({ icon, name, onClick, point, pointIcon }) => {
  return (
    <Box
      display="flex"
      mb={1}
      alignItems="center"
      justifyContent="space-between"
      p={1.5}
      bgcolor={colors.WHITE}
      border={`1px solid ${colors.GREY300}`}
      borderRadius={8}
    >
      <PermissionItem icon={icon} name={name} />
      <Box display="flex" width="fit-content" gridGap={12} alignItems="center">
        <PointItem point={point} pointIcon={pointIcon} />
        <SDButton onClick={onClick} variant="outlined" endIcon={<CallMade />}>
          Fill
        </SDButton>
      </Box>
    </Box>
  );
};

export const PermissionItemLoading: FC = () => {
  return (
    <Box
      display="flex"
      mb={1}
      alignItems="center"
      justifyContent="space-between"
      p={1.5}
      bgcolor={colors.WHITE}
      border={`1px solid ${colors.GREY300}`}
      borderRadius={8}
    >
      <Box display="flex" width="fit-content" alignItems="center">
        <Skeleton variant="rect" width={30} height={30} />
        <SDTypography
          variant="titleSm"
          fontWeight="medium"
          hexColor={colors.DARKPURPLE500}
          ml={1.5}
        >
          <Skeleton width={100} />
        </SDTypography>
      </Box>
      <Box display="flex" width="fit-content" gridGap={12} alignItems="center">
        <Skeleton
          variant="rect"
          width={60}
          height={32}
          style={{
            borderRadius: 20,
          }}
        />
      </Box>
    </Box>
  );
};

export const PermissionItemWithShareButton: FC<
  IPermissionItemWithShareButtonProps
> = ({ icon, name, onClick, active, point, pointIcon, useCheckboxOnly }) => {
  return (
    <Box
      display="flex"
      mb={1}
      alignItems="center"
      justifyContent="space-between"
      p={1.5}
      border={`1px solid ${colors.GREY300}`}
      bgcolor={colors.WHITE}
      borderRadius={8}
    >
      <PermissionItem icon={icon} name={name} />
      <Box display="flex" width="fit-content" gridGap={12} alignItems="center">
        <PointItem point={point} pointIcon={pointIcon} active={active} />
        <SDCheckbox
          checked={active}
          onChange={onClick}
          color={colors.MINT500}
          {...(!useCheckboxOnly && {
            variant: "outlined",
            label: (
              <SDTypography
                variant="labelLg"
                fontWeight="medium"
                hexColor={active ? colors.WHITE : colors.GREY500}
              >
                Share
              </SDTypography>
            ),
          })}
        />
      </Box>
    </Box>
  );
};
