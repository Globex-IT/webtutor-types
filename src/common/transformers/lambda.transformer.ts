import * as ts from 'typescript';
import {IBaseTransformer} from "./interfaces/ibase.transformer";

export class ArrowFunctionTransformer implements IBaseTransformer {
    private lambdaCounter: number;

    constructor() {
        this.lambdaCounter = 0;
    }

    public transform(): ts.TransformerFactory<ts.SourceFile> {
        return (context: ts.TransformationContext) => {
            const visitor: ts.Visitor = (node: ts.Node): ts.Node => this.visitNode(node, context);
            return (rootNode: ts.SourceFile) => ts.visitNode(rootNode, visitor);
        };
    }

    private visitNode(node: ts.Node, context: ts.TransformationContext): ts.Node {
        if (ts.isArrowFunction(node)) {
            this.lambdaCounter++;

            const uniqueFunctionName = ts.factory.createIdentifier(`_${this.lambdaCounter}`);
            const body = ts.isBlock(node.body)
                ? node.body
                : ts.factory.createBlock([ts.factory.createReturnStatement(node.body)]);

            return ts.factory.createFunctionExpression(
                undefined,
                undefined,
                uniqueFunctionName,
                undefined,
                node.parameters,
                node.type,
                body
            );
        }

        return ts.visitEachChild(node, (childNode) => this.visitNode(childNode, context), context);
    }
}