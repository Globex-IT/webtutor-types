import ts from "typescript";

export interface IObjectCreator {
    create(node: ts.NewExpression | ts.CallExpression): any;
}