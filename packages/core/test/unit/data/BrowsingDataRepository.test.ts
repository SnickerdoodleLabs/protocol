import * as td from "testdouble";
import { okAsync } from "neverthrow";
import { IBrowsingDataRepository } from "@core/interfaces/data/index.js";
import { siteVisits, siteVisitsMap } from "@core-tests/mock/mocks/index.js";
import { IDataWalletPersistence } from "@core/interfaces/data/utilities/index.js";
import {
  ERecordKey,
  ISO8601DateString,
  SiteVisitsData,
  UnixTimestamp,
  URLString,
} from "@snickerdoodlelabs/objects";
import { BrowsingDataRepository } from "@core/implementations/data";

describe("BrowsingDataRepository", () => {
  const persistence = td.object<IDataWalletPersistence>();
  td.when(persistence.getAll(ERecordKey.SITE_VISITS)).thenReturn(
    okAsync(siteVisits),
  );
  td.when(
    persistence.updateRecord(ERecordKey.SITE_VISITS, td.matchers.anything()),
  ).thenReturn(okAsync(undefined));

  let browsingDataRepository: IBrowsingDataRepository;
  beforeEach(() => {
    // Arrange
    browsingDataRepository = new BrowsingDataRepository(persistence);
  });

  describe("addSiteVisits", () => {
    test("should add site visits", async () => {
      // Act
      await browsingDataRepository.addSiteVisits(siteVisits);

      // Assert
      td.verify(
        persistence.updateRecord(
          ERecordKey.SITE_VISITS,
          td.matchers.anything(),
        ),
        { times: siteVisits.length },
      );
      // Assert
      siteVisits.forEach((visit) => {
        td.verify(
          persistence.updateRecord(
            ERecordKey.SITE_VISITS,
            td.matchers.contains(visit),
          ),
        );
      });
    });
  });

  describe("getSiteVisists", () => {
    test("should get site visits", async () => {
      //Act
      await browsingDataRepository.getSiteVisits().andThen((result) => {
        //Assert
        expect(result).toEqual(siteVisits);
        return okAsync(undefined);
      });
    });
  });

  describe("getSiteVisitsMap", () => {
    test("should return site visits map", async () => {
      //Act
      await browsingDataRepository.getSiteVisitsMap().andThen((result) => {
        //Assert
        expect(result).toEqual(siteVisitsMap);
        return okAsync(undefined);
      });
    });
    test("should return site visits map with visits filtered by timestamp", async () => {
      //Arrange
      const timestampRange = { start: 300, end: 700 };
      const expected = new Map([
        [
          URLString("discord.com"),
          new SiteVisitsData(1, 300, UnixTimestamp(300), ISO8601DateString("1970-01-01T00:10:00.000Z")),
        ],
      ]);
      //Act
      await browsingDataRepository
        .getSiteVisitsMap(timestampRange)
        .andThen((result) => {
          //Assert
          expect(result).toEqual(expected);
          return okAsync(undefined);
        });
    });
  });
});
