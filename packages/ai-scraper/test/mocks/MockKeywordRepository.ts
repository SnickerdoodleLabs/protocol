import { ELanguageCode, ETask, Keyword } from "@snickerdoodlelabs/objects";
import * as td from "testdouble";

import { DefaultKeywords } from "@ai-scraper/data";
import { IKeywordRepository, Keywords } from "@ai-scraper/interfaces";

export class MockKeywordRepository {
  public keywords = JSON.parse(DefaultKeywords) as Keywords;
  public factory(): IKeywordRepository {
    const repository = td.object<IKeywordRepository>();
    // TODO doubles for non english languages

    td.when(repository.getKeywords(ELanguageCode.English)).thenReturn(
      this.keywords[ELanguageCode.English],
    );

    td.when(
      repository.getKeywordsByTask(
        ELanguageCode.English,
        ETask.PurchaseHistory,
      ),
    ).thenReturn(
      new Set(
        this.keywords[ELanguageCode.English][ETask.PurchaseHistory.valueOf()],
      ),
    );

    td.when(
      repository.getKeywordsByTask(ELanguageCode.English, ETask.Follower),
    ).thenReturn(new Set<Keyword>());

    td.when(
      repository.getKeywordsByTask(
        ELanguageCode.English,
        ETask.ProductCollection,
      ),
    ).thenReturn(new Set<Keyword>());

    td.when(
      repository.getKeywordsByTask(ELanguageCode.English, ETask.Wishlist),
    ).thenReturn(new Set<Keyword>());

    td.when(
      repository.getKeywordsByTask(
        ELanguageCode.English,
        ETask.GamesCollection,
      ),
    ).thenReturn(new Set<Keyword>());

    td.when(
      repository.getKeywordsByTask(ELanguageCode.English, ETask.Unknown),
    ).thenReturn(new Set<Keyword>());

    td.when(
      repository.getKeywordsByTask(
        td.matchers.not(ELanguageCode.English),
        td.matchers.anything(),
      ),
    ).thenReturn(new Set<Keyword>());

    return repository;
  }
}
