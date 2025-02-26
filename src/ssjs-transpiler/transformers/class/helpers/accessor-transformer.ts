import ts from 'typescript';
import {IAccessorTransformer} from "../interfaces/accessor-transformer";

export class AccessorTransformer implements IAccessorTransformer {
    public getterTransform(node: ts.PropertyAccessExpression) {
        const parent = node.expression.parent;

        if (ts.isVariableDeclaration(parent.parent)) {
            return ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(node.expression, node.name),
                undefined,
                []
            );
        }
    }

    public setterTransform(node: ts.BinaryExpression) {
        const left = node.left;
        const right = node.right;

        if (ts.isPropertyAccessExpression(left)) {
            const propertyName = left.name.getText();

            return ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(left.expression, propertyName),
                undefined,
                [right]
            );
        }
    }
}