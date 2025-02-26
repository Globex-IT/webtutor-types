import ts from 'typescript';

export interface IConstructorCreator {
    createConstructorFunction(constructor: ts.ConstructorDeclaration): ts.FunctionDeclaration | undefined;
}