import ts from 'typescript';

class ClassTransform {
    private readonly context: ts.TransformationContext;

    constructor(context: ts.TransformationContext) {
        this.context = context;
    }

    public transform(sourceFile: ts.SourceFile): ts.SourceFile {
        return ts.visitNode(sourceFile, this.visitNode.bind(this));
    }

    private visitNode(node: ts.Node): ts.Node {
        if (ts.isClassDeclaration(node)) {
            return this.transformClass(node);
        }
        if (ts.isNewExpression(node)) {
            return this.transformNewExpression(node);
        }
        if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
            return this.transformMethodCall(node);
        }
        if (ts.isPropertyAccessExpression(node) && !ts.isGetAccessor(node)) {
            return this.transformFieldAccess(node);
        }
        return ts.visitEachChild(node, this.visitNode.bind(this), this.context);
    }

    private transformClass(classNode: ts.ClassDeclaration): ts.VariableStatement {
        const className = classNode.name?.text;
        const properties = this.extractProperties(classNode);
        const methods = this.extractMethods(classNode);

        const transformedClass = this.formatClass(className, properties, methods);
        return this.createVariableStatement(className, transformedClass);
    }

    private extractProperties(classNode: ts.ClassDeclaration): string {
        return classNode.members
            .filter(ts.isPropertyDeclaration)
            .map(prop => {
                const idValue = prop.initializer ? prop.initializer.getText() : 'undefined';
                return `<${prop.name.getText()}>${idValue}</${prop.name.getText()}>`;
            })
            .join('\n');
    }

    private extractMethods(classNode: ts.ClassDeclaration): string {
        return classNode.members
                .filter(ts.isMethodDeclaration)
                .map(method => this.transformMethod(method))
                .join('\n') +
            classNode.members
                .filter(ts.isGetAccessor)
                .map(getter => this.transformGetter(getter))
                .join('\n');
    }

    private transformMethod(method: ts.MethodDeclaration): string {
        const methodName = method.name.getText();
        const methodBody = method.body ? method.body.getText().replace(/this/g, 'TopElem') : 'function() {}';
        return `<${methodName}>function ${methodName}(TopElem) {${methodBody}} return ${methodName}(%class_name%.TopElem)</${methodName}>`;
    }

    private transformGetter(getter: ts.GetAccessorDeclaration): string {
        const methodName = getter.name.getText();

        // Извлекаем выражение внутри тела геттера без фигурных скобок
        const returnStatement = getter.body?.statements.find(ts.isReturnStatement);
        const returnValue = returnStatement && returnStatement.expression ? returnStatement.expression.getText() : 'undefined';

        return `<${methodName}>function ${methodName}(TopElem) { return ${returnValue}; } return ${methodName}(%class_name%.TopElem)</${methodName}>`;
    }

    private formatClass(className: string | undefined, properties: string, methods: string): string {
        return `
            <class>
                ${properties}
                ${methods}
            </class>
        `;
    }

    private createVariableStatement(className: string | undefined, transformedClass: string): ts.VariableStatement {
        return ts.factory.createVariableStatement(
            undefined,
            ts.factory.createVariableDeclarationList(
                [ts.factory.createVariableDeclaration(
                    ts.factory.createIdentifier(`${className?.toLowerCase()}_class`),
                    undefined,
                    undefined,
                    ts.factory.createStringLiteral(`var ${className?.toLowerCase()}_class = "${transformedClass.replace(/"/g, '\\"').trim()}"`)
                )],
                ts.NodeFlags.Const
            )
        );
    }

    private transformNewExpression(newExpr: ts.NewExpression): ts.CallExpression {
        const className = newExpr.expression.getText();
        const varName = `${className.toLowerCase()}_class`;

        return ts.factory.createCallExpression(
            ts.factory.createIdentifier('OpenDocFromStr'),
            undefined,
            [ts.factory.createIdentifier(varName)]
        );
    }

    private transformMethodCall(callExpr: ts.CallExpression): ts.CallExpression {
        const methodName = (callExpr.expression as ts.PropertyAccessExpression).name.getText();
        const className = (callExpr.expression as ts.PropertyAccessExpression).expression.getText();
        const varName = className.toLowerCase();

        const evalCall = ts.factory.createCallExpression(
            ts.factory.createIdentifier('StrReplace'),
            undefined,
            [
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier(varName),
                        ts.factory.createIdentifier('TopElem')
                    ),
                    ts.factory.createIdentifier(`${methodName}.Value`)
                ),
                ts.factory.createStringLiteral("%class_name%"),
                ts.factory.createStringLiteral(varName)
            ]
        );

        return ts.factory.createCallExpression(
            ts.factory.createIdentifier('eval'),
            undefined,
            [evalCall]
        );
    }


    private transformFieldAccess(fieldAccess: ts.PropertyAccessExpression): ts.CallExpression {
        const className = fieldAccess.expression.getText();
        const fieldName = fieldAccess.name.getText();
        const varName = className.toLowerCase();

        // Создаем вызов StrReplace без строковой обертки
        const evalCall = ts.factory.createCallExpression(
            ts.factory.createIdentifier('StrReplace'),
            undefined,
            [
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier(varName),
                        ts.factory.createIdentifier('TopElem')
                    ),
                    ts.factory.createIdentifier(`${fieldName}.Value`)
                ),
                ts.factory.createStringLiteral("%class_name%"),
                ts.factory.createStringLiteral(varName)
            ]
        );

        // Возвращаем вызов eval() без строковой обертки
        return ts.factory.createCallExpression(
            ts.factory.createIdentifier('eval'),
            undefined,
            [evalCall]
        );
    }
}

export function classTransform(): ts.TransformerFactory<ts.SourceFile> {
    return (context: ts.TransformationContext) => {
        const transformer = new ClassTransform(context);
        return (sourceFile: ts.SourceFile) => transformer.transform(sourceFile);
    };
}
