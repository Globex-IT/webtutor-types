import ts from "typescript";

export interface IAccessorTransformer {
    getterTransform(node: ts.PropertyAccessExpression): ts.CallExpression | undefined;
    setterTransform(node: ts.BinaryExpression): ts.CallExpression | undefined;
}