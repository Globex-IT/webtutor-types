import ts from 'typescript';
import {IPropertyAssignmentCreator} from "../interfaces/property-assignment-creator";

export class PropertyAssignmentCreator implements IPropertyAssignmentCreator {
    public createPropertyAssignment(prop: ts.PropertyDeclaration): ts.PropertyAssignment {
        return ts.factory.createPropertyAssignment(
            prop.name,
            prop.initializer ?? ts.factory.createVoidZero()
        );
    }
}