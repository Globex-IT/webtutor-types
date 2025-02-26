import ts from "typescript";

export interface IAccessorCreator {
    createFunction(method: ts.MethodDeclaration |
        ts.GetAccessorDeclaration |
        ts.SetAccessorDeclaration): ts.FunctionDeclaration | undefined;
}