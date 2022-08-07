# Getting Started

The Protocol repository is structured as a [monorepo](https://en.wikipedia.org/wiki/Monorepo) and uses [yarn](https://yarnpkg.com/) for package development and management.

## Requirements

You will need the following dependencies installed on your development machine:

- local installation of [Yarn 2](https://yarnpkg.com/) 
- global installation of [Typescript](https://www.typescriptlang.org/) (we hope to fix this in the future)
- [Docker Engine](https://docs.docker.com/engine/install/) 
- [Docker Compose](https://docs.docker.com/compose/install/)


## Publishing Packages

Not all the packages in this monorepo are published to NPM. Only the packages meant for consumption outside the monorepo are published.

The basic command is:

```shell
yarn npm publish --access public
 ```

## Troubleshooting 

### Run Errors

If you are running into compile and run errors with the stack. Almost all of them boil down to either cleaning out the `node_modules` folder and reinstalling everything.
Use:

```shell
yarn clean
yarn clean-node
yarn install
yarn compile
```

at the root as a first *goto* to strange import-related errors. 

The other large case revolves around Docker usage (usually noticed during `yarn start`). Please know that you have to maintain two different NPM environments:

1. your local (which is used when you do `yarn compile` ) and 
2. the docker image (which is used when you do `yarn start`) 

Any time you change anything in a `package.json` file (install modules, change versions, etc), you will need to re-`yarn dockerize` to make sure that change makes it into your docker image.
You do not need to dockerize for non `package.json` changes. Be aware that everybody is currently making `package.json` changes! We have a huge volume of code being merged all the time. 
So anytime you do a merge or rebase from dev, you will probably want to reflexively do a `yarn install` and `yarn dockerize` on your local, or you can expect issues.

If you experience issues with *dockerizing* on M1 macs you'll need to clean out docker as well.

If, after cleaning out your `node_modules` you still get import errors, the next most common cause is actual issues with `import` statements. When you are importing a file from the same package you are in, you have to use the `@my-package/interfaces/etc` import format. If you are importing from another package, you have to use `@snickerdoodlelabs/my-other-package`.  
Sometimes `tsc` will let you get away with doing this incorrectly, but `Jest`, `tsc`, and `webpack` all seem to follow SLIGHTLY different rules and inevitibly they will bite you. 
The error messages for `tsc`, particularly when doing `yarn test` and using `Jest` seem to be very bad, and even completely misleading at times. Check your `import` statements if you see something really intractable.

### Pull Request, Merge, or Rebase Errors

After doing rebases or merges, make sure to do a `yarn install` before you create a PR. The `yarn.lock` file has been the victim of a few bad merges because it is simply impossible to review that hunk of junk in the context of a PR. 
It's quite possible/likely that Github's auto-merge of a PR is the actual culprit, but we can minimize issues by taking this extra step.

This goes along with other pre-PR hygiene. Make sure to both `yarn compile`, `yarn dockerize`, `yarn test`, and `yarn format` before you create a PR with your code, to make sure everything is as legit as can be. 
I also recommend doing a code review on your own PR before you send it to other people. That's what I do at least most of the time, and especially for big PRs. You can look at your changes and often catch stuff.

### IPFS Troubles

Snickerdoodle Protocol uses IPFS as its [content addressable network](https://www.wikiwand.com/en/Content-addressable_network) of choice. The most common error developers face when 
using IPFS, in our experience, is mixing up the **ADMIN** api and **GATEWAY** apis. 

The *ADMIN* api is hosted on port `5001` and is used for pinning assets to the IPFS network. The IPFS HTTP client only works with this api (on port `5001`), it is not useful for fetching 
existing assets from the GATEWAY api. This port must not be exposed to the internet otherwise malicious actors will gain control of your IPFS node. 

The *GATEWAY* api is hosted on port `8080` and is intended to be exposed to the internet. It is a simple HTTP server and assets can be retrieved by a simple `fetch` or `GET` from this 
port. It is this port where you should be retrieving assets from (i.e from `https://myipfshost:8080/ipfs/Qm....`).