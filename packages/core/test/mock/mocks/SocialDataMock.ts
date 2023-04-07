import {
  DiscordAccessToken,
  DiscordGuildProfile,
  DiscordProfile,
  DiscordRefreshToken,
  Integer,
  OAuth2Tokens,
  SnowflakeID,
  UnixTimestamp,
  URLString,
  Username,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

export const discordProfiles = [
  new DiscordProfile(
    SnowflakeID("1074825823787425833"),
    Username("sdmuki"),
    null,
    "5192",
    null,
    Integer(0),
    new OAuth2Tokens(
      DiscordAccessToken("f0RhjaxsHvw5HqKLDsnWZdttSIODUg"),
      DiscordRefreshToken("my-refresh-token"),
      UnixTimestamp(0),
    ),
  ),

  new DiscordProfile(
    SnowflakeID("INVALID--SnowflakeID"),
    Username("sdmuki2"),
    null,
    "5192",
    null,
    Integer(0),
    new OAuth2Tokens(
      DiscordAccessToken("INVALID"),
      DiscordRefreshToken("my-refresh-token"),
      UnixTimestamp(0),
    ),
  ),
];

export const discordProfileAPIResponse = {
  id: SnowflakeID("1074825823787425833"),
  username: Username("sdmuki"),
  display_name: null,
  discriminator: "5192",
  flags: Integer(0),
};

export const discordGuildProfileAPIResponses = [
  {
    id: SnowflakeID("889939924655169616"),
    name: "NFT Worlds",
    icon: "88f2caecc154b4e2e1bcab67b7dbba7b",
    owner: false,
    permissions: Integer(0),
  },
  {
    id: SnowflakeID("916563302065274891"),
    name: "NFT Marketing Services | Growth • Management • Promotions • Marketing • Advertisements",
    icon: "a_189c4f0d955bde1f1621fd4896fd2b4c",
    owner: false,
    permissions: Integer(99328),
  },
  {
    id: SnowflakeID("1074837489417719840"),
    name: "test-server1",
    icon: null,
    owner: true,
    permissions: Integer(2147483647),
  },
];

export class SocialDataMock {
  public getDiscordProfiles(): ResultAsync<DiscordProfile[], never> {
    return okAsync(discordProfiles);
  }
  public getDiscordGuildProfiles(
    discordProfileId: SnowflakeID | null,
  ): ResultAsync<DiscordGuildProfile[], never> {
    if (discordProfileId == null) {
      discordProfileId = SnowflakeID("-1");
    }
    return okAsync(
      discordGuildProfileAPIResponses.map(
        (profile) =>
          new DiscordGuildProfile(
            profile.id,
            discordProfileId!,
            profile.name,
            profile.owner,
            profile.permissions,
            URLString(profile.icon ?? ""),
            null,
          ),
      ),
    );
  }
}
