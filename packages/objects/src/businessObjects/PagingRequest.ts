import { PageNumber } from "@objects/primitives/PageNumber.js";
export class PagingRequest {
  public constructor(public page: PageNumber, public pageSize: number) {
    this.page = page ?? 1;
    this.pageSize = pageSize ?? 25;
  }
}
