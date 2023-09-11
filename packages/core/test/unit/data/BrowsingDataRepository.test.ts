import * as td from "testdouble";
import { okAsync } from "neverthrow";
import { IBrowsingDataRepository } from "@core/interfaces/data/index.js";
import { siteVisits, siteVisitsMap } from "@core-tests/mock/mocks/index.js";
import { IDataWalletPersistence } from "@core/interfaces/data/utilities/index.js";
import {
  ERecordKey,
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
    persistence.updateRecord(
      ERecordKey.SITE_VISITS,
      td.matchers.anything(),
    ),
  ).thenReturn(okAsync(undefined));

  let browsingDataRepository: IBrowsingDataRepository;

  beforeEach(() => {
    browsingDataRepository = new BrowsingDataRepository(persistence);
  });

 

  describe("addSiteVisits", () => {
    it("should add site visits", async () => {
      await browsingDataRepository.addSiteVisits(siteVisits);
      td.verify(
        persistence.updateRecord(
          ERecordKey.SITE_VISITS,
          td.matchers.anything(),
        ),
        { times: siteVisits.length },
      );
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
    it("should get site visits", async () => {
      await browsingDataRepository.getSiteVisits().andThen( (result) => {
        expect(result).toEqual(siteVisits);
        return okAsync(undefined);
      });

    });
  });

  describe("getSiteVisitsMap", () => {
    it("should return site visits map", async () => {
      await browsingDataRepository.getSiteVisitsMap().andThen((result) => {
        expect(result).toEqual(siteVisitsMap);
        return okAsync(undefined);
      });
    });
    it("should return site visits map with visits filtered by timestamp", async () => {
      const timestampRange = { start: 150, end: 450 };
      const expected = new Map([
        [
          URLString("gog.com"),
          {
            numberOfVisits: 1,
            totalScreenTime: UnixTimestamp(200),
            averageScreenTime: UnixTimestamp(200),
            lastReportedTime: UnixTimestamp(400),
          },
        ]
      ])
      await browsingDataRepository
        .getSiteVisitsMap(timestampRange)
        .andThen((result) => {
          expect(result).toEqual(expected);
          return okAsync(undefined);
        });
    });
  });
});
