import {
  DiscordProfile,
  PersistenceError,
  DiscordGuildProfile,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISocialConnectionService {
  getDiscordProfiles(): ResultAsync<DiscordProfile[], PersistenceError>;

  getDiscordGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    PersistenceError
  >;
}

export const ISocialConnectionServiceType = Symbol.for(
  "ISocialConnectionService",
);
