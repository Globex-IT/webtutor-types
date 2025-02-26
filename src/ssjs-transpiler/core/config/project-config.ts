import ts from "typescript";

export class ProjectConfig {
    projectLocationRelativeServerFolder: string = "";
    tsConfigPath: string = "";
    outDir: string = "";
    baseUrl: string = "";
}

export let tsProjectConfig: ts.ParsedCommandLine | undefined;

export let projectConfig: Partial<ProjectConfig> = {};

export const setProjectConfig = (config: Partial<ProjectConfig>) => {
    projectConfig = {...projectConfig, ...config};
}

export const setTsProjectConfig = (config: ts.ParsedCommandLine) => {
    tsProjectConfig = config;
}