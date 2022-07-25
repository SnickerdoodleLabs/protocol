import { IErrorListener } from "@interfaces/api";
import { IContextProvider } from "@interfaces/utilities";
import { okAsync, ResultAsync } from "neverthrow";

export class ErrorListener implements IErrorListener{
    constructor(protected contextProvider: IContextProvider){}

    public initialize(): ResultAsync<void, never> {
        const errorSubject = this.contextProvider.getErrorSubject()
        errorSubject.subscribe(this.onExtensionError.bind(this))
        return okAsync(undefined)
    }

    private onExtensionError(error: Error){
        console.log(error)
    }

}