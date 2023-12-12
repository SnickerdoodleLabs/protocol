import "reflect-metadata";
import { ELanguageCode } from "@snickerdoodlelabs/objects";

import { StemmerService } from "@nlp/implementations";
import { IStemmerService } from "@nlp/interfaces";
import { englishText } from "@nlp-test/mocks/index.js";

class Mocks {
  public factory(): IStemmerService {
    return new StemmerService();
  }
}
describe("StemmerService", () => {
  test("english stop words", async () => {
    // Arange
    const mocks = new Mocks();
    const service = mocks.factory();

    // Act
    const result = await service.tokenize(ELanguageCode.English, englishText);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const tokens = result._unsafeUnwrap();
    // console.log(tokens);
    expect(tokens.includes("the")).toBeFalsy();
    expect(tokens.includes("a")).toBeFalsy();
    expect(tokens.includes("an")).toBeFalsy();
    expect(tokens.includes("and")).toBeFalsy();
    expect(tokens.includes("or")).toBeFalsy();
    expect(tokens.includes("it")).toBeFalsy();
    expect(tokens.includes(",")).toBeFalsy();
    expect(tokens.includes(";")).toBeFalsy();
    expect(tokens.includes("[")).toBeFalsy();
    expect(tokens.includes("]")).toBeFalsy();
  });
});
