

export class QueryReponse {

    returns: Map<string, Array<string | number | [string, number | string]>>;
    compenstations: Map<string, {description: string, callback: string}>;

    constructor() {
        this.returns = new Map();
        this.compenstations = new Map();
    }

    addReturn(key: string, value: Array<string | number | [string, number | string]>) {
        this.returns[key] = value;
    }

    addCompensation(key: string, value: {description: string, callback: string}) {
        this.compenstations[key] = value;
    }

}