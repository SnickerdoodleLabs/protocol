// This is basically global variables

import { IIndexerContext } from "@snickerdoodlelabs/indexers";
import {
  ComponentStatus,
  DataWalletAddress,
  EVMPrivateKey,
  PublicEvents,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

import { PrivateEvents } from "@core/interfaces/objects/PrivateEvents.js";

/**
 * Some people may object to some of the values in here- like private keys.
 * These objections are fine, but the fact of the matter is that this is
 * all in-memory, and we don't need to control access to things like that
 * at a source code level. Anybody with access to the source, or the runtime,
 * can get these values. So I just put them where they are handy, and leave
 * it at that. These values are not available on the public interface of
 * Snickerdoodle Core. The harsh truth is that anybody instantiating Snickerdoodle Core
 * could reach into the Snickerdoodle Core object and get the dataWalletKey.
 * BUT, that's overkill. All an attack would need to do is to get a user
 * to sign our unlock message in any context of their choice, and they can
 * obtain our derived key. So again, getting paranoid about the storage
 * of the key in this context is unproductive. KISS!
 */
export class CoreContext implements IIndexerContext {
  public constructor(
    public dataWalletAddress: DataWalletAddress | null,
    public dataWalletKey: EVMPrivateKey | null,
    public initializeInProgress: boolean,
    public publicEvents: PublicEvents,
    public privateEvents: PrivateEvents,
    public restoreInProgress: boolean,
    public startTime: UnixTimestamp,
    public components: ComponentStatus,
  ) {}
}
