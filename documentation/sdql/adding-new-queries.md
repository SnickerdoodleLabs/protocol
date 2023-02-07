# Steps to add a new query support to the core:

1. Update the QUERYENGINE.md file with new query type
2. Update the EXAMPLES.md file with new query schema examples

## 1. Parsing the query
First step in the implementation is parsing the query and building the AST (Abstract Syntax Tree). This is done by the **Query Parser package**.

3. Parsing the new query requires an interface to be defined that resembles the query structure. The **SDQLParser** converts a query schema into AST. So, we need to define an AST element for the new query. For most of the web2 data, we have an abstraction layer called "**AST_PropertyQuery**". Maybe, you may not need to new AST elements. If you define an new element it must extend from **AST_Query**.
4. You need to update the **SDQLParser** to convert the query block into the corresponding AST element. You can also write validations here. 

    ### Get the permission flag for the query
    Each query have a data permission flag. With the flag the end-user can restrict the execution of a specific type of queries. 

    1. Define a data type for the query in EWalletDataType.
    2. Define a getter for the data type in DataPermissions.
    3. Update the getQueryPermissionFlag of SDQLParser.

5. Once this is done, write tests and check if the parser can correctly build the AST.



## 2. Evaluating the query
Once we have the AST for a query, we can execute the logic expressions. The evaluators are in the **core package** (*packages/core/src/.../business/utilities/query*). You need to update the QueryEvaluator which wraps all the query-type specific evaluators. 

1. Define your evaluator using the persistence layer and test it
2. If you have a non-property query, update the **eval** method of the QueryEvaluator that calls the evaluator.
3. If you have a property query, update evalPropertyQuery.

## 3 Publishing the query-parser package to npm repository
1. The parser package is used by the insight platform as a third party npm package. We need to publish it to our company repository.



