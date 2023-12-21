import Card from "@extension-onboarding/components/v2/Card";
import Container from "@extension-onboarding/components/v2/Container";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { INFT, POAPMetadata } from "@extension-onboarding/objects";
import {
  Box,
  Dialog,
  Grid,
  Slide,
  Toolbar,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import {
  WalletNFT,
  chainConfig,
  SuiNFT,
  EVMNFT,
  SolanaNFT,
  EChainTechnology,
} from "@snickerdoodlelabs/objects";
import {
  CloseButton,
  SDTypography,
  abbreviateString,
  colors,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useMemo } from "react";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: colors.MAINPURPLE900,
    position: "sticky",
    top: 0,
  },
  imageWrapper: {
    aspectRatio: "1/1",
    border: `1px solid ${theme.palette.borderColor}`,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    objectFit: "contain",
  },
  pointer: {
    cursor: "pointer",
  },
}));

interface IPropertyItem {
  label: string;
  value: string;
}
const Property: FC<IPropertyItem> = ({ label, value }) => {
  return (
    <Box
      bgcolor={colors.MAINPURPLE50}
      borderRadius={8}
      display="flex"
      justifyContent="center"
      alignItems="center"
      py={1}
      px={3}
    >
      <SDTypography
        variant="bodyLg"
        fontWeight="medium"
      >{`${label}: ${value}`}</SDTypography>
    </Box>
  );
};

interface IInfoItem {
  label: string;
  value?: string | number;
  renderValue?: () => React.ReactNode;
}
const InfoItem: FC<IInfoItem> = ({ label, value, renderValue }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={1}
    >
      <SDTypography variant="bodyLg" color="textHeading" fontWeight="medium">
        {label}
      </SDTypography>
      {value && (
        <Box maxWidth={150}>
          <SDTypography hideOverflow variant="bodyLg">
            {value}
          </SDTypography>
        </Box>
      )}
      {renderValue && renderValue()}
    </Box>
  );
};

export interface INFTDetailModal {
  item: WalletNFT;
  nftData?: INFT;
  poapMetadata?: POAPMetadata;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NFTDetailModal: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { modalState, closeModal } = useLayoutContext();
  const { customProps } = modalState;
  const { item, nftData, poapMetadata } = customProps as INFTDetailModal;

  const handleCloseModal = () => {
    window.history.back();
    closeModal();
  };

