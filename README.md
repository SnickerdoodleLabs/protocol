# Snickerdoodle Protocol

## Summary
The Snickerdoodle Protocol (the Protocol) is a decentralized method for doing data analysis and customer contact, that fundamentally shifts how such things are done in favor of the actual user. The Protocol is open and extensible, allowing for uses beyond the original vision. The Protocol defines a Data Wallet (DW), that is controlled by the user, into which their personal data is put and collected, entirely at their discretion. Consumers of the protocol can use the Snickerdoodle Query Language (SDQL) to request an Insight from user's DWs in exchange for some form of reward. The Query Engine part of the wallet will process the SDQL request and return the Insight at the consent of the user, making it a form of distributed computing.  

## Getting Started
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