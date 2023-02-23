import "reflect-metadata";

import {
  AxiosAjaxUtils,
  IAxiosAjaxUtils,
} from "@snickerdoodlelabs/common-utils";

import {
  PIIService,
  NFTMetadataService,
} from "@extension-onboarding/services/implementations/business";
import {
  NFTMetadataRepository,
  PIIRepository,
} from "@extension-onboarding/services/implementations/data";
import { ApiGatewayConfigProvider } from "@extension-onboarding/services/implementations/utilities";
import {
  INFTMetadataService,
  IPIIService,
} from "@extension-onboarding/services/interfaces/business";
import {
  INFTMetadataRepository,
  IPIIRepository,
} from "@extension-onboarding/services/interfaces/data";
import { ApiGatewayConfig } from "@extension-onboarding/services/interfaces/objects";

export class ApiGateway {
  public PIIService: IPIIService;
  public NFTMetadataService: INFTMetadataService;
  public config: ApiGatewayConfig;
  private PIIRepository: IPIIRepository;
  private NFTMetadataRepository: INFTMetadataRepository;
  private axiosAjaxUtil: IAxiosAjaxUtils;
  constructor() {
    const configProvider = new ApiGatewayConfigProvider();
    this.config = configProvider.getConfig();
    this.axiosAjaxUtil = new AxiosAjaxUtils();
    this.PIIRepository = new PIIRepository(this.axiosAjaxUtil);
    this.PIIService = new PIIService(this.PIIRepository);
    this.NFTMetadataRepository = new NFTMetadataRepository(this.axiosAjaxUtil);
    this.NFTMetadataService = new NFTMetadataService(
      this.NFTMetadataRepository,
    );
  }
}
