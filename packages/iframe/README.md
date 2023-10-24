# `iframe`

This package is a proxy that wraps up the SnickerdoodleCore object from the `core` project inside the context of an iframe for usage on the web. This package uses webpack to create a single deliverable file; for development purposes this file will be built and served by a small NGINX webserver inside a docker container.

The iframe proxy is based on the Postmate library, and acts as a child in the library. It can emit events and recieve event emissions; our modifications to the library make it act like a proper RPC api.

## Design

This package uses the standard 4 layer design (see `core` for details), with a call-down, event-up pattern, and adheres to SOLID principles. It is very simple, though, and is missing the Data and Utils layers.

Currently, event emissions from the SnickerdoodleCore objects are subscribed to and proxied by the API-layer CoreListener itself, but to properly follow the pattern, the events should be relayed to the Business layer in a service, and then down to a repository to be emitted. The current design, while improper, saves a lot of code.

## Development

This package inclucde a webpack configuration, which is considered the final deliverable.

`yarn compile`

Compiles the package, but does not build the webpack file.

`yarn build`

Compiles the package and builds the webpacked output.

`yarn dockerize`

Builds an NGINX docker image that serves the webpacked content.

`yarn docker-push`

Pushes the built docker image with the :local tag up to Docker Hub. Must have permissions to do this.

`yarn test`

Runs the unit and integration tests on the package.
