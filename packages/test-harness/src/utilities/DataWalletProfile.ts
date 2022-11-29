import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import { BigNumberString, ChainId, DirectReward, EChain, ECredentialType, ERewardType, EVMAccountAddress, EVMPrivateKey, EVMTransaction, IpfsCID, LazyReward, MetatransactionSignatureRequest, PageInvitation, RewardFunctionParam, Signature, SiteVisit, TransactionReceipt, UnixTimestamp, UnsupportedLanguageError, URLString, Web2Credential, Web2Reward } from "@snickerdoodlelabs/objects";
import { TestHarnessMocks } from "@test-harness/mocks/index.js";
import { TestWallet } from "@test-harness/utilities/TestWallet.js";
import { BigNumber } from "ethers";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import path from "path";
// import fs from "fs";
import { readFile } from "node:fs/promises";


export class DataWalletProfile {

    private _unlocked = false;
    private _name = "default";
    
    public acceptedInvitations = new Array<PageInvitation>();
    
    public constructor(
        readonly core: SnickerdoodleCore,
        readonly mocks: TestHarnessMocks
    ) {}

    public get name(): string {
        return this._name;
    }

    public get unlocked(): boolean {
        return this._unlocked; 
    }

    public unlock() {
        this._unlocked = true;
    }
    // #region profile loading from files
    public loadFromPath(pathInfo: {name: string, path:string}): ResultAsync<void, Error> {

        this._name = pathInfo.name;

        const root = pathInfo.path;

        return this._loadAccounts(path.join(root, "accounts.json"))

    }

    protected _loadAccounts(accountPath: string): ResultAsync<void, Error> {
        return ResultAsync.fromPromise(readFile(accountPath, { encoding: 'utf8' }), (e) => e as Error)
            .andThen((content) => {
                const accounts = JSON.parse(content);
                const wallets = accounts.map((account) => new TestWallet(account.chainId as EChain, EVMPrivateKey(account.privateKey), this.mocks.cryptoUtils))
                this.mocks.blockchain.updateAccounts(wallets); 
                console.log(`loaded accounts from ${accountPath}`)
                return okAsync(undefined);
            })
            .mapErr((e) => {
                console.error(e);
                return new Error(`Unexpected IO error ${e.message}}`);
            });
    }

