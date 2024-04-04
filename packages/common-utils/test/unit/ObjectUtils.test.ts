import "reflect-metadata";
import {
  CursorPagedResponse,
  PagedResponse,
  PagingRequest,
  BigNumberString,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { ObjectUtils } from "@common-utils/implementations/ObjectUtils.js";

describe("ObjectUtils tests", () => {
  test("iterateCursor runs over all data", async () => {
    // Arrange
    let batch1 = false;
    let batch2 = false;
    let batch3 = false;

    const readFunc = (cursor: number | null) => {
      if (cursor == null) {
        return okAsync(new CursorPagedResponse(["1", "2", "3"], 3, 3));
      }
      if (cursor == 3) {
        return okAsync(new CursorPagedResponse(["4", "5", "6"], 6, 3));
      }
      if (cursor == 6) {
        return okAsync(new CursorPagedResponse(["7", "8", "9"], 9, 3));
      }
      // Should be cursor = 9
      return okAsync(new CursorPagedResponse([], 9, 3));
    };

    const handler = (data: string[]) => {
      if (data.length == 0) {
        throw new Error("Handler called for empty set!");
      }

      if (data[0] == "1") {
        batch1 = true;
      }
      if (data[0] == "4") {
        batch2 = true;
      }
      if (data[0] == "7") {
        batch3 = true;
      }

      return okAsync(undefined);
    };

    // Act
    const result = await ObjectUtils.iterateCursor(readFunc, handler);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(batch1).toBeTruthy();
    expect(batch2).toBeTruthy();
    expect(batch3).toBeTruthy();
  });

  test("serialize supports BigInt, Map and Set", () => {
    // Arrange
    const serializeData = {
      foo: "1",
      bar: 1,
      map: new Map([
        ["foo", "bar"],
        ["foo1", "bar1"],
      ]),
      set: new Set([1, 2, 3, 3]),
      bigInt: BigInt(13),
    };

    // Act
    const result = ObjectUtils.serialize(serializeData);

    // Assert
    expect(result).toBe(
      '{"foo":"1","bar":1,"map":{"dataType":"Map","value":[["foo","bar"],["foo1","bar1"]]},"set":{"dataType":"Set","value":[1,2,3]},"bigInt":{"dataType":"bigint","value":"13"}}',
    );
  });

  test("deserialize supports BigNumber, BigInt, Map and Set", () => {
    // Arrange
    const serializeData = {
      foo: "1",
      bar: 1,
      map: new Map([
        ["foo", "bar"],
        ["foo1", "bar1"],
      ]),
      set: new Set([1, 2, 3, 3]),
      bigNumber: BigInt(69),
      bigInt: BigInt(13),
    };

    // Act
    const serialized = ObjectUtils.serialize(serializeData);
    const deserialized = ObjectUtils.deserialize(serialized);

    // Assert
    expect(deserialized).toMatchObject(serializeData);
  });

  test("toGenericObject strings prototypes", () => {
    class TestClass {
      public constructor(public foo: string) {}
    }
    // Arrange
    const src = new TestClass("hello");

    // Act
    const genericized = ObjectUtils.toGenericObject(src);

    // Assert
    expect(src).toBeInstanceOf(TestClass);
    expect(genericized).toMatchObject(src);
    expect(genericized).not.toBeInstanceOf(TestClass);
    expect(genericized).toBeInstanceOf(Object);
  });

  test("BigNumber test", () => {
    // Arrange
    const bn = BigInt(1);

    // Act
    const bns = BigNumberString(bn.toString());

    // Assert
    expect(bns).toBe("1");
    expect(typeof bn).toBe("bigint");
  });

  test("iteratePages() runs over all data", async () => {
    // Arrange
    const seenResults = new Array<number>();

    const readFunc = (pagingRequest: PagingRequest) => {
      if (pagingRequest.page == 1) {
        return okAsync(new PagedResponse([1, 2, 3], 1, 3, 9));
      }
      if (pagingRequest.page == 2) {
        return okAsync(new PagedResponse([4, 5, 6], 2, 3, 9));
      }
      if (pagingRequest.page == 3) {
        return okAsync(new PagedResponse([7, 8, 9], 3, 3, 9));
      }
      // If it asks for page 4
      return errAsync(new Error("Asked for pages beyond totalResults!"));
    };

    const processFunc = (data: number) => {
      seenResults.push(data);

      return okAsync(undefined);
    };

    // Act
    const result = await ObjectUtils.iteratePages(readFunc, processFunc, 3);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(seenResults.length).toBe(9);
  });

  test("iteratePages() stops after first read failure", async () => {
    // Arrange
    const seenResults = new Array<number>();

    const readFunc = (pagingRequest: PagingRequest) => {
      if (pagingRequest.page == 1) {
        return okAsync(new PagedResponse([1, 2, 3], 1, 3, 9));
      }
      if (pagingRequest.page == 2) {
        return errAsync(new Error("Read failure for page 2!"));
      }
      if (pagingRequest.page == 3) {
        return okAsync(new PagedResponse([7, 8, 9], 3, 3, 9));
      }
      // If it asks for page 4
      return errAsync(new Error("Asked for pages beyond totalResults!"));
    };

    const processFunc = (data: number) => {
      seenResults.push(data);

      return okAsync(undefined);
    };

    // Act
    const result = await ObjectUtils.iteratePages(readFunc, processFunc, 3);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(seenResults.length).toBe(3);
  });

  test("iteratePages() stops after processing a page with a failure", async () => {
    // Arrange
    const seenResults = new Array<number>();

    const readFunc = (pagingRequest: PagingRequest) => {
      if (pagingRequest.page == 1) {
        return okAsync(new PagedResponse([1, 2, 3], 1, 3, 9));
      }
      if (pagingRequest.page == 2) {
        return okAsync(new PagedResponse([4, 5, 6], 2, 3, 9));
      }
      if (pagingRequest.page == 3) {
        return okAsync(new PagedResponse([7, 8, 9], 3, 3, 9));
      }
      // If it asks for page 4
      return errAsync(new Error("Asked for pages beyond totalResults!"));
    };

    const processFunc = (data: number) => {
      if (data == 5) {
        return errAsync(new Error("I just don't like 5s"));
      }

      seenResults.push(data);

      return okAsync(undefined);
    };

    // Act
    const result = await ObjectUtils.iteratePages(readFunc, processFunc, 3);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();

    // We get the second page, and process 4, 5, 6. 5 fails. But 4 and 6 work, thus we should see
    // 5 successful processes
    expect(seenResults.length).toBe(5);
  });

  test("progressiveFallback() returns first available result", async () => {
    // Arrange
    const provider1 = new TestProvider(1, true);
    const provider2 = new TestProvider(2, false);
    const provider3 = new TestProvider(3, false);

    // Act
    const result = await ObjectUtils.progressiveFallback(
      (provider: TestProvider) => {
        return provider.getResult();
      },
      [provider1, provider2, provider3],
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(2);
  });

  test("progressiveFallback() returns last error if everything errors", async () => {
    // Arrange
    const provider1 = new TestProvider(1, true);
    const provider2 = new TestProvider(2, true);
    const provider3 = new TestProvider(3, true, "Final Error");

    // Act
    const result = await ObjectUtils.progressiveFallback(
      (provider: TestProvider) => {
        return provider.getResult();
      },
      [provider1, provider2, provider3],
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err.message).toBe("Final Error");
  });

  test("iterateThroughAllPages() runs over all data", async () => {
    // Arrange
    const readFunc = (pagingRequest: PagingRequest) => {
      if (pagingRequest.page == 1 && pagingRequest.pageSize == 1) {
        return okAsync(new PagedResponse([1], 1, 1, 9));
      }
      if (pagingRequest.page == 1 && pagingRequest.pageSize == 9) {
        return okAsync(new PagedResponse([1, 2, 3, 4, 5, 6, 7, 8, 9], 1, 9, 9));
      }
      // If it asks for page 2
      return errAsync(new Error("Asked for pages beyond totalResults!"));
    };

    // Act
    const result = await ObjectUtils.iterateThroughAllPages(readFunc);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

class TestProvider {
  public constructor(
    public returnVal: number,
    public fail: boolean,
    public failMessage = "Failed!",
  ) {}

  public getResult(): ResultAsync<number, Error> {
    if (this.fail) {
      return errAsync(new Error(this.failMessage));
    }
    return okAsync(this.returnVal);
  }
}
