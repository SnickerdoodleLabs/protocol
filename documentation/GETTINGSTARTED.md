# Getting Started
You'll need to have Yarn 2 installed on your local, and you'll want Typescript installed globally (although I hope to fix this in the future).

## Publishing Packages
Not all the packages in this monorepo need to actually be published to NPM. Only the packages meant for consumption outside the monorepo need this.

The basic command is `yarn npm publish --access public`

## Concepts
### Control Chain
Snickerdoodle Labs maintains an Avalanche subnet 

## Process For Handling a Query
### Listen for event on the Control Chain RequestForData
### Pull IPFS Content for Query
### Check consent for the query
1. check that the consent token is valid for this query
2. Emit event OnQueryPosted to the Form Factor.
### Form factor calls processQuery(qid) on the Query Engine
### Parse the query
### Generate an insight(s)
### Redeem the reward
### Deliver the insight