import { PageNumber } from "@objects/primitives/PageNumber.js";

export class PagedResponse<T> {
  public constructor(
    public response: T[],
    public page: number,
    public pageSize: PageNumber,
    public totalResults: number,
  ) {}
}
