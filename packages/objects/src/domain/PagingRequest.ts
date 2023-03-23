export class PagingRequest {
	public constructor(public page: number, public pageSize: number) {
		this.page = page ?? 1;
		this.pageSize = pageSize ?? 25;
	}
}
