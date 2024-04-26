import "reflect-metadata";
import {
  AxiosAjaxUtils,
  IAxiosAjaxUtils,
} from "@snickerdoodlelabs/common-utils";
import { NFTMetadataService } from "@extension-onboarding/services/implementations/business";
import { NFTMetadataRepository } from "@extension-onboarding/services/implementations/data";
import { ApiGatewayConfigProvider } from "@extension-onboarding/services/implementations/utilities";
import { INFTMetadataService } from "@extension-onboarding/services/interfaces/business";
import { INFTMetadataRepository } from "@extension-onboarding/services/interfaces/data/index.js";
import { ApiGatewayConfig } from "@extension-onboarding/services/interfaces/objects";

export class ApiGateway {
  public NFTMetadataService: INFTMetadataService;
  public config: ApiGatewayConfig;
  private NFTMetadataRepository: INFTMetadataRepository;
  private axiosAjaxUtil: IAxiosAjaxUtils;
  constructor() {
    const configProvider = new ApiGatewayConfigProvider();
    this.config = configProvider.getConfig();
    this.axiosAjaxUtil = new AxiosAjaxUtils();
    this.NFTMetadataRepository = new NFTMetadataRepository(this.axiosAjaxUtil);
    this.NFTMetadataService = new NFTMetadataService(
      this.NFTMetadataRepository,
    );
  }
}
