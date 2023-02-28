# Discord Indexer

```mermaid
flowchart TD
    DP[Discord Poller] --Periodically polls--> Monitor[Monitoring Service]
    Monitor --index--> DS[Discord Service]
    DS --Fetch and Sync--> DR[Discord Repository]
``` 

# Discord Service
Discord public api is served through the SocialAccountService.