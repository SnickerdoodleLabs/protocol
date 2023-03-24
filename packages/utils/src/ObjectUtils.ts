import {
  CursorPagedResponse,
  PagedResponse,
  PagingRequest,
} from "@snickerdoodlelabs/insight-platform-objects";
import { JSONString } from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

export class ObjectUtils {
  // Taken from https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static mergeDeep<T>(...objects: any[]): unknown {
    const isObject = (obj) => obj && typeof obj === "object";

    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach((key) => {
        const pVal = prev[key];
        const oVal = obj[key];

        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat(...oVal);
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = ObjectUtils.mergeDeep(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });

      return prev;
    }, {});
  }

  static serialize(obj: unknown): JSONString {
    return JSONString(
      JSON.stringify(obj, (key, value) => {
        if (value instanceof Map) {
          return {
            dataType: "Map",
            value: Array.from(value.entries()), // or with spread: value: [...value]
          };
        } else if (value instanceof Set) {
          return {
            dataType: "Set",
            value: [...value],
          };
        } else if (value instanceof BigInt) {
          return {
            dataType: "BigInt",
            value: BigNumber.from(value).toString(),
          };
        } else if (typeof value == "bigint") {
          return {
            dataType: "bigint",
            value: BigNumber.from(value).toString(),
          };
        } else if (
          typeof value == "object" &&
          value != null &&
          value.hasOwnProperty != null &&
          value.hasOwnProperty("type") &&
          value.hasOwnProperty("hex") &&
          value.type == "BigNumber" &&
          value.hex != null
        ) {
          return {
            dataType: "BigNumber",
            value: value.hex,
          };
        } else {
          return value;
        }
      }),
    );
  }

  static deserialize<T = Record<string, unknown>>(json: JSONString): T {
    return JSON.parse(json, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (value.dataType === "Map") {
          return new Map(value.value);
        } else if (value.dataType === "Set") {
          return new Set(value.value);
        } else if (value.dataType === "BigInt") {
          return BigNumber.from(value.value).toBigInt();
        } else if (value.dataType === "bigint") {
          return BigNumber.from(value.value).toBigInt();
        } else if (value.dataType === "BigNumber") {
          return BigNumber.from(value.value);
        }
      }
      return value;
    });
  }

  static toGenericObject(obj: unknown): Record<string, unknown> {
    return ObjectUtils.deserialize(ObjectUtils.serialize(obj));
  }

  static iteratePages<T, TError, TError2>(
    readFunc: (
      pagingRequest: PagingRequest,
    ) => ResultAsync<PagedResponse<T>, TError>,
    processFunc: (obj: T) => ResultAsync<void, TError2>,
    pageSize = 25,
  ): ResultAsync<void, TError | TError2> {
    // This is a recursive method. We just start it off.
    return ObjectUtils.fetchAndProcessPage(1, readFunc, processFunc, pageSize);
  }

  private static fetchAndProcessPage<T, TError, TError2>(
    pageNumber: number,
    readFunc: (
      pagingRequest: PagingRequest,
    ) => ResultAsync<PagedResponse<T>, TError>,
    processFunc: (obj: T) => ResultAsync<void, TError2>,
    pageSize = 25,
  ): ResultAsync<void, TError | TError2> {
    // Create the initial paging request
    const pagingRequest = new PagingRequest(pageNumber, pageSize);

    // Read the page
    return readFunc(pagingRequest).andThen((objectPage) => {
      // Iterate over the objects and run through the processor
      // We'll wait for all the processFuncs to complete before getting the next page
      return ResultUtils.combine(
        objectPage.response.map((obj) => {
          return processFunc(obj);
        }),
      ).andThen(() => {
        // Done processing all of those results. Check if we need to recurse
        // See what result we're on and how it compares to the total results
        const maxResult = objectPage.page * objectPage.pageSize;
        if (maxResult < objectPage.totalResults) {
          return ObjectUtils.fetchAndProcessPage(
            objectPage.page + 1,
            readFunc,
            processFunc,
            pageSize,
          );
        }

        return okAsync<void, TError | TError2>(undefined);
      });
    });
  }

  static iterateCursor<T, TCursor, TError>(
    readFunc: (
      cursor: TCursor | null,
    ) => ResultAsync<CursorPagedResponse<T[], TCursor>, TError>,
    handler: (data: T[]) => ResultAsync<void, TError>,
  ): ResultAsync<void, TError> {
    // Do the first read
    return ObjectUtils.processNextBatch(null, readFunc, handler).map(() => {});
  }

  static parseBoolean(val: string | number | boolean): boolean {
    switch (typeof val) {
      case "boolean":
        return val;
      case "number":
        return val !== 0;
      case "string":
        switch (val?.toLowerCase()?.trim()) {
          case "true":
          case "yes":
          case "1":
            return true;
          case "false":
          case "no":
          case "0":
          case null:
          case undefined:
            return false;
          default:
            console.log(
              `Don't have explicit check in parseBoolean for the string ${val}`,
            );
            return false;
        }
      default:
        console.log(
          `Don't have check in parseBoolean for typeof ${typeof val} of value ${val}`,
        );
        return false;
    }
  }

  private static processNextBatch<T, TCursor, TError>(
    cursor: TCursor | null,
    readFunc: (
      cursor: TCursor | null,
    ) => ResultAsync<CursorPagedResponse<T[], TCursor>, TError>,
    handler: (data: T[]) => ResultAsync<void, TError>,
  ): ResultAsync<CursorPagedResponse<T[], TCursor>, TError> {
    return readFunc(cursor).andThen((resp) => {
      if (resp.response.length == 0) {
        return okAsync(resp);
      }

      return handler(resp.response).andThen(() => {
        return ObjectUtils.processNextBatch(resp.cursor, readFunc, handler);
      });
    });
  }
}
