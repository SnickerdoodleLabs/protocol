declare module "obj-multiplex" {
  import { Duplex } from "readable-stream";

  class ObjectMultiplex extends Duplex {
    constructor(opts?: DuplexOptions);
    createStream(name: string): Substream;
    ignoreStream(name: string): void;
  }

  class Substream extends Duplex {
    constructor(options: { parent: ObjectMultiplex; name: string });
  }

  export = ObjectMultiplex;
}
