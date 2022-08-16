import { AST_Query } from "./AST_Query";
import { Condition, ConditionG, ConditionGE, ConditionIn, ConditionL } from "@core/interfaces/objects/SDQL/condition";
import { SDQL_Name, SDQL_OperatorName } from "@snickerdoodlelabs/objects";


export class AST_PropertyQuery extends AST_Query {

    /**
     * @param name - the key of the query from schema, e.g., q1, q2, a3 ...
     * @param property - the name of the query from the schema, e.g., "age"
     */
    
    constructor(
        readonly name: SDQL_Name,
        readonly returnType: "string" | "boolean" | "integer" | "number" | "array" | "enum" | "object",
        readonly property: string,
        readonly conditions: Array<Condition>,
        // for reading gender
        readonly enum_keys: Array<string>,
        readonly patternProperties: Object

    ) {
        super(name, returnType);
    }
    static fromSchema(name: SDQL_Name, schema: any): AST_PropertyQuery {

        const conditions = AST_PropertyQuery.parseConditions(schema.conditions);

        return new AST_PropertyQuery(
            name,
            schema.return,
            schema.name,
            conditions,
            schema.enum_keys,
            schema.patternProperties
        )
    }

    static parseConditions(schema: any): Array<Condition> {

        let conditions = new Array<Condition>();

        for (let conditionName in schema) {
            let opName = SDQL_OperatorName(conditionName);
            let rightOperand = schema[conditionName];
            switch (conditionName) {
                case "ge":
                    conditions.push(
                        new ConditionGE(
                            opName,
                            null,
                            Number(rightOperand)
                        )
                    )
                    break;
                case "l":
                    conditions.push(
                        new ConditionL(
                            opName,
                            null,
                            Number(rightOperand)
                        )
                    )
                    break;
                case "in":
                    conditions.push(
                        new ConditionIn(
                            opName,
                            null,
                            rightOperand as Array<any>
                        )
                    )
                    break;
                case "g":
                    conditions.push(
                        new ConditionG(
                            opName,
                            null,
                            Number(rightOperand)
                        )
                    )
                break;
            }
        }

        return conditions;

    }
}