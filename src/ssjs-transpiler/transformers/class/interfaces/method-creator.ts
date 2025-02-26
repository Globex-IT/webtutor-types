import ts from 'typescript';

export interface IMethodCreator {
    createMethodDeclaration(method: ts.MethodDeclaration
        | ts.GetAccessorDeclaration
        | ts.SetAccessorDeclaration
    ): ts.FunctionDeclaration | undefined;
}