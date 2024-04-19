import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import {
  SDButton,
  SDTypography,
  useMedia,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, ReactNode, useMemo } from "react";

interface IStepRendererProps {
  image: string;
  title: ReactNode;
  subtitle?: ReactNode;
  description: ReactNode;
  renderItem?: ReactNode;
  indicators: React.ReactNode;
  onClick: () => void;
  btnText: string;
  btnDisabled?: boolean;
}

const StepRenderer: FC<IStepRendererProps> = ({
  image,
  title,
  subtitle,
  renderItem,
  description,
  indicators,
  onClick,
  btnText,
  btnDisabled,
}) => {
  const media = useMedia();

  if (media === "xs") {
    return (
      <Box
        width="100%"
        minHeight="calc(100vh - 56px)"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection="column"
      >
        <>
          <Box pt={3} />
          <img width="50%" height="auto" src={image} />
          <Box mt={3} />
          <SDTypography
            align="center"
            variant="headlineLg"
            fontFamily="shrikhand"
          >
            {title}
          </SDTypography>
          {subtitle && (
            <SDTypography
              mt={1.5}
              align="center"
              variant="titleLg"
              fontFamily="shrikhand"
            >
              {subtitle}
            </SDTypography>
          )}
          <SDTypography mt={3} align="center" variant="titleMd">
            {description}
          </SDTypography>
          {renderItem && <Box mt={3}>{renderItem}</Box>}
        </>
        <Box
          mt="auto"
          width="100%"
          alignItems={"center"}
          mb={1.5}
          display="flex"
          flexDirection="column"
        >
          {indicators}
          <Box mt={4} />
          <SDButton
            {...(btnDisabled && { disabled: true })}
            fullWidth
            onClick={onClick}
            variant="contained"
            color="primary"
          >
            {btnText}
          </SDButton>
        </Box>
      </Box>
    );
  } else {
    return (
      <>
        <Box pt={8} />
        <Grid container>
          <Grid item xs={7}>
            <Box mt={4}>
              {indicators}
              <Box mt={4} />
              <SDTypography variant="displayLg" fontFamily="shrikhand">
                {title}
              </SDTypography>

              {subtitle && (
                <SDTypography
                  mt={1}
                  variant="headlineSm"
                  fontFamily="shrikhand"
                >
                  {subtitle}
                </SDTypography>
              )}
              <Box mt={4} />
              <SDTypography variant="titleMd">{description}</SDTypography>
              {renderItem && <Box mt={3}>{renderItem}</Box>}
              <Box mt={6} />
              <SDButton
                {...(btnDisabled && { disabled: true })}
                onClick={onClick}
                variant="contained"
                color="primary"
              >
                {btnText}
              </SDButton>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <Box width="100%" display="flex" justifyContent="center">
              <img width="100%" height="auto" src={image} />
            </Box>
          </Grid>
        </Grid>
      </>
    );
  }
};

export default StepRenderer;
