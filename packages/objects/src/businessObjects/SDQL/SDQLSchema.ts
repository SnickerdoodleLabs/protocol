export class SDQLSchema {
    /**
     * A object created from string
     */

    constructor(
        readonly internalObj: Object
    ) {}

    static fromString(s: string): SDQLSchema {
        const obj = JSON.parse(s);
        return new SDQLSchema(obj)
    }

    getQuerySchema(): Object {

        return this.internalObj["queries"];
        
    }

    getReturnSchema(): Object {

        return this.internalObj["returns"];
        
    }
    getCompensationSchema(): Object {

        return this.internalObj["compensations"];
        
    }
    getLogicSchema(): Object {

        return this.internalObj["logic"];
        
    }
}