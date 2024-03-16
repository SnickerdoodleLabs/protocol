import { PageNumber } from "@objects/primitives/PageNumber.js";

export class PagedResponse<T> {
  public constructor(
    public response: T[],
    public page: PageNumber,
    public pageSize: number,
    public totalResults: number,
  ) {}
}