    protected _loadDemographic(demographicPath: string): ResultAsync<void, Error> {
        return ResultAsync.fromPromise(readFile(demographicPath, { encoding: 'utf8' }), (e) => e as Error)
            .andThen((content) => {
                const demographic = JSON.parse(content);
                this.core.setAge(demographic.age ?? null);
                this.core.setGender(demographic.gender ?? null);
                this.core.setLocation(demographic.location ?? null);

                // TODO: add more
                
                console.log(`loaded demographic from ${demographicPath}`)
                return okAsync(undefined);
            })
            .mapErr((e) => {
                console.error(e);
                return new Error(`Unexpected IO error ${e.message}}`);
            });
    }
    protected _loadSiteVisits(siteVisitsPath: string): ResultAsync<void, Error> {

        return ResultAsync.fromPromise(readFile(siteVisitsPath, { encoding: 'utf8' }), (e) => e as Error)
            .andThen((content) => {
                const siteVisits = JSON.parse(content).map((sv) => new SiteVisit(
                    URLString(sv.url),
                    UnixTimestamp(sv.startTime),
                    UnixTimestamp(sv.endTime),
                ));

                this.core.addSiteVisits(siteVisits);
                
                console.log(`loaded site visits from ${siteVisitsPath}`)
                return okAsync(undefined);
            })
            .mapErr((e) => {
                console.error(e);
                return new Error(`Unexpected IO error ${e.message}}`);
            });
    }
    protected _loaEVMTransactions(evmTransactionsPath: string): ResultAsync<void, Error> {
        return ResultAsync.fromPromise(readFile(evmTransactionsPath, { encoding: 'utf8' }), (e) => e as Error)
            .andThen((content) => {
                const evmTransactions = JSON.parse(content).map((evmT) => new EVMTransaction(
                    ChainId(evmT.chainId),
                    evmT.hash,
                    evmT.timestamp,
                    evmT.blockHeight,
                    EVMAccountAddress(evmT.to),
                    EVMAccountAddress(evmT.from),
                    evmT.value ? BigNumberString(evmT.value) : null,
                    evmT.gasPrice ? BigNumberString(evmT.gasPrice) : null,
                    evmT.gasOffered ? BigNumberString(evmT.gasOffered) : null,
                    evmT.feesPaid ? BigNumberString(evmT.feesPaid) : null,
                    evmT.events,
                    evmT.valueQuote
                  ));
                
                  this.core.addEVMTransactions(evmTransactions);

                console.log(`loaded evm transactions from ${evmTransactionsPath}`)
                return okAsync(undefined);
            })
            .mapErr((e) => {
                console.error(e);
                return new Error(`Unexpected IO error ${e.message}}`);
            });
    }
    protected _loadEarnedRewards(earnedRewardsPath: string): ResultAsync<void, Error> {
        return ResultAsync.fromPromise(readFile(earnedRewardsPath, { encoding: 'utf8' }), (e) => e as Error)
            .andThen((content) => {
                const rewards = [];
                JSON.parse(content).reduce((all, r) => {
                    switch(r.type) {
                        case ERewardType.Direct:
                            all.push(new DirectReward(
                                IpfsCID(r.queryCID),
                                ChainId(r.chainId),
                                EVMAccountAddress(r.eoa),
                                TransactionReceipt(r.transactionReceipt)
                            ));
                            break
                        case ERewardType.Lazy:
                            all.push(new LazyReward(
                                IpfsCID(r.queryCID),
                                ChainId(r.chainId),
                                EVMAccountAddress(r.eoa),
                                r.functionName,
                                r.functionParams as RewardFunctionParam[]
                            ));
                            break
                        case ERewardType.Web2:
                            all.push(new Web2Reward(
                                IpfsCID(r.queryCID),
                                URLString(r.url),
                                r.credentialType as ECredentialType,
                                Web2Credential(r.credential),
                                r.instructions

                            ));
                    }
                    return all;
                }, rewards);
                
                console.log(`loaded earned rewards from ${earnedRewardsPath}`)
                return okAsync(undefined);
            })
            .mapErr((e) => {
                console.error(e);
                return new Error(`Unexpected IO error ${e.message}}`);
            });
    }
    protected _loadBackup(backupPath: string): ResultAsync<void, Error> {
        return ResultAsync.fromPromise(readFile(backupPath, { encoding: 'utf8' }), (e) => e as Error)
            .andThen((content) => {
                const accounts = JSON.parse(content);
                
                console.log(`loaded accounts from ${backupPath}`)
                return okAsync(undefined);
            })
            .mapErr((e) => {
                console.error(e);
                return new Error(`Unexpected IO error ${e.message}}`);
            });
    }

    // #endregion 


    public signMetatransactionRequest<TErr>(
        request: MetatransactionSignatureRequest<TErr>,
    ): ResultAsync<void, Error | TErr> {
        // This method needs to happen in nicer form in all form factors
        console.log(
        `Metadata Transaction Requested!`,
        `WARNING: This should no longer occur!`,
        `Request account address: ${request.accountAddress}`,
        );
    
        // We need to get a nonce for this account address from the forwarder contract
        return this.mocks.blockchain.minimalForwarder
        .getNonce(request.accountAddress)
        .andThen((nonce) => {
            // We need to take the types, and send it to the account signer
            const value = {
            to: request.contractAddress, // Contract address for the metatransaction
            from: request.accountAddress, // EOA to run the transaction as (linked account, not derived)
            value: BigNumber.from(request.value), // The amount of doodle token to pay. Should be 0.
            gas: BigNumber.from(request.gas), // The amount of gas to pay.
            nonce: BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
            data: request.data, // The actual bytes of the request, encoded as a hex string
            } as IMinimalForwarderRequest;
    
            // Get the wallet we are going to sign with
            const wallet = this.mocks.blockchain.getWalletForAddress(request.accountAddress);
    
            return wallet
            .signMinimalForwarderRequest(value)
            .andThen((metatransactionSignature) => {
                console.log(
                `Metatransaction signature generated: ${metatransactionSignature}`,
                );
    
                return request.callback(metatransactionSignature, nonce);
            });
        });
    }
    
    public getSignatureForAccount(
        wallet: TestWallet,
      ): ResultAsync<Signature, UnsupportedLanguageError> {
        return this.core.getUnlockMessage(this.mocks.languageCode).andThen((message) => {
          return wallet.signMessage(message);
        });
      }
      
    
}