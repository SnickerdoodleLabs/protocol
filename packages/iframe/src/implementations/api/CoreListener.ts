import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  AccountAddress,
  DomainName,
  EChain,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import { IIFrameCallData, ChildProxy } from "@snickerdoodlelabs/utils";
import { injectable, inject } from "inversify";
import Postmate from "postmate";

import { ICoreListener } from "@core-iframe/interfaces/api/index.js";
import {
  ICoreUIService,
  ICoreUIServiceType,
} from "@core-iframe/interfaces/business/index.js";

@injectable()
export class CoreListener extends ChildProxy implements ICoreListener {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(ICoreUIServiceType) protected coreUIService: ICoreUIService,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    protected sourceDomain: DomainName,
  ) {
    super();
  }

  protected getModel(): Postmate.Model {
    // Fire up the Postmate model, and wrap up the core as the model
    return new Postmate.Model({
      initialize: (
        data: IIFrameCallData<{
          accountAddress: AccountAddress;
          signature: Signature;
          languageCode: LanguageCode;
          chain: EChain;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.account.unlock(
            data.data.accountAddress,
            data.data.signature,
            data.data.languageCode,
            data.data.chain,
            this.sourceDomain,
          );
        }, data.callId);
      },
    });
  }

  protected onModelActivated(parent: Postmate.ChildAPI): void {
    // We are going to relay the RXJS events
    this.core.getEvents().map((events) => {
      events.onAccountAdded.subscribe((val) => {
        parent.emit("onAccountAdded", val);
      });

      
    });
  }
}
