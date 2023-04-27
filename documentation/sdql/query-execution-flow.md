## Objective
Queries can have Ads. When it has Ads, we wait till the expiration of the query (**with a grace period**) to collect as many ad signatures as possible. This process is complicated as should be extracted to a process class.

```mermaid
flowchart TD
Q[Query] --> Comp[Compensation Evaluator]


Comp --> AdExists{Query have ads?}
AdExists --Y--> ExpiryCheck{Expiry Close?}
AdExists --N: No Ads--> Eval[Evaluate the compensations \nand return to IP]
ExpiryCheck--N--> AdSignature{Does have \nrequired signatures for \nall the compensations}
ExpiryCheck--Y: No Time--> Eval
AdSignature --Y: Have all signatures -->Eval
AdSignature --N-->Wait[Return to Query Scheduler]
Wait --Interval-->Q

```

## Evaluate Compensation Pre-conditions

Either one of the following must be TRUE before we can evaluate the compensations of a query

1. No Ads
2. No **time** to wait for Ads (grace period is over)
3. Have required signatures