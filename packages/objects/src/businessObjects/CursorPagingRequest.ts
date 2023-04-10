import { UUID } from "@objects/primitives/index.js";

export class CursorPagingRequest<TCursor = UUID> {
  public constructor(
    public cursor: TCursor | null,
    public pageSize: number = 20,
  ) {}
}
