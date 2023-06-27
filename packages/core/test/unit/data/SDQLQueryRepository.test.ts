import "reflect-metadata";
import { IpfsCID, SDQLQuery, SDQLString } from "@snickerdoodlelabs/objects";
import * as td from "testdouble";

import { SDQLQueryRepository } from "@core/implementations/data/index.js";
import {
  IDataWalletPersistence,
  ISDQLQueryRepository,
} from "@core/interfaces/data/index.js";
import {
  IContextProvider,
  IConfigProvider,
} from "@core/interfaces/utilities/index.js";
import { testCoreConfig } from "@core-tests/mock/mocks/commonValues.js";
import {
  ContextProviderMock,
  ConfigProviderMock,
  AjaxUtilsMock,
} from "@core-tests/mock/utilities";

const sdqlContent = "Phoebe";
// const sdqlContent2 = {a: "a", b: "b", c: "c"};
const cidString = IpfsCID("QmeFACA648aPXQp4sP5R6sgJon4wggUhatY61Ras2WWJLF");

const sqdlQuery = new SDQLQuery(cidString, SDQLString(sdqlContent));
// const sqdlQuery2 = new SDQLQuery(cidString, SDQLString(sdqlContent2));

class SDQLQueryRepositoryMocks {
  public contextProvider: IContextProvider;
  public configProvider: IConfigProvider;
  public ajaxUtils: AjaxUtilsMock;
  public persistence: IDataWalletPersistence;

  constructor() {
    this.contextProvider = new ContextProviderMock();
    this.configProvider = new ConfigProviderMock();
    this.ajaxUtils = new AjaxUtilsMock();
    this.persistence = td.object<IDataWalletPersistence>();

    this.ajaxUtils.addGetReturn(
      `${testCoreConfig.ipfsFetchBaseUrl}/${cidString}`,
      sdqlContent,
    );
  }

  public factoryRepository(): ISDQLQueryRepository {
    return new SDQLQueryRepository(
      this.persistence,
      this.configProvider,
      this.contextProvider,
      this.ajaxUtils,
    );
  }
}

describe("SDQLQueryRepository tests", () => {
  test("getSDQLQueryByCID returns text on success", async () => {
    // Arrange
    const mocks = new SDQLQueryRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getSDQLQueryByCID(cidString);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const val = result._unsafeUnwrap();
    expect(val).toBeInstanceOf(SDQLQuery);
    expect(val).toMatchObject(sqdlQuery);
  });
});
