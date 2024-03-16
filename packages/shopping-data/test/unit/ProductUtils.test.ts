import "reflect-metadata";
import { IStemmerService } from "@snickerdoodlelabs/nlp";
import { ELanguageCode } from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { ProductUtils } from "@shopping-data/implementations";
import { IProductUtils } from "@shopping-data/interfaces";
import { prod1, prod1Hash, prod2, prod2Hash } from "@shopping-data-test/mock";

class Mocks {
  public stemmerService = td.object<IStemmerService>();
  public constructor() {
    td.when(
      this.stemmerService.tokenize(ELanguageCode.English, prod1),
    ).thenReturn(okAsync(prod1Hash.split("-")));
    td.when(
      this.stemmerService.tokenize(ELanguageCode.English, prod2),
    ).thenReturn(okAsync(prod2Hash.split("-")));
  }
  public factory(): IProductUtils {
    return new ProductUtils(this.stemmerService);
  }
}

describe("ProductUtils", () => {
  test("product hash", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result1 = await utils.getProductHash(ELanguageCode.English, prod1);
    const result2 = await utils.getProductHash(ELanguageCode.English, prod2);

    // Assert
    expect(result1.isOk()).toBeTruthy();
    expect(result2.isOk()).toBeTruthy();

    const hash1 = result1._unsafeUnwrap();
    const hash2 = result2._unsafeUnwrap();

    expect(hash1).toEqual(prod1Hash);
    expect(hash2).toEqual(prod2Hash);
  });
});
