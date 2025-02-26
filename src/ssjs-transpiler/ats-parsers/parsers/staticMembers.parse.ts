import ts from "typescript";
import {IAtsParser} from "../interfaces/ats-parser.interface";
import {TSAst} from "../../core/ts-ast/type-script-ast";
import {ClassAts} from "../../core/ts-ast/entities/class-ats";

export class StaticMembersParse implements IAtsParser {
    public parse(sourceFiles: readonly ts.SourceFile[]) {
        sourceFiles.forEach(sourceFile => {
            this.findStaticMembers(sourceFile);
        })
    }

    private findStaticMembers(file: ts.SourceFile) {
        const fileName = file.fileName;

        function visit(node: ts.Node) {
            if (ts.isClassDeclaration(node) && node.name) {
                const className = node.name.text;

                node.members.forEach(member => {
                    if (member.modifiers?.some(mod => mod.kind === ts.SyntaxKind.StaticKeyword)) {
                        const name = member.name && ts.isIdentifier(member.name) ? member.name.text : "<unknown>";

                        if (ts.isPropertyDeclaration(member)) {
                            const astFile = TSAst.getFileByName(fileName);
                            if (astFile) {
                                const classAst = new ClassAts();
                                classAst.name = className;
                                classAst.staticFields.push({
                                    name: name,
                                    initValue: member.initializer?.getText()
                                })
                            }
                        } else if (ts.isMethodDeclaration(member)) {
                            const astFile = TSAst.getFileByName(fileName);
                            if (astFile) {
                                const classAst = new ClassAts();
                                classAst.name = className;
                                classAst.staticMethods.push(name);
                            }
                        }
                    }
                });
            }

            ts.forEachChild(node, visit);
        }

        visit(file);
    }
}