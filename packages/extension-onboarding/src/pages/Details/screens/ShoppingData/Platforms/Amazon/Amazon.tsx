import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { PurchasedProduct } from "@snickerdoodlelabs/objects";
import React, { FC, memo, useEffect, useState } from "react";

import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/ShoppingData/Platforms/Amazon/Amazon.style";
import {
  AmazonDisConnectItem,
  AmazonTable,
  AmazonConnectItem,
  AmazonDataItem,
} from "@extension-onboarding/pages/Details/screens/ShoppingData/Platforms/Amazon/Items";
import { IShoppingDataPlatformProps } from "@extension-onboarding/pages/Details/screens/ShoppingData/Platforms/types";

export const Amazon: FC<IShoppingDataPlatformProps> = memo(
  ({ name, icon }: IShoppingDataPlatformProps) => {
    const [product, setProduct] = useState<PurchasedProduct[]>([]);
    const { sdlDataWallet } = useDataWalletContext();
    const { amazonProvider: provider } = useAccountLinkingContext();

    const AMAZONINDEX = "ShoppingDataSDL";

    useEffect(() => {
      getEarnedRewards();
    }, []);

    useEffect(() => {
      console.log(product);
    }, [product.length]);

    const getEarnedRewards = () => {
      return sdlDataWallet.purchase.get().map((products) => {
        setProduct(products);
      });
    };

    const handleConnectClick = () => {
      window.localStorage.setItem("isConnectedShoppingData", "true");
      provider
        .getInitializationURL()
        .map((url) => (window.location.href = `${url}?index=${AMAZONINDEX}`));
    };
    const handleDisconnectClick = () => {
      window.localStorage.setItem("isConnectedShoppingData", "false");
      window.location.reload();
    };
    const classes = useStyles();

    return (
      <>
        <Box pt={3} className={classes.container}>
          {window.localStorage.getItem("isConnectedShoppingData") === "true" &&
          product.length > 0 ? (
            <AmazonDisConnectItem
              icon={icon}
              providerName={name}
              handleDisconnectClick={handleDisconnectClick}
              product={product}
            />
          ) : (
            <AmazonConnectItem
              icon={icon}
              providerName={name}
              handleConnectClick={handleConnectClick}
            />
          )}
        </Box>
        {window.localStorage.getItem("isConnectedShoppingData") === "true" &&
          product.length > 0 && (
            <>
              {/*  <Grid className={classes.containers}>
                <FormControl>
                  <RadioGroup defaultValue="everytime">
                    <FormControlLabel
                      value="everytime"
                      control={<Radio />}
                      label="Ask every time i make a purchase on Amazon."
                    />
                    <FormControlLabel
                      value="automatically"
                      control={<Radio />}
                      label="Sync automatically."
                    />
                  </RadioGroup>
                </FormControl>
              </Grid> */}
              <Grid className={classes.containers}>
                <AmazonDataItem product={product} />
              </Grid>
              <Grid className={classes.containers}>
                <AmazonTable product={product} />
              </Grid>
            </>
          )}
      </>
    );
  },
);
