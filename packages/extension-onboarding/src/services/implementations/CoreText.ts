import "reflect-metadata";
import {
  AxiosAjaxUtils,
  IAxiosAjaxUtils,
} from "@snickerdoodlelabs/common-utils";
import { IPIIService } from "../interfaces/business";
import { IPIIRepository } from "../interfaces/data/IPIIRepository";
import { IRequestRepository } from "../interfaces/data/IRequestRepository";
import { PII } from "../interfaces/objects";
import { PIIService } from "./business";
import { PIIRepository } from "./data";


export class CoreText {
  public PIIService: IPIIService;
  private PIIRepository: IPIIRepository;
  private axiosAjaxUtil: IAxiosAjaxUtils;
  constructor() {
    this.axiosAjaxUtil = new AxiosAjaxUtils();
    this.PIIRepository = new PIIRepository(this.axiosAjaxUtil);
    this.PIIService = new PIIService(this.PIIRepository);
  }
}
