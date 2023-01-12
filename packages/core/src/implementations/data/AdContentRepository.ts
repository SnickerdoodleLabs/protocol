import { IAdContentRepository as IAdContentRepository } from "@core/interfaces/data/index.js";
import { IConfigProvider, IConfigProviderType } from "@core/interfaces/utilities/index.js";
import { IAxiosAjaxUtils, IAxiosAjaxUtilsType } from "@snickerdoodlelabs/common-utils";
import { IpfsCID, IPFSError } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";
import { urlJoin } from "url-join-ts";


@injectable()
export class AdContentRepository implements IAdContentRepository {

    public constructor(
        @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
        @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    ) {}

    public getRawAdContentByCID(cid: IpfsCID): ResultAsync<any, IPFSError> {
        return this.configProvider.getConfig().andThen((config) => {
            return this.ajaxUtil.get<any>(
                new URL( urlJoin(config.ipfsFetchBaseUrl, cid) )
            );
        }).orElse((err) => {
            return errAsync( new IPFSError((err as Error).message, err) );
        });
    }
}
