import {
  DiscordGuildProfile,
  DiscordID,
  DiscordProfile,
  OAuth2RefreshToken,
  Integer,
  OAuth2AccessToken,
  OAuth2Tokens,
  UnixTimestamp,
  URLString,
  Username,
} from "@snickerdoodlelabs/objects";

export const discordProfiles = [
  new DiscordProfile(
    DiscordID("1074825823787425833"),
    Username("sdmuki"),
    null,
    "5192",
    null,
    Integer(0),
    new OAuth2Tokens(
      OAuth2AccessToken("f0RhjaxsHvw5HqKLDsnWZdttSIODUg"),
      OAuth2RefreshToken("my-refresh-token"),
      UnixTimestamp(0),
    ),
  ),

  new DiscordProfile(
    DiscordID("INVALID--SnowflakeID"),
    Username("sdmuki2"),
    null,
    "5192",
    null,
    Integer(0),
    new OAuth2Tokens(
      OAuth2AccessToken("INVALID"),
      OAuth2RefreshToken("my-refresh-token"),
      UnixTimestamp(0),
    ),
  ),
];

export const discordProfileAPIResponse = {
  id: DiscordID("1074825823787425833"),
  username: Username("sdmuki"),
  display_name: null,
  discriminator: "5192",
  flags: Integer(0),
};

export const discordGuildProfileAPIResponses = [
  {
    id: DiscordID("889939924655169616"),
    name: "NFT Worlds",
    icon: "88f2caecc154b4e2e1bcab67b7dbba7b",
    owner: false,
    permissions: Integer(0),
  },
  {
    id: DiscordID("916563302065274891"),
    name: "NFT Marketing Services | Growth • Management • Promotions • Marketing • Advertisements",
    icon: "a_189c4f0d955bde1f1621fd4896fd2b4c",
    owner: false,
    permissions: Integer(99328),
  },
  {
    id: DiscordID("1074837489417719840"),
    name: "test-server1",
    icon: null,
    owner: true,
    permissions: Integer(2147483647),
  },
];

export class SocialDataMock {
  public getDiscordProfiles(): DiscordProfile[] {
    return discordProfiles;
  }

  public getDiscordGuildProfiles(
    discordProfileId?: DiscordID,
  ): DiscordGuildProfile[] {
    return discordGuildProfileAPIResponses.map(
      (profile) =>
        new DiscordGuildProfile(
          profile.id,
          discordProfileId,
          profile.name,
          profile.owner,
          profile.permissions,
          profile.icon ? URLString(profile.icon) : null,
          null,
        ),
    );
  }
}
