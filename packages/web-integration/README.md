# web-integration

This package provides an SDK that a Snickerdoodle Protocol-enabled application, such as Galileo, would use on their website. This package creates a Postmate parent proxy for Snickerdoodle Core, instantiating and connecting to the `iframe` package. This proxy implements the `ISnickerdoodleCore` interface and from an end-user standpoint should act functionally identical to having a proper `SnickerdoodleCore` instance. This package provides access to this proxy, but the vast majority of users will not need to use it. Instead, the package provides a number of pre-built UI widgets, along with easy utility functions, that make it trivial to display information from Snickerdoodle Core.

In ordinary practice, an application such as Galileo that wants to display information (or retrieve it) about the user's Snickerdoodle Protocol status, will include this package and make use of the UI widgets it provides, placing them on its own page. This package ONLY works for Single Page Applications (SPAs), as Snickerdoodle Core takes some time to startup and establish itself. Applications built using older techniques with frequent reloads will NOT work with this package OR with Snickerdoodle Protocol; it requires a long-running environment to be efficient. If you are trying to use HNP on such a site it is recommended to create a wrapper frame for your application that hosts the web-integration package, and put your legacy app inside an iframe in the wrapper or use AJAX techniques. Converting a legacy site to a SPA is beyond the scope of this documentation but IS possible.

## Get started

### Installation

install via yarn
`yarn add @snickerdoodlelabs/web-integration`

install via npm
`npm install @snickerdoodlelabs/web-integration`

### How to integrate

calling getReady would be enough to initialize the core but in order to get the user onboarded and be able to use his crypto in payments you need to call startOnboardingFlow in webUIClient which will open snickerdoodle protocol UI modal built in with react.

Here is the full implementation of that:

```
import SnickerdoodleWebIntegration from "@snickerdoodlelabs/web-integration";

const integration = new SnickerdoodleWebIntegration();


integration.getReady().map((coreProxy) => {
    integration.webUIClient.startOnboardingFlow({
        gatewayUrl: gatewayUrl,
        finalSuccessContent: 'Awesome, you can buy credits with your crypto now!',
        showInModal: true,
    }).mapErr((err) => {
      console.log("startOnboardingFlow error", err);
    });
}).mapErr((err) => {
  console.log("getReady error", err);
});
```

The onBoardingFlow diagram is like below:

![alt](documentation/images/OnboardingFlow.png)
