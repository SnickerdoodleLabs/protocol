import express from "express";
import { ResultAsync, okAsync } from "neverthrow";

export class InsightPlatformSimulator {
  protected app: express.Express;
  protected port = 3000;

  public constructor() {
    this.app = express();

    this.app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    this.app.listen(this.port, () => {
      console.log(`Insight Platform Simulator listening on port ${this.port}`);
    });
  }

  public postQuery(): ResultAsync<void, never> {
    return okAsync(undefined);
  }
}
