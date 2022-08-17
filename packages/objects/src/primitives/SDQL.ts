import { Brand, make } from "ts-brand";
import { ChainId } from "@objects/primitives/ChainId";
import { URLString } from "@objects/primitives/URLString";
import { IEVMBalance } from "@objects/interfaces";

//#region types
export type SDQL_Name = Brand<string, "SDQL_Name">;
export const SDQL_Name = make<SDQL_Name>();

export type SDQL_Return = Brand<string|boolean|number|Array<any>|Map<URLString, number>|Map<ChainId, number>|IEVMBalance[]|null, "SDQL_Return">;

export const SDQL_Return = make<SDQL_Return>();

// export type SDQL_Chain = Brand<string, "SDQL_Chain">; EVMChainCode
// export const SDQL_Chain = make<SDQL_Chain>();

// export type SDQL_Contract = Brand<Object, "SDQL_Contract">;
// export const SDQL_Contract = make<SDQL_Contract>();

export type SDQL_OperatorName = Brand<string, "SDQL_OperatorName">;
export const SDQL_OperatorName = make<SDQL_OperatorName>();

export type SDQL_Conditions = Brand<Array<Object>, "SDQL_Conditions">; // not sure if arrays are suppored in make
export const SDQL_Conditions = make<SDQL_Conditions>();

export type SDQL_Message = Brand<string, "SDQL_Message">;
export const SDQL_Message = make<SDQL_Message>();

export type SDQL_Query = Brand<string, "SDQL_Query">; // ??????????????
export const SDQL_Query = make<SDQL_Query>();

export type SDQL_Description = Brand<string, "SDQL_Description">;
export const SDQL_Description = make<SDQL_Description>();

export type SDQL_Callback = Brand<URLString, "SDQL_Callback">;
export const SDQL_Callback = make<SDQL_Callback>();

export type SDQL_Returns = Brand<Array<string>, "SDQL_Returns">;
export const SDQL_Returns = make<SDQL_Returns>();

export type SDQL_Compensations = Brand<Array<string>, "SDQL_Compensations">; // not sure if arrays are suppored in make
export const SDQL_Compensations = make<SDQL_Compensations>();

//#endregion
