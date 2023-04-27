## Objective
Queries can have Ads. When it has Ads, we wait till the expiration of the query (with a grace period) to collect as many ad signatures as possible. This process is complicated as should be extracted to a process class.

```mermaid
flowchart TD
Q[Query] --> Comp[Compensation Evaluator]


Comp --> AdExists{Query have ads?}
AdExists ---Y0--> ExpiryCheck{Expiry Close?}
AdExists ---No1--> Eval[Evaluate the compensations \nand return to IP]
ExpiryCheck---No2--> AdSignature{Does have \nrequired signatures for \nall the compensations}
ExpiryCheck---Y1--> Eval
AdSignature --Y2--->Eval
AdSignature ---N3--->Wait[Return to Query Scheduler]
Wait --After 1 hour--->Q

```

## Evaluate Compensation Pre-conditions

Either one of the following must be TRUE before we can evaluate the compensations of a query

1. No Ads
2. No **time** to wait for Ads
3. No **need** to wait for Ads (got all the signatures)