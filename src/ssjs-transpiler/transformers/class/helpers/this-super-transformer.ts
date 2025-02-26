import ts from "typescript";
import {InheritanceAnalyzer} from "../../../core/utils/inheritance-analyzer";
import {ClassTransformer} from "../class-transformer";

export class ThisSuperTransformer {
    private readonly _inheritanceAnalyzer: InheritanceAnalyzer;
    private readonly _context: ts.TransformationContext;

    constructor(context: ts.TransformationContext, program: ts.Program) {
        this._inheritanceAnalyzer = new InheritanceAnalyzer(program);
        this._context = context;
    }

    public transform(node: ts.Node): ts.Node | undefined {
        if (this.isSuperCallExpression(node))
            return this.transformSuperCallExpression(node);

        if (ts.isPropertyAccessExpression(node))
            return this.transformPropertyAccessExpression(node);

        return undefined;
    }

    private isSuperCallExpression(node: ts.Node): boolean {
        return (
            ts.isExpressionStatement(node) &&
            ts.isCallExpression(node.expression) &&
            node.getText().includes('super')
        );
    }

    private transformSuperCallExpression(node: ts.Node): ts.PropertyAccessExpression {
        return ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier(ClassTransformer.superKeyword),
            node.getText().split('super.').pop() ?? ""
        );
    }

    private transformPropertyAccessExpression(node: ts.PropertyAccessExpression): ts.PropertyAccessExpression {
        const classDeclaration = this._inheritanceAnalyzer.findClassOfDeclaration(node);

        if (classDeclaration) {
            const level = this._inheritanceAnalyzer.getPropertyDeclarationLevel(node, classDeclaration);

            if (level === -1) {
                if (!ts.isCallExpression(node.parent)) {
                    return ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier(ClassTransformer.thisKeyword),
                        node.name
                    );
                } else {
                    return ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier("This"),
                        node.name
                    );
                }
            } else {
                return this.createSuperAccessExpression(node, level);
            }
        }

        return node;
    }

    private createSuperAccessExpression(node: ts.PropertyAccessExpression, level: number): ts.PropertyAccessExpression {
        let levelParent = ClassTransformer.superKeyword;
        for (let i = 1; i <= level; i++) {
            levelParent += `.${ClassTransformer.superKeyword}`;
        }

        return ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier(levelParent + ".__this"),
            node.name
        );
    }
}