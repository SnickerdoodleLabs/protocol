import { PII } from "../objects";
import {ResultAsync} from 'neverthrow'
import { AjaxError } from "@snickerdoodlelabs/objects";

export interface IPIIRepository{
    fetchPIIFromGoogle(auth_token:string,googleId:string): ResultAsync<PII,AjaxError>
}