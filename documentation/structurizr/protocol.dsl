workspace "Snickerdoodle" "Snickerdoodle Protocol" {
    model {
        user = person "User" "Someone using the Data Wallet"
        businessUser = person "Business User" "A user of the Insight Platform"
        
        snickerdoodle = enterprise "Snickerdoodle" {
            admin = person "Administrator" "Someone with root permissions to the system"
            csa = person "Customer Service Agent" "A customer service representative"
            
            dataWallet = softwareSystem "Data Wallet" "The Snickerdoodle Data Wallet, in some form factor" {
                testHarness = container "Test Harness" "A specific form factor that houses an instance of Snickerdoodle Core and a simulator for the Insight Platform API"
                browserExtension = container "Browser Extension" "A specific form factor for the Core, packaged as a Manifest V3 Browser Extension" {
                    
                }
                snickerdoodleCore = container "Snickerdoodle Core" "The Snickerdoodle Core, which manages data storage and access and processing of queries" {
                    queryParsingEngine = component "QueryParsingEngine" "Listens for posted queries, retrieves them from IPFS, and creates insights based on data in Persistence"
                    persistence = component "Persistence" "All data is stored in a tiered persistence layer that does periodic, partial backups using Ceramic"
                    indexers = component "Indexers" "Collection of classes that periodically or on demand index Web3 data and store it into Persistence"
                    core = component "Core" "Wrapper that combines all other components into a single class. Adds account management methods and methods for adding data collected by the form factor to Persistence."
                    
                    core -> indexers "Contains"
                    core -> queryParsingEngine "Contains"
                    core -> indexers "Contains"
                    core -> persistence "Contains"
                    indexers -> persistence "Loads data from Web3"
                    persistence -> queryParsingEngine "Reads data"
                }
                onboardingSPA = container "Onboarding SPA" "A single page application that runs in a browser that provides functionality for the Core that is form-factor independant"
               
                
                testHarness -> core "Hosts"
                browserExtension -> core "Hosts"
                browserExtension -> onboardingSPA "Opens"
            }
            
            insightPlatform = softwareSystem "Insight Platform" "The Snickerdoodle Protocol" {
                authentication = container "Authentication Microservice" "Deals with issuing and verifying JWT tokens"
                chain = container "Chain Microservices" "A collection of microservices linked by a common API. Each service works with a particular chain" {
                    -> authentication "Uses"

                    component "Database" "A Mysql Database"
                    component "Business" "The business layer" 
                }
                ipfs = container "IPFS Microservice" "Posts and retrieves data from IPFS" {
                    -> authentication "Uses"
                }
                aggregator = container "Aggregator Microservice" "Recieves data from Insight API and stores it. Correlates and formats data for display by the Business API" {
                    -> authentication "Uses"
                }
                business = container "Business Microservice" "Business, Business User, and Campaign creation and administration" {
                    -> authentication "Uses"
                    -> chain "Uses"
                    -> ipfs "Uses"
                }
                payments = container "Payments Microservice" "Handles payments and invoices" {
                    -> authentication "Uses"
                }
                query = container "Query Microservice" "Create, manage, and post SDQL Queries" {
                    -> authentication "Uses"
                    -> ipfs "Uses"
                    -> chain "Uses"
                }
                rewards = container "Rewards Microservice" "Create and manage both Web3 and Web2 rewards" {
                    -> authentication "Uses"
                    -> chain "Uses"
                }
                adminGateway = container "Admin Gateway" "REST interface specifically for the Admin Protal" {
                    -> authentication "Uses"
                }
                businessGateway = container "Business Gateway" "REST interface for the Business Portal" {
                    -> aggregator "Uses"
                    -> authentication "Uses"
                    -> business "Uses"
                    -> chain "Uses"
                    -> query "Uses"
                    -> rewards "Uses"
                    
                }
                insightGateway = container "Insight Gateway" "REST interface for the Data Wallet" {
                    -> chain "Uses"
                    -> query "Uses"
                    -> aggregator "Uses"
                }
                adminPortal = container "Admin Portal" "A user interface for admins and CSA" {
                    -> adminGateway "Uses"
                }
                businessPortal = container "Business Portal" "A user interface to the insight platform" {
                    -> businessGateway "Uses"
                }
            }
        }
        
        blockchain = softwareSystem "blockchain" "Various Blockchains" {
        }

        user -> dataWallet "Uses"
        businessUser -> insightPlatform "Uses"
        admin -> insightPlatform "Uses"
        csa -> insightPlatform "Uses"
        
        dataWallet -> blockchain "Access"
        dataWallet -> insightPlatform "Insight API"
        insightPlatform -> blockchain "Access"
        
        deploymentEnvironment Development {
            deploymentNode Kubernetes {
                softwareSystemInstance dataWallet {
                    
                }
                softwareSystemInstance insightPlatform {
                    
                }
            }
        }
        
        deploymentEnvironment Production {
            
        }
    }

    views {
        systemLandscape snickerdoodle "Snickerdoodle" {
            include *
            autoLayout
        }
    
        systemContext dataWallet "DataWalletSystemContext" "Data Wallet" {
            include *
            autoLayout
        }
        
        systemContext insightPlatform "InsightPlatformSystemContext" "Insight Platform" {
            include *
            autoLayout
        }
        
        container dataWallet "DataWalletContainer" "Data Wallet" {
            include *
            autoLayout
        }
        
        container insightPlatform "InsightPlatformContainer" "Insight Platform" {
            include *
            autoLayout
        }
        
        component onboardingSPA "OnboardingSPAComponent" "Onboarding SPA" {
            include * 
            autoLayout
        }
        
        component snickerdoodleCore "SnickerdoodleCoreComponent" "Snickerdoodle Core" {
            include * 
            autoLayout
        }
        
        component browserExtension "BrowserExtensionComponent" "Browser Extension" {
            include * 
            autoLayout
        }
        
        component testHarness "TestHarnessComponent" "Test Harness" {
            include * 
            autoLayout
        }
        
        component adminPortal "AdminPortalComponent" "Admin Portal" {
            include * 
            autoLayout
        }
        
        component businessPortal "BusinessPortalComponent" "Business Portal" {
            include * 
            autoLayout
        }
        
        component adminGateway "AdminGatewayComponent" "Admin API" {
            include * 
            autoLayout
        }
        
        component businessGateway "BusinessGatewayComponent" "Business API" {
            include * 
            autoLayout
        }
        
        component insightGateway "InsightGatewayComponent" "Insight API" {
            include * 
            autoLayout
        }

        styles {
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }
        }
    }
}