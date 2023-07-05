import { UUID } from "@objects/primitives/index.js";

export class CursorPagedResponse<T, TCursor = UUID> {
  public constructor(
    public response: T,
    public cursor: TCursor,
    public pageSize: number,
  ) {}
}
