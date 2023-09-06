import "reflect-metadata";
import { IStemmerService, StemmerService } from "@snickerdoodlelabs/nlp";
import * as td from "testdouble";

import { ProductUtils, PurchaseUtils } from "@shopping-data/implementations";
import { IPurchaseUtils } from "@shopping-data/interfaces";
import {
  febPruchases,
  iphone12JanVariant,
  janPruchases,
  janPruchasesAmazon,
} from "@shopping-data-test/mock";

class Mocks {
  public stemmerService = new StemmerService();
  public constructor() {}
  public factory(): IPurchaseUtils {
    return new PurchaseUtils(
      this.stemmerService,
      new ProductUtils(this.stemmerService),
    );
  }
}

describe.skip("PurchaseUtils slow search", () => {
  test("findSame truthy", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.findSame(janPruchases, janPruchases[0]);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const matched = result._unsafeUnwrap();
    expect(matched).not.toBeNull();
    expect(matched?.name).toEqual(janPruchases[0].name);
    expect(matched?.price).toEqual(janPruchases[0].price);
    expect(matched?.marketPlace).toEqual(janPruchases[0].marketPlace);
    expect(matched?.datePurchased).toEqual(janPruchases[0].datePurchased);
    expect(matched?.language).toEqual(janPruchases[0].language);
  });

  test("findSame falsy", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.findSame(febPruchases, janPruchases[0]);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const matched = result._unsafeUnwrap();
    expect(matched).toBeNull();
  });

  test("contains", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.contains(janPruchases, janPruchases[0]);

    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toBeTruthy();
  });

  test("contains iphone 12 variant", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.contains(janPruchases, iphone12JanVariant);

    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toBeTruthy();
  });

  test("does not contain", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.contains(febPruchases, janPruchases[0]);

    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toBeFalsy();
  });
});

describe("PurchaseUtils fast search", () => {
  test.only("findSame truthy", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.findSameWithSimilarNameAndPrice(
      janPruchasesAmazon,
      janPruchases[0],
    );

    // Assert
    expect(result.isOk()).toBeTruthy();
    const matched = result._unsafeUnwrap();
    expect(matched).not.toBeNull();
    expect(matched?.name).toEqual(janPruchases[0].name);
    expect(matched?.price).toEqual(janPruchases[0].price);
    expect(matched?.marketPlace).toEqual(janPruchases[0].marketPlace);
    expect(matched?.datePurchased).toEqual(janPruchases[0].datePurchased);
    expect(matched?.language).toEqual(janPruchases[0].language);
  });

  test("contains iphone 12 variant", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.containsWithSimilarNameAndPrice(
      janPruchasesAmazon,
      iphone12JanVariant,
    );

    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toBeTruthy();
  });
});
