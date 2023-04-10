export class PagedResponse<T> {
  public constructor(
    public response: T[],
    public page: number,
    public pageSize: number,
    public totalResults: number,
  ) {}
}
