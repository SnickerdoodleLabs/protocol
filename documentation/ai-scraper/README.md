# Requirement

1. Different URL has different types of data, e.g., purchase history, products, discord, twitter, games, etc.
2. First problem is classifying URL to specific domain/platform (Amazon, Twitter, Epic Games)
3. Second problem is classifying URL to specific task processor (games, products, purchase history, search keywords, twitter followers, twitter interests, discord servers)
4. We want new domain scrapers to be pluggable.
5. We want new task processor to be pluggable and reusable(!).

# Architecture

Process

In this process, we assume the user visits **Amazon Order History** page.

**Step 1. Check the permission for the domain and the task**

```mermaid
sequenceDiagram

participant U as Browser
participant FF as Form Factor
participant SS as Scraper Service
participant Classifier as WebPage Classifier
participant SJR as Scraper Job Repository

U->FF: User visits a site
activate FF

    FF->>SS: hasPermission(sourceDomain, URL)
    activate SS

        SS->>PermissionUtils: Checks permission to read web (EDataWalletPermission)
        activate PermissionUtils
            PermissionUtils -->> SS: permission
        deactivate PermissionUtils

        SS->>ScrapePermissionUtils: check if URL-domain permission
        activate ScrapePermissionUtils
            ScrapePermissionUtils-->>SS: domain permission status('allowed'/'restricted'/null)
        deactivate ScrapePermissionUtils
        SS-->>FF: return permission for the URL

    deactivate SS

    note over FF: If FF has permission to scrape Amazon
    FF->U: get HTML
    FF->>SS: Scrape(URL, HTML)
    activate SS
        SS->>Classifier: classify page
        activate Classifier
            Classifier-->>SS: domain: "Amazon", task: "purchase_history"
        deactivate Classifier

        SS->>SJR: Enqueue Job(URL, HTML, "Amazon", "purchase_history")


    deactivate SS

    note over FF: If no existing permission for Amazon
    FF->>Classifier: classify page
    activate Classifier
        Classifier-->>FF: domain: "Amazon", task: "purchase history"
    deactivate Classifier
    note over FF: Encourage user to mine it


deactivate FF

```

**Step 2. Executing the domain and the task**

```mermaid
sequenceDiagram

participant SP as Scraper Poller
participant SJR as Scraper Job Repository
participant LLM as LLM Scraper
participant PU as PromptUtils
participant LLMProvider as LLM Provider
participant T as Text Preprocessor
participant DTU as DomainTaskUtils

loop Periodically
    activate SP
        SP->>SJR: Get a set of jobs with one pair of domain and task
        activate SJR
            SJR-->>SP: jobs
        deactivate SJR

        note over SP: if the domain and task is supported by LLM
        SP->>LLM: scrape(jobs)
        activate LLM
            LLM->>PU: Initialize Prompt (domain, task)
            PU-->LLM: Prompt

            loop for each job
                LLM->>T: convert HTML to text and minimize
                T-->>LLM: minimzed Text
                LLM->>PU: add to Prompt if have token budget
            end

            LLM->>LLMProvider: send Prompt
            LLMProvider-->>LLM: response

            LLM ->> DTU: parse response and save data
            LLM -->> SJR: reschedule jobs not done.
        deactivate LLM

    deactivate SP

end


```

## Implementation Tech

1. Web-workers
2. IPFS to collect URLs?
