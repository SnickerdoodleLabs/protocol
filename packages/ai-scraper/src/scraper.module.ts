import { ContainerModule, interfaces } from "inversify";

import {
  OpenAIUtils,
  LLMScraperService,
  ChatGPTProvider,
  HTMLPreProcessor,
  PromptDirector,
  LLMPurchaseHistoryUtilsChatGPT,
  PromptBuilderFactory,
  AmazonNavigationUtils,
  WebpageClassifier,
  URLUtils,
  KeywordRepository,
  KeywordUtils,
} from "@ai-scraper/implementations/index.js";
import {
  IScraperConfigProvider,
  IScraperConfigProviderType,
  IOpenAIUtils,
  IOpenAIUtilsType,
  IScraperService,
  IScraperServiceType,
  ILLMProvider,
  ILLMProviderType,
  IHTMLPreProcessor,
  IHTMLPreProcessorType,
  IPromptDirector,
  IPromptDirectorType,
  ILLMPurchaseHistoryUtils,
  ILLMPurchaseHistoryUtilsType,
  IPromptBuilderFactory,
  IPromptBuilderFactoryType,
  IAmazonNavigationUtils,
  IAmazonNavigationUtilsType,
  IWebpageClassifier,
  IWebpageClassifierType,
  IURLUtils,
  IURLUtilsType,
  IKeywordRepository,
  IKeywordRepositoryType,
  IKeywordUtils,
  IKeywordUtilsType,
} from "@ai-scraper/interfaces/index.js";

export const scraperModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    // bind<IScraperConfigProvider>(IScraperConfigProviderType).toService(
    //     IConfigProviderType,
    //   ); // this one is to be bound by the core module as we don't have access to the IConfigProviderType here

    bind<IOpenAIUtils>(IOpenAIUtilsType).to(OpenAIUtils).inSingletonScope();
    bind<IScraperService>(IScraperServiceType)
      .to(LLMScraperService)
      .inSingletonScope();
    bind<ILLMProvider>(ILLMProviderType).to(ChatGPTProvider).inSingletonScope();
    bind<IHTMLPreProcessor>(IHTMLPreProcessorType)
      .to(HTMLPreProcessor)
      .inSingletonScope();
    bind<IPromptDirector>(IPromptDirectorType)
      .to(PromptDirector)
      .inSingletonScope();
    bind<ILLMPurchaseHistoryUtils>(ILLMPurchaseHistoryUtilsType)
      .to(LLMPurchaseHistoryUtilsChatGPT)
      .inSingletonScope();
    bind<IPromptBuilderFactory>(IPromptBuilderFactoryType)
      .to(PromptBuilderFactory)
      .inSingletonScope();
    bind<IAmazonNavigationUtils>(IAmazonNavigationUtilsType)
      .to(AmazonNavigationUtils)
      .inSingletonScope();
    bind<IWebpageClassifier>(IWebpageClassifierType)
      .to(WebpageClassifier)
      .inSingletonScope();
    bind<IURLUtils>(IURLUtilsType).to(URLUtils).inSingletonScope();
    bind<IKeywordRepository>(IKeywordRepositoryType)
      .to(KeywordRepository)
      .inSingletonScope();
    bind<IKeywordUtils>(IKeywordUtilsType).to(KeywordUtils).inSingletonScope();
  },
);
