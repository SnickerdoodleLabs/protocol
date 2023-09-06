import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { DomainName, ELanguageCode } from "@snickerdoodlelabs/objects";

import { ProductKeyword, PurchasedProduct } from "@shopping-data/objects";

const timeUtils = new TimeUtils();
export const janDate = timeUtils.parseToSDTimestamp("2021-01-01");
export const febDate = timeUtils.parseToSDTimestamp("2021-02-11");
export const mp1 = DomainName("amazon.com");
export const mp2 = DomainName("ebay.com");

export const iphone12JanVariant = new PurchasedProduct(
  mp1,
  ELanguageCode.English,
  null,
  "The IPhone 12",
  "Orange",
  1000,
  janDate!,
  febDate!,
  null,
  null,
  null,
  "Unknown",
  [
    ProductKeyword("phone"),
    ProductKeyword("orange"),
    ProductKeyword("smart phone"),
  ],
);

export const janPruchasesAmazon = [
  new PurchasedProduct(
    mp1,
    ELanguageCode.English,
    null,
    "IPhone 12",
    "Apple",
    1000,
    janDate!,
    janDate!,
    null,
    null,
    null,
    "Electronics",
    [
      ProductKeyword("phone"),
      ProductKeyword("apple"),
      ProductKeyword("smart phone"),
    ],
  ),
  new PurchasedProduct(
    mp1,
    ELanguageCode.English,
    null,
    "IPhone 11",
    "Apple",
    600,
    janDate!,
    janDate!,
    null,
    null,
    null,
    "Electronics",
    [
      ProductKeyword("phone"),
      ProductKeyword("apple"),
      ProductKeyword("smart phone"),
    ],
  ),
  new PurchasedProduct(
    mp1,
    ELanguageCode.English,
    null,
    "Aveeno Baby Lotion",
    "Aveeno",
    15,
    janDate!,
    janDate!,
    null,
    null,
    null,
    "Skin Care",
    [
      ProductKeyword("baby"),
      ProductKeyword("skincare"),
      ProductKeyword("body lotion"),
    ],
  ),
];

export const janPruchases = [
  ...janPruchasesAmazon,
  new PurchasedProduct(
    mp2,
    ELanguageCode.English,
    null,
    "Aveeno Baby Lotion",
    "Aveeno",
    11,
    janDate!,
    janDate!,
    null,
    null,
    null,
    "Skin Care",
    [
      ProductKeyword("baby"),
      ProductKeyword("skincare"),
      ProductKeyword("body lotion"),
    ],
  ),
];

export const febPruchases = [
  new PurchasedProduct(
    mp1,
    ELanguageCode.English,
    null,
    "IPhone 12",
    "Apple",
    1000,
    febDate!,
    febDate!,
    null,
    null,
    null,
    "Electronics",
    [
      ProductKeyword("phone"),
      ProductKeyword("apple"),
      ProductKeyword("smart phone"),
    ],
  ),
  new PurchasedProduct(
    mp1,
    ELanguageCode.English,
    null,
    "IPhone 11",
    "Apple",
    1800,
    febDate!,
    febDate!,
    null,
    null,
    null,
    "Electronics",
    [
      ProductKeyword("phone"),
      ProductKeyword("apple"),
      ProductKeyword("smart phone"),
    ],
  ),
  new PurchasedProduct(
    mp1,
    ELanguageCode.English,
    null,
    "Aveeno Baby Lotion",
    "Aveeno",
    20,
    febDate!,
    febDate!,
    null,
    null,
    null,
    "Skin Care",
    [
      ProductKeyword("baby"),
      ProductKeyword("skincare"),
      ProductKeyword("body lotion"),
    ],
  ),
  new PurchasedProduct(
    mp2,
    ELanguageCode.English,
    null,
    "Aveeno Baby Lotion",
    "Aveeno",
    3.5,
    febDate!,
    febDate!,
    null,
    null,
    null,
    "Skin Care",
    [
      ProductKeyword("baby"),
      ProductKeyword("skincare"),
      ProductKeyword("body lotion"),
    ],
  ),
];

export const allPurchases = [...janPruchases, ...febPruchases];
