# Architecture of the Console Application for dynamic scenario testing.

## Components
```mermaid
flowchart TD
    Prompt---has1{has}-->Environment
    Environment---has2{has}--a-->BusinessProfile
    Environment---has3{has}--a-->DataWalletProfile
    Environment---has4{has}--a-->TestHarnessMocks
    DataWalletProfile---has5{has}--a-->SnickerdoodleCore
    DataWalletProfile---has6{has}--a-->TestHarnessMocks

    TestHarnessMocks---has10{has}--many-->Services

```


## Prompt map

```mermaid
flowchart LR
    MainPrompt --> CorePrompt
    MainPrompt --> SimulatorPrompt

    
    CorePrompt --> UnlockCore
    CorePrompt --> AddAccount
    CorePrompt --> CheckAccount
    CorePrompt --> RemoveAccount
    CorePrompt --> OptInCampaign
    CorePrompt --> OptOutCampaign


    
    SimulatorPrompt --> CreateCampaign
    SimulatorPrompt --> PostQuery
    SimulatorPrompt --> SetMaxCapacity

    core.onQueryPosted --> ApproveQuery

```

## Initialization code

The interactive console app is created by the [PromptFactory](../src/utilities/PromptFactory.ts) class. It initializes the core and attaches event listeners. 

## Where to keep mocks:
The [TestHarnessMocks](../src/mocks/TestHarnessMocks.ts) hosts all the mocked data and services that are not specific to a business / datawallet profile.

DataWallet related sample data/ops should go to DataWalletProfile class, and Business related sample data/ops should go to BusinessProfile class.