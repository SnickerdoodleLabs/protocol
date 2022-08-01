import "reflect-metadata";
import {
  IpfsCID,
  IPFSError,
  SDQLQuery,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { CID } from "ipfs-http-client";
import { IPFSHTTPClient } from "ipfs-http-client/types/src/types";
import { errAsync, okAsync } from "neverthrow";
import td from "testdouble";

import { SDQLQueryRepository } from "@core/implementations/data/SDQLQueryRepository";
import { ISDQLQueryRepository } from "@core/interfaces/data";
import {
  IIPFSProvider,
  IContextProvider,
  IConfigProvider,
} from "@core/interfaces/utilities";

const textToAdd = "Phoebe";
const cidString = IpfsCID("QmeFACA648aPXQp4sP5R6sgJon4wggUhatY61Ras2WWJLF");

class SDQLQueryRepositoryMocks {
  public ipfsClient = td.object<IPFSHTTPClient>();
  public ipfsProvider = td.object<IIPFSProvider>();
  public contextProvider = td.object<IContextProvider>();
  public configProvider = td.object<IConfigProvider>();

  public cid = td.object<CID>();

  constructor() {
    td.when(this.ipfsProvider.getIFPSClient()).thenReturn(
      okAsync(this.ipfsClient),
    );

    td.when(
      this.ipfsClient.add(textToAdd, td.matchers.contains({ pin: true })),
    ).thenResolve({
      cid: this.cid,
    });

    let called = false;
    const asyncIterable = {
      [Symbol.asyncIterator]() {
        return {
          next() {
            const enc = new TextEncoder(); // always utf-8

            if (called) {
              return Promise.resolve({
                value: Uint8Array.from([]),
                done: true,
              });
            }
            called = true;
            return Promise.resolve({
              value: enc.encode(textToAdd),
              done: false,
            });
          },
        };
      },
    };

    td.when(this.ipfsClient.cat(cidString)).thenReturn(asyncIterable);

    this.cid.toString = () => {
      return cidString;
    };
  }

  public factoryRepository(): ISDQLQueryRepository {
    return new SDQLQueryRepository(
      this.configProvider,
      this.contextProvider,
      this.ipfsProvider,
    );
  }
}

describe("SDQLQueryRepository tests", () => {
  test("getByCID returns text on success", async () => {
    // Arrange
    const mocks = new SDQLQueryRepositoryMocks();
    const repo = mocks.factoryRepository();
    // Act
    const result = await repo.getByCID(cidString);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const val = result._unsafeUnwrap();
    expect(val).toBeInstanceOf(SDQLQuery);
    expect(val).toMatchObject(new SDQLQuery(cidString, SDQLString(textToAdd)));
  });

  test("getByCID returns an IPFSError on failiue", async () => {
    // Arrange
    const mocks = new SDQLQueryRepositoryMocks();
    const repo = mocks.factoryRepository();
    const err = new Error("Error");
    td.when(mocks.ipfsClient.cat(cidString)).thenReject(err);

    // Act
    const result = await repo.getByCID(cidString);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const val = result._unsafeUnwrapErr();
    expect(val.message).toBe("Error");
    expect(val).toBeInstanceOf(IPFSError);
  });

  test("getByCID returns an IPFSError if IPFSProvider fails", async () => {
    // Arrange
    const mocks = new SDQLQueryRepositoryMocks();
    const err = new IPFSError("Error", {});
    td.when(mocks.ipfsProvider.getIFPSClient()).thenReturn(errAsync(err));
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getByCID(cidString);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const val = result._unsafeUnwrapErr();
    expect(val).toBe(err);
    expect(err).toBeInstanceOf(IPFSError);
  });
});
