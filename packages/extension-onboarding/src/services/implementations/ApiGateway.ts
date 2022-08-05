import "reflect-metadata";
import {
  AxiosAjaxUtils,
  IAxiosAjaxUtils,
} from "@snickerdoodlelabs/common-utils";

import { IPIIService } from "../interfaces/business";
import { IPIIRepository } from "../interfaces/data/IPIIRepository";
import { ApiGatewayConfig } from "../interfaces/objects";

import { PIIService } from "./business";
import { PIIRepository } from "./data";
import { ApiGatewayConfigProvider } from "./utilities/ApiGatewayConfigProvider";

export class ApiGateway {
  public PIIService: IPIIService;
  public config: ApiGatewayConfig;
  private PIIRepository: IPIIRepository;
  private axiosAjaxUtil: IAxiosAjaxUtils;
  constructor() {
    const configProvider = new ApiGatewayConfigProvider();
    this.config = configProvider.getConfig();
    this.axiosAjaxUtil = new AxiosAjaxUtils();
    this.PIIRepository = new PIIRepository(this.axiosAjaxUtil);
    this.PIIService = new PIIService(this.PIIRepository);
  }
}
