import "reflect-metadata";
import { IAxiosAjaxUtils } from "@snickerdoodlelabs/common-utils";
import {
  IpfsCID,
  IPFSError,
  SDQLQuery,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync } from "neverthrow";
import td from "testdouble";

import { testCoreConfig } from "@core-tests/mock/mocks/commonValues";
import {
  ContextProviderMock,
  ConfigProviderMock,
  AjaxUtilsMock,
} from "@core-tests/mock/utilities";
import { SDQLQueryRepository } from "@core/implementations/data";
import { ISDQLQueryRepository } from "@core/interfaces/data";
import { IContextProvider, IConfigProvider } from "@core/interfaces/utilities";

const sdqlContent = "Phoebe";
const cidString = IpfsCID("QmeFACA648aPXQp4sP5R6sgJon4wggUhatY61Ras2WWJLF");

const sqdlQuery = new SDQLQuery(cidString, SDQLString(sdqlContent));

class SDQLQueryRepositoryMocks {
  public contextProvider: IContextProvider;
  public configProvider: IConfigProvider;
  public ajaxUtils: AjaxUtilsMock;

  constructor() {
    this.contextProvider = new ContextProviderMock();
    this.configProvider = new ConfigProviderMock();
    this.ajaxUtils = new AjaxUtilsMock();

    this.ajaxUtils.addGetReturn(
      `${testCoreConfig.ipfsFetchBaseUrl}/${cidString}`,
      sdqlContent,
    );
  }

  public factoryRepository(): ISDQLQueryRepository {
    return new SDQLQueryRepository(
      this.configProvider,
      this.contextProvider,
      this.ajaxUtils,
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
    expect(val).toMatchObject(sqdlQuery);
  });
});
