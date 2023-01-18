import Realm from "realm";
import { ELocalStorageKey } from "..";
import { PersistenceError } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ok, okAsync, ResultAsync } from "neverthrow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { IVolatileStorage } from "@persistence/volatile/IVolatileStorage.js";

@injectable()
export class RealmVolatileStorage implements IVolatileStorage {
  public constructor() {}

  public getSchema(name: string) {
    const SD_Accounts = {
      name: name,
      properties: {
        _id: "int",
        derivedAccountAddress: "string?",
        sourceAccountAddress: "string?",
        sourceChain: "int?",
      },
      primaryKey: "_id",
    };

    const SD_Transactions = {
      name: name,
      properties: {
        _id: "int",
        accountAddresses: "list?",
        blockHeight: "int?",
        chainId: "int?",
        feesPaid: "string?",
        from: "string?",
        gasOffered: "string?",
        gasPrice: "string?",
        hash: "string?",
        timestamp: "int?",
        to: "string?",
        value: "string?",
        valueQuote: "int?",
      },
      primaryKey: "_id",
    };
    const SD_LatestBlock = {
      name: name,
      properties: {
        _id: "int",
        block: "int",
        contract: "string",
      },
      primaryKey: "_id",
    };
    if (name === ELocalStorageKey.ACCOUNT) {
      return SD_Accounts;
    } else if (name === ELocalStorageKey.LATEST_BLOCK) {
      return SD_LatestBlock;
    } else if (name === ELocalStorageKey.TRANSACTIONS) {
      return SD_Transactions;
    } else {
      console.error("Name not matched with localstoragekey");
      return SD_Accounts;
    }
  }
  public async getRealm(name: string) {
    const schema = this.getSchema(name);
    const realm = await Realm.open({
      path: "myrealm",
      schema: [schema],
    });
    return realm;
  }

  public persist(): ResultAsync<boolean, PersistenceError> {
    return okAsync(true);
  }

  public clearObjectStore(name: string): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);
  }

  public putObject<T>(
    name: string,
    obj: T,
  ): ResultAsync<void, PersistenceError> {
    console.log("putObject", { name, obj });
    this.getRealm(name).then((realm) => {
      const results = realm.objects(name).sorted("_id");
      //@ts-ignore
      const id = results.length > 0 ? results[results.length - 1]._id + 1 : 1;
      if (ELocalStorageKey.ACCOUNT === name) {
        realm.create(name, {
          _id: id,
          //@ts-ignore
          derivedAccountAddress: obj?.derivedAccountAddress,
          //@ts-ignore
          sourceAccountAddress: obj?.sourceAccountAddress,
          //@ts-ignore
          sourceChain: obj?.sourceChain,
        });
      } else if (ELocalStorageKey.TRANSACTIONS === name) {
        realm.create(name, {
          _id: id,
          //@ts-ignore
          accountAddresses: obj?.accountAddresses,
          //@ts-ignore
          blockHeight: obj?.blockHeight,
          //@ts-ignore
          chainId: obj?.chainId,
          //@ts-ignore
          feesPaid: obj?.feesPaid,
          //@ts-ignore
          from: obj?.from,
          //@ts-ignore
          gasOffered: obj?.gasOffered,
          //@ts-ignore
          gasPrice: obj?.gasPrice,
          //@ts-ignore
          hash: obj?.hash,
          //@ts-ignore
          timestamp: obj?.timestamp,
          //@ts-ignore
          to: obj?.to,
          //@ts-ignore
          value: obj?.value,
          //@ts-ignore
          valueQuote: obj?.valueQuote,
        });
      } else if (ELocalStorageKey.LATEST_BLOCK === name) {
        realm.create(name, {
          _id: id,
          //@ts-ignore
          block: obj?.block,
          //@ts-ignore
          contract: obj?.contract,
        });
      }
    });
    return okAsync(undefined);
  }

  public removeObject(
    name: string,
    key: string,
  ): ResultAsync<void, PersistenceError> {
    AsyncStorage.removeItem(name);
    return okAsync(undefined);
  }

  public getObject<T>(
    name: string,
    key: string,
  ): ResultAsync<T | null, PersistenceError> {
    console.log("getObj", { name, key });
    const promise2 = this.getRealm(name).then((realm) => {
      const results = realm.objects(name);
      //@ts-ignore
      return results;
    });
    promise2.then((res) => {
      res;
    });
    return ResultAsync.fromPromise(
      promise2,
      (e) => new PersistenceError("error getting object", e),
    ).andThen((result) => okAsync(result as unknown as T));
  }

  public getCursor<T>(
    name: string,
    indexName?: string,
    query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    //@ts-ignore
    return okAsync(null);
  }

  public getAll<T>(
    name: string,
    indexName?: string,
  ): ResultAsync<T[], PersistenceError> {
    console.log("getAll", { name, indexName });
    const promise2 = this.getRealm(name).then((realm) => {
      const results = realm.objects(name);
      //@ts-ignore
      return results;
    });

    promise2.then((res) => {
      console.log("getAllPromise2", res);
    });
    return ResultAsync.fromPromise(
      promise2,
      (e) => new PersistenceError("error getting object", e),
    ).andThen((result) => okAsync(result as unknown as T[]));
  }

  public getAllKeys<T>(
    name: string,
    indexName?: string,
    query?: string | number,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError> {
    const promise = AsyncStorage.getItem(name);
    return ResultAsync.fromPromise(
      promise,
      (e) => new PersistenceError("error getting object", e),
    ).andThen((result) => okAsync(JSON.parse(result ?? "") as T[]));
  }
}
