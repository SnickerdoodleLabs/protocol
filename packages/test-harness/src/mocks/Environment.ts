import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  AdSignature,
  EligibleAd,
  SHA256Hash,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { InsightPlatformSimulator } from "@test-harness/mocks/InsightPlatformSimulator.js";
import { TestHarnessMocks } from "@test-harness/mocks/TestHarnessMocks.js";
import { FileInputUtils } from "@test-harness/utilities/FileInputUtils.js";
import {
  BusinessProfile,
  DataWalletProfile,
} from "@test-harness/utilities/index.js";

const walletFolder = "data/profiles/dataWallet";

export class Environment {
  protected fioUtils: FileInputUtils;
  public dataWalletProfile: DataWalletProfile | null = null;
  public adSignatureContentHashMap: Map<string, SHA256Hash>;

  public constructor(
    public businessProfile: BusinessProfile,
    public mocks: TestHarnessMocks,
  ) {
    this.fioUtils = new FileInputUtils();
    this.loadDefaultProfile();
    this.adSignatureContentHashMap = new Map<string, SHA256Hash>();
  }

  public get insightPlatform(): InsightPlatformSimulator {
    return this.mocks.insightSimulator;
  }

  public get core(): SnickerdoodleCore {
    return this.dataWalletProfile!.core;
  }

  public getDataWalletProfiles(): ResultAsync<
    { name: string; path: string }[],
    Error
  > {
    return this.fioUtils.getSubDirPaths(walletFolder);
  }

  public loadDataWalletProfile(pathInfo: {
    name: string;
    path: string;
  }): ResultAsync<void, Error> {
    this.recreateDataWallet();
    return this.dataWalletProfile!.loadFromPath(pathInfo);
  }

  protected recreateDataWallet(): void {
    if (this.dataWalletProfile != null) {
      this.dataWalletProfile.destroy(); // destroy the existing one
    }
    this.dataWalletProfile = new DataWalletProfile(this.mocks);
    this.dataWalletProfile!.initCore(this);
  }

  protected loadDefaultProfile(): ResultAsync<void, Error> {
    this.recreateDataWallet();
    return this.dataWalletProfile!.loadDefaultProfile();
  }
}
