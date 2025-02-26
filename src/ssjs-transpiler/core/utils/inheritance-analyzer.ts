import ts from "typescript";
import * as fs from "node:fs";

export class InheritanceAnalyzer {
    private _checker: ts.TypeChecker;
    private _program: ts.Program;

    constructor(program: ts.Program) {
        this._program = program;
        this._checker = program.getTypeChecker();
    }

    public getPropertyDeclarationLevel(property: ts.PropertyAccessExpression, currentClass: ts.ClassDeclaration): number {
        let currentClassDeclaration = currentClass;
        let level = -1;

        while (currentClassDeclaration) {
            const symbol = property.name.text;

            if (symbol && this.isSymbolDeclaredInClass(symbol, currentClassDeclaration))
                return level;

            const baseClassDeclaration = this.getParentClassDeclaration(currentClassDeclaration);
            if (!baseClassDeclaration)
                break;

            currentClassDeclaration = baseClassDeclaration;
            level++;
        }

        return level;
    }

    findClassOfDeclaration(node: ts.Node): ts.ClassDeclaration | undefined {
        let current: ts.Node | undefined = node;

        while (current) {
            if (ts.isClassDeclaration(current)) {
                return current;
            }

            current = current.parent;
        }

        return undefined;
    }

    private isSymbolDeclaredInClass(symbol: string, classDeclaration: ts.ClassDeclaration): boolean {
        const members = classDeclaration.members;

        for (const member of members) {
            if (ts.isPropertyDeclaration(member)
                || ts.isMethodDeclaration(member)
                || ts.isGetAccessorDeclaration(member)
                || ts.isSetAccessorDeclaration(member)) {

                const memberSymbol = member.name.getText();
                if (memberSymbol === symbol)
                    return true;
            }
        }

        return false;
    }

    getParentClassDeclaration(classDeclaration: ts.ClassDeclaration): ts.ClassDeclaration | undefined {
        if (classDeclaration.heritageClauses) {
            const extendsClause = classDeclaration.heritageClauses.find(
                clause => clause.token === ts.SyntaxKind.ExtendsKeyword
            );

            if (extendsClause) {
                const baseType = extendsClause.types[0];
                const baseSymbol = this._checker.getSymbolAtLocation(baseType.expression);

                if (baseSymbol) {
                    const declarations = baseSymbol.getDeclarations();

                    if (declarations) {
                        const importSpecifier = declarations.find(ts.isImportSpecifier);

                        if (importSpecifier && ts.isImportSpecifier(importSpecifier)) {
                            const importDeclaration = importSpecifier.parent.parent.parent;
                            if (ts.isImportDeclaration(importDeclaration) && importDeclaration.moduleSpecifier) {
                                const moduleName = (importDeclaration.moduleSpecifier as ts.StringLiteral).text;

                                const {resolvedModule} = ts.resolveModuleName(
                                    moduleName,
                                    classDeclaration.getSourceFile().fileName,
                                    this._program.getCompilerOptions(),
                                    ts.sys
                                );

                                if (resolvedModule) {
                                    const moduleFilePath = resolvedModule.resolvedFileName;

                                    if (fs.existsSync(moduleFilePath)) {
                                        const parentSourceFile = this._program.getSourceFile(moduleFilePath);
                                        if (parentSourceFile) {
                                            let parentClass: ts.ClassDeclaration | undefined = undefined;

                                            ts.forEachChild(parentSourceFile, node => {
                                                if (ts.isClassDeclaration(node) && node.name?.text === importSpecifier.name.text) {
                                                    parentClass = node;
                                                }
                                            });

                                            return parentClass;
                                        }
                                    }
                                }
                            }
                        } else {
                            const parentClassDeclaration = declarations.find(ts.isClassDeclaration);
                            if (parentClassDeclaration && ts.isClassDeclaration(parentClassDeclaration)) {
                                return parentClassDeclaration;
                            }
                        }
                    }
                }
            }
        }

        return undefined;
    }
}