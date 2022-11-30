import { Environment, TestHarnessMocks } from "@test-harness/mocks/index.js";
import { ApproveQuery, CorePrompt, MainPrompt, SimulatorPrompt } from "@test-harness/prompts/index.js";
import { BusinessProfile } from "@test-harness/utilities/BusinessProfile.js";
import { DataWalletProfile } from "@test-harness/utilities//DataWalletProfile.js";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import { IConfigOverrides, ISnickerdoodleCore, SDQLQueryRequest } from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";

export class PromptFactory {

    protected createCore(mocks: TestHarnessMocks): SnickerdoodleCore {
        const core = new SnickerdoodleCore(
            {
                defaultInsightPlatformBaseUrl: "http://localhost:3006",
                dnsServerAddress: "http://localhost:3006/dns",
            } as IConfigOverrides,
            undefined,
            mocks.fakeDBVolatileStorage,
        );


        return core;
    }

    protected initCore(core: ISnickerdoodleCore, env: Environment): void {
        
        core.getEvents().map(async (events) => {
            events.onAccountAdded.subscribe((addedAccount) => {
                console.log(`Added account`);
                console.log(addedAccount);
            });
        
            events.onInitialized.subscribe((dataWalletAddress) => {
                console.log(`Initialized with address ${dataWalletAddress}`);
            });
        
            events.onQueryPosted.subscribe(async (queryRequest: SDQLQueryRequest) => {
                console.log(
                    `Recieved query for consentContract ${queryRequest.consentContractAddress} with id ${queryRequest.query.cid}`,
                );
        
                try {

                    await new ApproveQuery(env, queryRequest).start();
                                            
                } catch (e) {
                    console.error(e);
                }
            });
        
            events.onMetatransactionSignatureRequested.subscribe(async (request) => {
                // This method needs to happen in nicer form in all form factors
                console.log(
                    `Metadata Transaction Requested!`,
                    `Request account address: ${request.accountAddress}`,
                );
        
                await env.dataWalletProfile.signMetatransactionRequest(request).mapErr((e) => {
                    console.error(`Error signing forwarding request!`, e);
                    process.exit(1);
                });
            });
        
        });

    }

    public createDefault(): MainPrompt {
        const mocks = new TestHarnessMocks()
        const core = this.createCore(mocks)
        const dataWalletProfile = new DataWalletProfile(core, mocks)
        const env = new Environment(
            new BusinessProfile(),
            dataWalletProfile,
            mocks
        );
        
        
        dataWalletProfile.loadDefaultProfile();
        this.initCore(core, env);


        return new MainPrompt(
            env,
            new CorePrompt(env),
            new SimulatorPrompt(env)
        );
    }
}