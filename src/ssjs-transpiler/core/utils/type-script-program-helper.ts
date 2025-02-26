import ts from "typescript";
import path from "node:path";
import {projectConfig} from "../config/project-config";

export class TypeScriptProgramHelper {
    public static createTsConfig(tsConfigPath: string): ts.ParsedCommandLine {
        const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
        const parsedConfig = ts.parseJsonConfigFileContent(
            configFile.config,
            ts.sys,
            path.dirname(tsConfigPath)
        );

        const baseUrl = parsedConfig.options.baseUrl?.split('/');
        if (baseUrl && baseUrl.length > 1)
            projectConfig.baseUrl = baseUrl[0];
        else
            projectConfig.baseUrl = parsedConfig.options.baseUrl;

        projectConfig.outDir = parsedConfig.options.outDir;

        return parsedConfig;
    }

    public static createProgramFromConfig(tsConfigPath: string): ts.Program {
        const parsedConfig = this.createTsConfig(tsConfigPath);

        return ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
    }
}