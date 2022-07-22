import "reflect-metadata";
import {
  AxiosAjaxUtils,
  IAxiosAjaxUtils,
} from "@snickerdoodlelabs/common-utils";
import { IPIIService } from "../interfaces/business";
import { IPIIRepository } from "../interfaces/data/IPIIRepository";
import { PIIService } from "./business";
import { PIIRepository } from "./data";


export class ApiGateway {
  public PIIService: IPIIService;
  private PIIRepository: IPIIRepository;
  private axiosAjaxUtil: IAxiosAjaxUtils;
  constructor() {
    this.axiosAjaxUtil = new AxiosAjaxUtils();
    this.PIIRepository = new PIIRepository(this.axiosAjaxUtil);
    this.PIIService = new PIIService(this.PIIRepository);
  }
}
