# Configuration Keys Glossary

1. Onboarding Url - The url that hosts the data wallet when the wallet opens up. 
  __ONBOARDING_URL__: "https://datawallet.demo-01.snickerdoodle.dev/",
2. Account Cookie Url - where the cookies of the wallet are hosted. 
  __ACCOUNT_COOKIE_URL__: "https://snickerdoodlelabs.io/",

3. Cookie Lifetime
4. Control Chain ID: The Chain Id of the control chain. `31337` is the default, hardhat chain id. 
5. Supported Chains: These are the chains that run successfully on the Data Wallet. 
These Supported Chains listed as a concatanated string of chain ids all merged together.  
When presented, they appear as such: "80001,43113,1,137,43114,-1,100,56,1284".
Current Supported Chains can be found at [README.md](/documentation/sdql/README.md)

6. IPFS Fetch Base URL: The IPFS fetching url needed to get info based off of the hosted node. 
-  __IPFS_FETCH_BASE_URL__: "https://ipfs-gateway.snickerdoodle.dev/ipfs/",
7. Default Insight Platform Base URL
-   __DEFAULT_INSIGHT_PLATFORM_BASE_URL__:
    "https://insight-api.demo-01.snickerdoodle.dev/v0/"

## Indexer API Keys - Th
8. Covalent API KEY: The Api Key needed in order to operate Covalent's REST Calls.  
9. MORALIS API KEY: The Api Key needed in order to operate Moralis' REST Calls.  
10. NFTSCAN API KEY: The Api Key needed in order to operate Nftscan's REST Calls.  
11. POAP API KEY: The Api Key needed in order to operate Poap's REST Calls.  
12. OKLINK API KEY: The Api Key needed in order to operate Oklink's REST Calls. 

13. DNS SERVER ADDRESS
14. Ceramic Node URL
15. DOMAIN Filter

## Storage Locations
16. Google Cloud Bucket: The identifier used for Google Cloud Bucket that we use to store backups from the data wallet. 
"demo-01-fcszy-sdl-dw"

## Polling Intervals
17. Portfolio Polling Interval: Polling time for the Portfolio Page inside the Data Wallet. 
18. Transaction Polling Interval: Polling time for refreshing the transactional data within the Data Wallet. 
19. Backup Polling Interval: Polling time for searching for updated data that will be sent as backup data to the storage location of choice. 
20. Enable Backup Encryption: A boolean value that determines if the backup data is encrypted and therefore the data can be publicly read but not deciphered.  

## DISCORD CONFIGS
21. Discord Client ID: The entity's Discord ID - used to make oauth requests via discord. 
22. Discord Client Key: Discord's secret variable used while making oauth requests. 
23. Discord Poll Interval: Polling Interval used to update discord profiles and guilds on the Data Wallet. 

## Twitter CONFIGS
24. Twitter Consumer Key: Twitter's consumer key used while making oauth requests.
25. Twitter Consumer Secret: Twitter's secret variable used while making oauth requests.
26. Twitter Poll Interval: Polling Interval used to update twitter account information on the Data Wallet. 

## INFURA CONFIGS
27. Primary Infura Key: Key used to identify Infura
- __PRIMARY_INFURA_KEY__: "";
28. Dev Chain Provider URL: The Url used to host the development protocol chain. 
- __DEV_CHAIN_PROVIDER_URL__: "https://doodlechain.demo-01.snickerdoodle.dev";