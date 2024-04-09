# Ad Ecosystem / User Stories DRAFT

## Actors
**Marketing platform (MP)/ Insight Platforms** -- also called the Snickerdoodle Insight  platform, this is Snickerdoodle's business application. This is a check clearing house based on impression tokens and surface tokens.

**Data Wallet (DW)** -- the Snickerdoodle Data Wallet

**DW user** -- the individual user of a DW

**Audience** - the DW users that are members of a consent contract

**Brand(Ad buyer)** -- a brand that is using the Snickerdoodle platform to pay to have ads delivered to DW users (likely also someone operating a consent contract, i.e. an Audience Owner, but not a requirement)

**Audience Owner** -- the organization on the Snickerdoodle Marketing Platform that owns a consent contract with members

**DW integrator** -- this is an application which has integrated the Snickerdoodle core package thereby giving its users access to a DW in their application (Ex: MetaMask)

**Ad injector** -- the DW integrator which is injecting the ad from an individual's ad queue to the Ad surface where the ad will be viewed by the DW user (Ex: Metamask). This is merged with the integrator.

**Ad surface** -- where the ad will be viewed by the DW user, this could be a website, a mobile app, a smart billboard, or another experience (Ex: Reddit App on iOS)

**Survey RFD (Queries)** - a request for data event that is being used to fill an analytics dashboard

**Ad RFD (Queries)** - a request for data event that is being used to queue an ad for delivery to an audience

**Ad Agent** The agent pays out the Ad surfaces (micro transactions). Surfaces registers with the ad agents with expected fees. Separate from our insight platform. Ad Agent has a sign-up flow for Ad Surfaces. So, Ad surfaces are not directly connected to IP or surfaces are not a part of the protocol. Ad agents pays out all the parties.

**Consent Contract** - makes onchain payments to all the parties when the insight platform release the money.

**DAO**: manage registries and verify actors against their registries. Adjudicator for disputes.

## Registries
**Insight Platform Registry**
**Integrator Registry**
**Surface Registry**
**Ad Agent Registry**
**Payment Token Registry**


In progress user stories are [here](https://docs.google.com/document/d/1Z1wszTSWFXt1HEUF9hjplI9O2CZEMgKwUZS-qXn4io0/edit).