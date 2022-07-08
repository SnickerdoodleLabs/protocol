# Getting Started

The Protocol repository is structured as a [monorepo](https://en.wikipedia.org/wiki/Monorepo) and uses [lerna](https://lerna.js.org/) for package development and management.

## Requirements

You will need the following dependencies installed on your development machine:

- local installation of Yarn 2 
- global installation of Typescript (we hope to fix this in the future)
- [Docker Engine](https://docs.docker.com/engine/install/) 
- [Docker Compose](https://docs.docker.com/compose/install/)


## Publishing Packages

Not all the packages in this monorepo are published to NPM. Only the packages meant for consumption outside the monorepo are published.

The basic command is:

```shell
yarn npm publish --access public
 ```