enum ECloudStorageOption {
    GoogleDrive = "GoogleDrive",
    NullCloudStorage = "NullCloudStorage",
}

class CloudStorageService {
    // public getAvailableStorageOptions() {
    //     // we can check the config values
    //     // if there are credentials for provider we can add this provider as a available option
    // }
    // public getCurrentStorageOption() {
    //     // we need to check localstorage
    //     // storageUtils
    //     //return ECloudStorageOption
    // }
    // public getGDriveAuthUrl() {
    //     // return the config value
    //     // if there is no config value we can retun an error
    // }
    // public generateGDriveCredentials(code: string) {
    //     // code is authentication code
    //     // this function gonna call the Repository then the result should be stored in localstorage
    //     // return accessToken
    // }
    // public cancelGDriveAuthenticaion() {
    //     // we can remove the credentials from localstorage
    // }
    // public initGDrive(accessToken: string, path: string)() {
    //     // if the context does not have the account info then we can try to recover
    //     // accessToken is just for check we need to check the value stored in localstorage
    //     // DataWalletPersistence  change provider
    // }
}
