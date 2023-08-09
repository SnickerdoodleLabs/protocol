## Objective
Queries can have Ads. When it has Ads, we wait till the expiration of the query (**with a grace period**) to collect as many ad signatures as possible. This process is complicated as should be extracted to a process class.

```mermaid
flowchart TD

QS[[Query Scheduler]]--Interval, Query-->Q[[Query Service]]
Q --> Comp[[Compensation Evaluator]]


Comp --> AdExists{Have ads?}
AdExists --Y--> ExpiryCheck{Expiry Close?}
AdExists --N: No Ads--> Eval[/Evaluate the compensations \nand return to IP/]
ExpiryCheck--N--> AdSignature{Does have \nrequired signatures\n for all the \ncompensations}
ExpiryCheck--Y: No Time--> Eval
AdSignature --Y: Have all signatures -->Eval
AdSignature --N -->Re[/Reschedule/]
Re --Interval, Query--> QS


```

## Evaluate Compensation Pre-conditions

Either one of the following must be TRUE before we can evaluate the compensations of a query

1. No Ads
2. No **time** to wait for Ads (grace period is over)
3. Have required signatures


## Sequence Diagram
The execution process is a multi-step asynchronous process. First, when a query is available on blockchain, the blockchain listener initiates the scheduling of the query. This process creates a QueryStatus object for the query. Second, there is a periodic process that processes all the queries with the status EQueryProcessingStatus.AdsCompleted for insights and rewards. 

Essentially, all the queries with Received status will transformed into AdsCompleted status before insights and rewards are processed.

### 1. Scheduling Queries
```mermaid
sequenceDiagram

participant BL as Blockchain Listener
participant QS as Query Service
participant CL as Core Listener
participant C as Core

loop periodically
    activate BL
    Note over BL: listenForConsentContractsEvents
    BL ->> QS: requestForDataObject
    activate QS
    Note over QS: onQueryPosted
    note over QS: Creates a new QueryStatus object <br> with status either <br> EQueryProcessingStatus.Received <br> or EQueryProcessingStatus.NoConsentToken
    QS -->> CL: raise onQueryPosted event
    deactivate QS
    deactivate BL

    activate CL
    note over CL: handles onQueryPosted
    CL ->> C: consentContractAddress, query, params
    activate C
    note over C: approveQuery
    activate QS
    C ->> QS: consentContractAddress, query, params
    note over QS: approveQuery
    note over QS: Set the status to AdsCompleted
    deactivate QS
    deactivate C
    deactivate CL
end
```

### 2. Processing Insights and Rewards

```mermaid
sequenceDiagram
participant QS as Query Service
participant QPE as Query Parsing Engine
loop periodically
    activate QS
    note over QS: returnQueries
    QS ->> QPE: queries with AdsCompleted status
    activate QPE
    note over QPE: handleQuery
    QPE ->> QS: rewards
    note over QS: update status to RewardsReceived
    deactivate QPE
    deactivate QS
end

```

## Query Status
```mermaid
stateDiagram-v2
[*] --> Received: if consent
[*] --> NoConsentToken : if no consent

Received -->AdsCompleted: No restriction and immediate
AdsCompleted --> NoRewardsParams: if required reward parameters are missing
AdsCompleted --> RewardsReceived: else

NoRewardsParams --> [*]
RewardsReceived --> [*]
NoConsentToken --> [*]
```