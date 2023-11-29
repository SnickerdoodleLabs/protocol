import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import {
  EKnownDomains,
  PurchasedProduct,
  ShoppingDataConnectionStatus,
  UUID,
} from "@snickerdoodlelabs/objects";
import {
  SCRAPING_INDEX,
  SCRAPING_URLS,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, memo, useEffect, useState } from "react";

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
    const [isConnected, setIsConnected] = useState<boolean>();
    const { sdlDataWallet } = useDataWalletContext();

    const AMAZONINDEX: string | undefined = SCRAPING_INDEX.get(
      EKnownDomains.Amazon,
    );

    useEffect(() => {
      getProducts();
      getConnectionStatus();
    }, []);

    useEffect(() => {
      console.log(product);
    }, [product.length]);

    const getProducts = () => {
      return sdlDataWallet.purchase.get().map((products) => {
        setProduct(products);
      });
    };

    const getConnectionStatus = () => {
      return sdlDataWallet.purchase
        .getShoppingDataConnectionStatus()
        .map((ShoppingDataConnectionStatus) => {
          ShoppingDataConnectionStatus.map((status) => {
            if (
              status.type === EKnownDomains.Amazon &&
              status.isConnected === true
            ) {
              setIsConnected(true);
            } else {
              setIsConnected(false);
            }
          });
        });
    };

    const handleConnectClick = () => {
      SCRAPING_URLS.filter(
        (provider) => provider.key === EKnownDomains.Amazon,
      ).map((provider) => {
        window.location.href = `${provider.url}&SDLStep=${AMAZONINDEX}`;
      });
    };

    const handleDisconnectClick = () => {
      const shoppingDataConnectionStatus: ShoppingDataConnectionStatus =
        new ShoppingDataConnectionStatus(EKnownDomains.Amazon, false);
      sdlDataWallet.purchase.setShoppingDataConnectionStatus(
        shoppingDataConnectionStatus,
      );
      window.location.reload();
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
        {isConnected && (
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
