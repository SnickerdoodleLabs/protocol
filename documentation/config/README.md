# Configuration Keys Glossary

## URLs
1. Onboarding Url - The Data Wallet injects its proxy object to the onboarding url.  Upon opening the data wallet, the page redirects to the onboarding url.  Only SPA can communicate with the extension proxy. 
Ex: __ONBOARDING_URL__: "https://datawallet.demo-01.snickerdoodle.dev/",
2. Account Cookie Url - The unlock credentials that are stored within the http domain as a cookie. 
Ex: __ACCOUNT_COOKIE_URL__: "https://snickerdoodlelabs.io/",
3. Cookie Lifetime: the life time for https-only-cookies that we are storing on snickerdoodlelabs.io for auto unlocking
4. Control Chain ID: The Chain Id of the control chain. `31337` is the default, hardhat chain id.  Can also be changed to doodlechain when running outside of prod environment. No other entity should be changing this value.  
5. Supported Chains: These are the chains that run successfully on the Data Wallet. 
These Supported Chains are listed as a concatanated string of the chain ids that will be used in this instance of the data wallet.  
When presented, they appear as such: "80001,43113,1,137,43114,-1,100,56,1284".
Current Supported Chains can be found at [README.md](/documentation/sdql/README.md)

## Indexer API Keys
6. Covalent API KEY: The Api Key needed in order to operate Covalent's REST Calls.  
7. MORALIS API KEY: The Api Key needed in order to operate Moralis' REST Calls.  
8. NFTSCAN API KEY: The Api Key needed in order to operate Nftscan's REST Calls.  
9. POAP API KEY: The Api Key needed in order to operate Poap's REST Calls.  
10. OKLINK API KEY: The Api Key needed in order to operate Oklink's REST Calls. 
11. Primary Infura Key: The Api Key needed in order to operate Infura's REST CALLS. 

## Storage Locations
12. Google Cloud Bucket: The GCP bucket identifier used for Google Cloud Bucket that we use to store backups from the data wallet. If left 
"demo-01-fcszy-sdl-dw"

## Backups and Polling Intervals
13. Portfolio Polling Interval: Polling time for the Portfolio Page inside the Data Wallet. 
- Sets a polling time interval to review current information and check if there are any changes since the last backup.  If there are changes, the portfolio reflects these changes and displays them accordingly.  This includes sending new backup data to the cloud.  If there aren't any changes, it continues displaying the cached information. 
14. Transaction Polling Interval: Polling time for refreshing the transactional data within the Data Wallet. Sets a polling time interval to make a call to look for new transactions since last polling time.  If there are new transactions, then update the backup information.  
15. Backup Polling Interval: Polling time for searching for updated data that will be sent as backup data to the storage location of choice. 
16. Enable Backup Encryption: A boolean value that determines if the backup data is encrypted and therefore the data can be publicly read but not deciphered.  

## DISCORD CONFIGS
17. Discord Client ID: The entity's Discord ID - used to make oauth requests via discord. 
18. Discord Client Key: Discord's secret variable used while making oauth requests. 
19. Discord Poll Interval: Polling Interval used to update discord profiles and guilds on the Data Wallet. 

## Twitter CONFIGS
20. Twitter Consumer Key: Twitter's consumer key used while making oauth requests.
21. Twitter Consumer Secret: Twitter's secret variable used while making oauth requests.
22. Twitter Poll Interval: Polling Interval used to update twitter account information on the Data Wallet. 

## OPTIONAL CONFIGS
23. Default Insight Platform Base URL: The IP http used for run  Insight Platform.  The url would adjust depending on the entity that uses the product. 
Ex: __DEFAULT_INSIGHT_PLATFORM_BASE_URL__: "https://insight-api.dev.snickerdoodle.dev/v0/"
24. Dev Chain Provider URL: The Url used to host the development protocol chain. 
Ex: __DEV_CHAIN_PROVIDER_URL__: "https://doodlechain.demo-01.snickerdoodle.dev";
25. IPFS Fetch Base URL: 
The IPFS fetching url needed to get info based off of the hosted node. 
Ex: __IPFS_FETCH_BASE_URL__: "https://ipfs-gateway.snickerdoodle.dev/ipfs/",
26. Ceramic Node URL: OBSOLETE - NOT NECESSARY
27. DNS SERVER ADDRESS: read txt records - proof of ownership on any domain (Cloudflare)
28. DOMAIN Filter: sample values include regex (localhost), do not need to store in browsing history
