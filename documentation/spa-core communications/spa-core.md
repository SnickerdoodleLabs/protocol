# SPA-Data Wallet Communications
Extension on boarding is a single page react application (SPA) that the data wallets communicates for various purposes. There is no direct communication between the SPA and the data wallet as one of them is a web page and the other one is a browser extension. The way we make them communicate is through listening rpc events that they emit. (analogous to microservice communications ).
# Example
Lets try to add the new discord service that we created at the data wallet to the spa
```
    @injectable()
	export class DiscordService implements IDiscordService {
  	public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IDiscordRepositoryType) public discordRepo: IDiscordRepository,
  ) {}

    public getUserProfiles(): ResultAsync<DiscordProfile[], PersistenceError> {
    return this.discordRepo.getUserProfiles();
  	}
  }

```
1. First, we add our service to the [SnickerdoodleCore](./../../packages/core/src/implementations/SnickerdoodleCore.ts) . This file is the main registry for the data wallet methods. In order to do this we will add the discord service to the [SnickerdoodleCore.module](./../../packages/core/src/implementations/SnickerdoodleCore.module.ts) 

```
    export const snickerdoodleCoreModule = new ContainerModule(
	 ...
     bind<IDiscordService>(IDiscordServiceType)
        .to(DiscordService)
        .inSingletonScope();
      )
```
After that we can use it in [SnickerdoodleCore](./../../packages/core/src/implementations/SnickerdoodleCore.ts)
```
export class SnickerdoodleCore implements ISnickerdoodleCore {
  protected iocContainer: Container;

  public marketplace: ICoreMarketplaceMethods;
  public integration: ICoreIntegrationMethods;
  public discord : ICoreDiscordMethods;

  public constructor(
    configOverrides?: IConfigOverrides,
    storageUtils?: IStorageUtils,
    volatileStorage?: IVolatileStorage,
    cloudStorage?: ICloudStorage,
  ) {
  ...
  this.discord = {
        getUserProfiles : () => {
          const discordService = this.iocContainer.get<IDiscordService>(IDiscordServiceType);
          return discordService.getUserProfiles();
        },
       }
   }
    
```
We will also update the interface, [ISnickerdoodleCore](./../../packages/objects/src/interfaces/SnickerdoodleCore.ts) so other parts of our code can call our new methods 
```
export interface ISnickerdoodleCore {
...
discord : ICoreDiscordMethods;
}
export interface ICoreDiscordMethods {
    getUserProfiles(): ResultAsync<DiscordProfile[], PersistenceError>
  
}
    
```
A thing to mention here is we added another interface IDiscordCoreMethods, while this is not necessary it helps us to group the methods (core has to many methods) , this approach however comes with the burden of maintaining it. We will have to update multiple interfaces in the future if we want to change the discord service.


2. Now that we added the our service to core package it is time to update the synamint-extension-sdk package. This package handles the rpc calls and delegates them to  [SnickerdoodleCore](./../../packages/core/src/implementations/SnickerdoodleCore.ts) methods. Each methods has events associated with them at [actions](./../../packages/synamint-extension-sdk/src/shared/enums/actions.ts) in our case we want spa to call the data wallet so we will add new values to EExternalActions enum.
```
export enum EExternalActions {
  ...
    GET_DISCORD_USER_PROFILES = "GET_DISCORD_USER_PROFILES",
  }

```
We fallow the same service repository approach on synamint-extension-sdk package as such  we will have to add a new discord service with interfaces to this package as well. Only purpose of the new discord service would be to call the core package, but if needed you could add some logic as well such as cookies to store data.
```
  @injectable()
  export class DiscordService implements IDiscordService {
    constructor(
      @inject(IDiscordRepositoryType)
      protected discordRepository: IDiscordRepository,
    ) {}
        getUserProfiles(): ResultAsync<DiscordProfile[], SnickerDoodleCoreError> {
        return this.discordRepository.getUserProfiles();
    }
    
    }

```
A point of difference for our new methods is that they now abstract their error interfaces as SnickerDoodleCoreError, this way we don't have import the core error interfaces but of course we will relay the error messages 

```
  @injectable()
export class DiscordRepository implements IDiscordRepository {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}
  getUserProfiles(): ResultAsync<DiscordProfile[], SnickerDoodleCoreError> {
    return this.core.discord.getUserProfiles().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  	}
  }

```
We will add our new services to the [ExtensionCore.module](./../../packages/synamint-extension-sdk/src/core/implementations/ExtensionCore.module.ts) 
```
export const extensionCoreModule = new ContainerModule(
...
    bind<IDiscordService>(IDiscordServiceType)
      .to(DiscordService)
      .inSingletonScope();
      
    bind<IDiscordRepository>(IDiscordRepositoryType)
      .to(DiscordRepository)
      .inSingletonScope();
   )
```
Now we are ready to use our new discord service with our new event. The events are handled at [RpcCallHandler](./../../packages/synamint-extension-sdk/src/core/implementations/api/RpcCallHandler.ts), each event is handled in a switch case at handleRpcCall method.
```
@injectable()
export class RpcCallHandler implements IRpcCallHandler {
  constructor(
    ...
    protected discordService: IDiscordService,
  ) {}

  public async handleRpcCall(
    req: JsonRpcRequest<unknown>,
    res: PendingJsonRpcResponse<unknown>,
    next: AsyncJsonRpcEngineNextCallback,
    sender: Runtime.MessageSender | undefined,
  ) {
    const { method, params } = req;

    switch (method) {
    ...
    case EExternalActions.GET_DISCORD_GUILD_PROFILES : {
        return new AsyncRpcResponseSender(
          this.discordService.getGuildProfiles(),
          res,
        ).call();
      }
    }

```

3. Now we will add our new methods to the gateway that spa uses to make calls. Since we added an external action we will use the  [ExternalCoreGateway](./../../packages/core/src/gateways/ExternalCoreGateway.ts) methods. Before that we will have to add new interfaces though. [ISdlDataWallet](./../../packages/objects/src/interfaces/ISdlDataWallet.ts), this is the main interface for the communication methods and the type of the injected object that the data wallet makes. SPA will use theses methods when making a call.

```
type JsonRpcError = unknown;
export interface ISdlDataWallet extends EventEmitter {
 ...
 
  discord : ISdlDiscordMethods
 
}

export interface ISdlDiscordMethods {

  getUserProfiles(): ResultAsync<DiscordProfile[], JsonRpcError>;
}
```
Notice we changed our error type yet again, for similar reasons as the previous one. Now we are ready to add our new methods to the gateway


```
export class ExternalCoreGateway {
  protected _handler: CoreHandler;
  discord : ISdlDiscordMethods;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);
    this.discord = {
        getUserProfiles :(): ResultAsync<DiscordProfile[], JsonRpcError> => {
        	return this._handler.call(EExternalActions.GET_DISCORD_USER_PROFILES);

```
And this is it.SPA now can call our methods 

```
declare const window: IWindowWithSdlDataWallet;
const DiscordMediaData: FC<ISocialMediaDataItemProps> = ({
  name,
  icon,
}: ISocialMediaDataItemProps) => {
  ...
  public getUserProfiles(): ResultAsync<DiscordProfile[], unknown> {
    return window.sdlDataWallet.discord.getUserProfiles().mapErr(() => {
      return errAsync(new Error("Could not get discord user profiles!"));
    });
  }
}
```
declare keyword here is used for typescript, we are telling our compiler the type of  the window object that the web browser created. Our data wallet will inject herself to there , the new type that looks like his
```
export interface IWindowWithSdlDataWallet extends Window {
  sdlDataWallet: ISdlDataWallet;
}
```

