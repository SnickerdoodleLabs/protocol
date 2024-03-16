export interface IHTMLPreProcessorOptions {
  baseElements: { selectors: string[] };
  selectors: [
    { selector: "a"; options?: { ignoreHref: boolean } },
    { selector: "img"; format: string },
  ];
}
