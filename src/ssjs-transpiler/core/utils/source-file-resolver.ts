import ts from "typescript";
import * as fs from "node:fs";
import path from "node:path";
import {projectConfig, tsProjectConfig} from "../config/project-config";

export class SourceFileResolver {
    public findSourceFileForClass(currentSourceFile: ts.SourceFile, className: string): string | undefined {
        const imports = currentSourceFile.statements.filter(ts.isImportDeclaration);
        for (const importDeclaration of imports) {
            const importClause = importDeclaration.importClause;

            if (importClause && importClause.namedBindings && ts.isNamedImports(importClause.namedBindings)) {
                const namedImports = importClause.namedBindings;
                for (const element of namedImports.elements) {
                    if (element.name.text === className) {
                        return (importDeclaration.moduleSpecifier as ts.StringLiteral).text;
                    }
                }
            }
        }

        return undefined;
    }

    public createSourceFile(filePath: string): ts.SourceFile {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return ts.createSourceFile(
            path.basename(filePath),
            fileContent,
            ts.ScriptTarget.Latest,
            true
        );
    }

    public getRelativeOutFilePath(node: ts.Node, className: string) {
        return this.getRelativeOutFileByPath(node.getSourceFile().fileName);
    }

    public getRelativeOutFileByPath(absoluteFilePath: string) {
        const absoluteDirectoryPath = path.dirname(absoluteFilePath);

        const relativeRoot = absoluteDirectoryPath
            .split(projectConfig.projectLocationRelativeServerFolder!)[1]
            .split(projectConfig.baseUrl!)[0];
        const fileRelativePath = absoluteDirectoryPath.split(projectConfig.baseUrl!)[1];

        return path.join(
            projectConfig.projectLocationRelativeServerFolder!,
            relativeRoot,
            projectConfig.outDir!,
            fileRelativePath,
            `${path.parse(absoluteFilePath).name}.js`
        ).replace(/\\/g, "/");
    }

    public getAbsoluteOriginalFilePath(node: ts.Node, className: string) {
        const sourceFile = this.findSourceFileForClass(node.getSourceFile(), className);
        if (sourceFile)
            return path.join(path.dirname(node.getSourceFile().fileName), sourceFile + '.ts')
    }

    public getCompiledFilePath(tsFilePath: string): string {
        const outDir = tsProjectConfig?.options.outDir || 'dist';
        const rootDir = tsProjectConfig?.options.rootDir || 'src';

        const relativePath = path.relative(rootDir, tsFilePath);
        const jsFilePath = path.join(outDir, relativePath);

        return jsFilePath.replace(/\.ts$/, '.js').replace(/\\/g, '/');
    }

    public toRelativePath(filePath: string, rootDir: string): string {
        const relativePath = path.relative(rootDir, filePath);
        return relativePath.replace(/\\/g, '/');
    }

    public removeFileExtension(filePath: string): string {
        return filePath.replace(/\.[^/.]+$/, '');
    }
}