import ts from 'typescript';

export interface IPropertyAssignmentCreator {
    createPropertyAssignment(prop: ts.PropertyDeclaration): ts.PropertyAssignment;
}