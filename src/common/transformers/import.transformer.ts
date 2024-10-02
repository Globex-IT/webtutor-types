// MyTransformer.ts
import * as ts from 'typescript';
import {IBaseTransformer} from './interfaces/ibase.transformer';

class ImportTransformer implements IBaseTransformer {
    transform(): ts.TransformerFactory<ts.SourceFile> {
        return (context: ts.TransformationContext) => {
            return (sourceFile: ts.SourceFile) => {
                const visitor: ts.Visitor = (node) => {
                    // Обрабатываем import declaration
                    if (ts.isImportDeclaration(node)) {
                        const requireCall = ts.factory.createCallExpression(
                            ts.factory.createIdentifier('require'),
                            undefined,
                            [node.moduleSpecifier]
                        );

                        // Создаем новую ExpressionStatement для require
                        const requireStatement = ts.factory.createExpressionStatement(requireCall);

                        // Заменяем узел импорта на require
                        return requireStatement;
                    }

                    // Продолжаем обход остальных узлов
                    return ts.visitEachChild(node, visitor, context);
                };

                return ts.visitNode(sourceFile, visitor);
            };
        };
    }
}

// Экспортируем экземпляр трансформера
export const importTransformer = new ImportTransformer().transform;
