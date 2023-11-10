import {
  ELanguageCode,
  HTMLString,
  PageNo,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ModalContainer } from "@snickerdoodlelabs/shared-components";
import React, { useEffect, useMemo, useState } from "react";

import {
  ShoppingDataDone,
  ShoppingDataINIT,
  ShoppingDataProcess,
} from "@synamint-extension-sdk/content/components/ShoppingDataService/components/Screens";
import { EShoppingDataState } from "@synamint-extension-sdk/content/components/ShoppingDataService/constants";
import { ExternalCoreGateway } from "@synamint-extension-sdk/gateways";

interface IShoppingDataProcessProps {
  coreGateway: ExternalCoreGateway;
}

export const ShoppingDataService: React.FC<IShoppingDataProcessProps> = ({
  coreGateway,
}: IShoppingDataProcessProps) => {
  const [shoppingDataScrapeStart, setShoppingDataScrapeStart] =
    useState<boolean>(false);
  const [shoppingDataState, setShoppingDataState] =
    useState<EShoppingDataState>(EShoppingDataState.SHOPPINGDATA_IDLE);

  useEffect(() => {
    checkURLAMAZON();
  }, [shoppingDataScrapeStart]);

  const getAmazonUrlsAndScrape = () => {
    const html = document.documentElement.outerHTML;
    let openWindowCount = 0;
    return coreGateway.scraperNavigation
      .getYears(HTMLString(html))
      .map((years) => {
        for (const year of years) {
          for (let i = 1; i <= 5; i++) {
            coreGateway.scraperNavigation
              .getOrderHistoryPageByYear(ELanguageCode.English, year, PageNo(i))
              .map(async (url) => {
                const width = 100;
                const height = 100;

                const left = (window.screen.width - width) / 2;
                const top = (window.screen.height - height) / 2;

                const windowFeatures =
                  "width=" +
                  width +
                  ",height=" +
                  height +
                  ",left=" +
                  left +
                  ",top=" +
                  top;
                const newWindow = window.open(url, "_blank", windowFeatures);
                if (newWindow) {
                  openWindowCount++;
                  await new Promise((resolve) => {
                    newWindow.onload = resolve;
                  });

                  const windowHTML =
                    newWindow.document.documentElement.outerHTML;
                  console.log("windowhtml", windowHTML);
                  coreGateway.scraper
                    .classifyURL(URLString(url), ELanguageCode.English)
                    .andThen((DomainTask) => {
                      console.log("DOMAINTASKSKKK", DomainTask);
                      return coreGateway.scraper
                        .scrape(
                          URLString(url),
                          HTMLString(windowHTML),
                          DomainTask,
                        )
                        .map((result) => console.log(result))
                        .mapErr((err) => console.log("iç", err));
                    });

                  newWindow.close();
                  openWindowCount--;
                  if (openWindowCount === 0) {
                    setShoppingDataState(
                      EShoppingDataState.SHOPPINGDATA_SCRAPE_DONE,
                    );
                  }
                }
              });
          }
        }
      });
  };

  const checkURLAMAZON = () => {
    const url = window.location.href;

    if (url.includes("ShoppingDataSDL") && url.includes("amazon")) {
      setShoppingDataState(EShoppingDataState.SHOPPINGDATA_INIT);
      if (shoppingDataScrapeStart) {
        setShoppingDataState(EShoppingDataState.SHOPPINGDATA_SCRAPE_PROCESS);
        getAmazonUrlsAndScrape();
      }
    }
  };

  const exitScraper = () => {
    setShoppingDataState(EShoppingDataState.SHOPPINGDATA_INIT);
  };

  const renderShoppingDataComponent = useMemo(() => {
    switch (true) {
      case shoppingDataState === EShoppingDataState.SHOPPINGDATA_INIT:
        return (
          <ShoppingDataINIT
            setShoppingDataScrapeStart={setShoppingDataScrapeStart}
          />
        );
      case shoppingDataState === EShoppingDataState.SHOPPINGDATA_SCRAPE_PROCESS:
        return <ShoppingDataProcess onCloseClick={exitScraper} />;
      case shoppingDataState === EShoppingDataState.SHOPPINGDATA_SCRAPE_DONE:
        return <ShoppingDataDone coreGateway={coreGateway} />;
      default:
        return null;
    }
  }, [shoppingDataState]);
  return (
    <>
      {renderShoppingDataComponent && (
        <ModalContainer>{renderShoppingDataComponent}</ModalContainer>
      )}
    </>
  );
};
