import { Box } from "@material-ui/core";
import {
  EKnownDomains,
  PurchasedProduct,
  ShoppingDataConnectionStatus,
} from "@snickerdoodlelabs/objects";
import {
  SCRAPING_INDEX,
  SCRAPING_URLS,
  SDTypography,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, memo, useEffect, useState } from "react";

import Table, { IColumn } from "@extension-onboarding/components/v2/Table";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import {
  AmazonDisConnectItem,
  AmazonConnectItem,
  AmazonDataItem,
} from "@extension-onboarding/pages/V2/ShoppingData/Platforms/Amazon/Items";
import { IShoppingDataPlatformProps } from "@extension-onboarding/pages/V2/ShoppingData/Platforms/types";

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
      return sdlDataWallet.purchase.getPurchasedProducts().map((products) => {
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

    const columns: IColumn<PurchasedProduct>[] = [
      {
        sortKey: "datePurchased",
        label: "Product Name",
        render: (row: PurchasedProduct) => (
          <SDTypography
            fontWeight="medium"
            fontFamily="roboto"
            variant="bodyLg"
            color="textBody"
          >
            {row.name.length > 20 ? row.name.slice(0, 20) + "..." : row.name}
          </SDTypography>
        ),
      },
      {
        label: "Brand",
        render: (row: PurchasedProduct) => (
          <SDTypography
            fontWeight="medium"
            fontFamily="roboto"
            variant="bodyLg"
            color="textBody"
          >
            {!row.brand && "NaN"}
            {row.brand}
          </SDTypography>
        ),
      },
      {
        label: "Category",
        render: (row: PurchasedProduct) => (
          <SDTypography
            fontWeight="medium"
            fontFamily="roboto"
            variant="bodyLg"
            color="textBody"
          >
            {row.category}
          </SDTypography>
        ),
      },
      {
        sortKey: "price",
        label: "Price",
        render: (row: PurchasedProduct) => (
          <SDTypography
            fontWeight="medium"
            fontFamily="roboto"
            variant="bodyLg"
            color="textBody"
          >
            ${row.price}
          </SDTypography>
        ),
        align: "right" as const,
      },
    ];

    return (
      <>
        <Box
          pt={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          border="1px solid"
          borderColor="#ECECEC"
          borderRadius="12px"
          mt={3}
          p={3}
        >
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
            <Box mt={3}>
              <AmazonDataItem product={product} />
            </Box>
            <Box mt={3}>
              <Table columns={columns} data={product} />
            </Box>
          </>
        )}
      </>
    );
  },
);
