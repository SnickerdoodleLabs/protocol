import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  RadioGroup,
} from "@material-ui/core";
import { PurchasedProduct } from "@snickerdoodlelabs/objects";
import { Radio } from "@snickerdoodlelabs/shared-components/src/components/Radio/Radio";
import React, { FC, memo, useEffect, useState } from "react";

import { IShoppingDataPlatformProps } from "../types";

import { AmazonConnectItem } from "./Items/AmazonConnectItem";
import { AmazonDataItem } from "./Items/AmazonDataItem";
import { AmazonDisConnectItem } from "./Items/AmazonDisconnectItem";

import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/ShoppingData/Platforms/Amazon/Amazon.style";

export const Amazon: FC<IShoppingDataPlatformProps> = memo(
  ({ name, icon }: IShoppingDataPlatformProps) => {
    const [isConnected, setIsConnected] = useState(true);
    const [product, setProduct] = useState<PurchasedProduct[]>([]);
    const { sdlDataWallet } = useDataWalletContext();
    const { amazonProvider: provider } = useAccountLinkingContext();

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
      provider
        .getInitializationURL()
        .map((url) => (window.location.href = `${url}`));
    };
    const handleDisconnectClick = () => {
      setIsConnected(false);
    };
    const classes = useStyles();

    return (
      <>
        <Box pt={3} className={classes.container}>
          {isConnected ? (
            <AmazonDisConnectItem
              icon={icon}
              providerName={name}
              handleDisconnectClick={handleDisconnectClick}
            />
          ) : (
            <AmazonConnectItem
              icon={icon}
              providerName={name}
              handleConnectClick={handleConnectClick}
            />
          )}
        </Box>
        {isConnected && (
          <>
            <Grid className={classes.containers}>
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
            </Grid>
            <Grid className={classes.containers}>
              <AmazonDataItem product={product} />
            </Grid>
          </>
        )}
      </>
    );
  },
);