  useEffect(() => {
    const handlePopState = () => {
      closeModal();
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const name = useMemo(() => {
    const _name = nftData?.name ?? item?.name ?? "_";
    return _name ? _name : "_";
  }, [nftData, item]);

  const detailItems = useMemo(() => {
    if (item.type === EChainTechnology.EVM) {
      const _item = item as EVMNFT;

      return (
        <>
          <InfoItem label="Token Standart" value={_item.contractType} />
          <InfoItem label="Token Id" value={_item.tokenId} />
          <InfoItem
            label="Contract Address"
            renderValue={() => (
              <SDTypography
                className={classes.pointer}
                variant="bodyLg"
                color="textInfo"
                fontWeight="medium"
                onClick={() => {
                  window.open(
                    chainConfig
                      .get(_item.chain)
                      ?.explorerURL.replace("/tx/", "/address/")
                      .replace("/extrinsic/", "/account/") + _item.token,
                  );
                }}
              >
                {abbreviateString(_item.token)}
              </SDTypography>
            )}
          />
          {_item.tokenUri && (
            <InfoItem
              label="Token URI"
              renderValue={() => (
                <SDTypography
                  className={classes.pointer}
                  variant="bodyLg"
                  color="textInfo"
                  fontWeight="medium"
                  onClick={() => {
                    window.open(_item.tokenUri);
                  }}
                >
                  {abbreviateString(_item.tokenUri!)}
                </SDTypography>
              )}
            />
          )}
        </>
      );
    }
    if (item.type === EChainTechnology.Solana) {
      const _item = item as SolanaNFT;
      return (
        <>
          <InfoItem
            label="Contract Address"
            renderValue={() => (
              <SDTypography
                className={classes.pointer}
                variant="bodyLg"
                color="textInfo"
                fontWeight="medium"
                onClick={() => {
                  window.open(
                    chainConfig
                      .get(_item.chain)
                      ?.explorerURL.replace("/tx/", "/address/")
                      .replace("/extrinsic/", "/account/") + _item.token,
                  );
                }}
              >
                {abbreviateString(_item.token)}
              </SDTypography>
            )}
          />
          {_item.tokenStandard != null && (
            <InfoItem label="Token Standart" value={_item.tokenStandard} />
          )}
          <InfoItem label="Owner" value={abbreviateString(_item.owner)} />
          <InfoItem
            label="Is Mutable"
            value={abbreviateString(`${_item.isMutable}`)}
          />
        </>
      );
    }
    if (item.type === EChainTechnology.Sui) {
      const _item = item as SuiNFT;
      return (
        <InfoItem
          label="Contract Address"
          value={abbreviateString(_item.token)}
        />
      );
    }
    return <></>;
  }, [item]);

  return (
    <Dialog
      open
      TransitionComponent={Transition}
      fullScreen
      onClose={handleCloseModal}
      disablePortal={true}
      disableEnforceFocus={true}
      PaperProps={{
        style: {
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <Toolbar className={classes.toolbar}>
        <Box
          width="100%"
          display="flex"
          alignItems="flex-start"
          justifyContent="flex-end"
        >
          <CloseButton color={colors.WHITE} onClick={handleCloseModal} />
        </Box>
      </Toolbar>
      <Box mt={{ xs: 2, sm: 8 }} />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box width="100%" className={classes.imageWrapper}>
              <img
                src={
                  nftData?.imageUrl ??
                  "https://storage.googleapis.com/dw-assets/spa/images/placeholder.svg"
                }
                className={classes.image}
              />
            </Box>
            {nftData?.description && (
              <>
                <Box mt={2.5} />
                <Card>
                  <SDTypography
                    variant="titleLg"
                    fontWeight="bold"
                    color="textHeading"
                  >
                    Description
                  </SDTypography>
                  <Box mt={1.5} />
                  <SDTypography variant="titleSm">
                    {nftData?.description}
                  </SDTypography>
                </Card>
              </>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <SDTypography
                variant="headlineMd"
                fontWeight="bold"
                color="textHeading"
              >
                {name}
              </SDTypography>
            </Card>
            <Box mt={2.5} />
            <Card>
              {(poapMetadata?.attributes?.length ?? 0) > 0 ||
                ((nftData?.attributes?.length ?? 0) > 0 && (
                  <>
                    <SDTypography
                      variant="titleLg"
                      fontWeight="bold"
                      color="textHeading"
                    >
                      Properties
                    </SDTypography>
                    <Box mt={1.5} />
                    <Grid container spacing={2}>
                      {(poapMetadata
                        ? poapMetadata?.attributes
                        : nftData?.attributes
                      )?.map((attribute, index) => {
                        return (
                          <Grid item key={index}>
                            <Property
                              label={attribute.trait_type}
                              value={attribute.value || ""}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                    <Box mt={3} />
                  </>
                ))}
              <SDTypography
                variant="titleLg"
                fontWeight="bold"
                color="textHeading"
              >
                Details
              </SDTypography>
              <Box
                mt={3}
                py={2}
                px={3}
                border="1px solid"
                borderColor="borderColor"
                borderRadius={12}
              >
                {nftData?.event?.eventUrl && (
                  <InfoItem
                    label="Event URL"
                    renderValue={() => (
                      <SDTypography
                        className={classes.pointer}
                        variant="bodyLg"
                        color="textInfo"
                        fontWeight="medium"
                        onClick={() => {
                          window.open(nftData?.event?.eventUrl, "_blank");
                        }}
                      >
                        {abbreviateString(nftData?.event?.eventUrl ?? "")}
                      </SDTypography>
                    )}
                  />
                )}
                <InfoItem
                  label="Chain"
                  value={chainConfig.get(item.chain)?.name || ""}
                />
                {detailItems}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Dialog>
  );
};

export default NFTDetailModal;
