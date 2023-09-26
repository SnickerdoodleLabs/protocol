import { URLString } from "@snickerdoodlelabs/objects";
import { IURLChangeObserver } from "@web-integration/interfaces/utilities/index.js";
import { ResultAsync } from "neverthrow";

export class URLChangeObserver implements IURLChangeObserver {
  private observer: MutationObserver;
  private currentUrl: URLString;

  constructor(private callback: (url: URLString) => ResultAsync<void, Error>) {
    this.observer = new MutationObserver(this.handleMutation);
    // catch the initial URL
    this.currentUrl = URLString("");

    // Start observing changes in the body element.
    const targetNode = document.body;
    const config: MutationObserverInit = { childList: true, subtree: true };
    this.observer.observe(targetNode, config);
    // Track the initial URL.
    this.checkUrl();
  }

  private handleMutation = (
    mutationsList: MutationRecord[],
    observer: MutationObserver,
  ) => {
    // Check the URL.
    this.checkUrl();
  };

  private checkUrl() {
    const newUrl =
      typeof window !== "undefined"
        ? URLString(window.location.href)
        : URLString("");

    // Check if the full URL has changed, including the hash.
    if (this.isUrlDifferent(newUrl)) {
      // Update the current URL.
      this.currentUrl = newUrl;
      this.callback(newUrl).mapErr((e) => {
        console.log("url check failed", e);
      });
    }
  }

  private isUrlDifferent(newUrl: URLString) {
    // Compare the full URL with the previous full URL
    return newUrl !== this.currentUrl;
  }

  // Call this method to stop watching for DOM mutations.
  public stopWatching() {
    this.observer.disconnect();
  }
}
