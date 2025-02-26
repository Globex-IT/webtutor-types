import {TransformerConfigurator} from "../transformers/transformer-configurator";
import {ImportManager} from "../core/utils/import-manager";
import {projectConfig, setTsProjectConfig} from "../core/config/project-config";
import path from "node:path";
import ts from "typescript";
import {Project} from "ts-morph";
import {TypeScriptProgramHelper} from "../core/utils/type-script-program-helper";

export class SsjsProjectBuilder {
    private readonly _transformerConfigurator: TransformerConfigurator;
    private readonly _importManager: ImportManager;
    private readonly _morphProject: Project;

    constructor() {
        this._transformerConfigurator = new TransformerConfigurator();
        this._importManager = new ImportManager();
        this._morphProject = new Project();
    }

    public setProjectLocationRelativeServerFolder(path: string): this {
        projectConfig.projectLocationRelativeServerFolder = path;
        return this;
    }

    public setTsConfigPath(path: string): this {
        projectConfig.tsConfigPath = path;
        return this;
    }

    public build() {
        this._transformerConfigurator.configure({
            projectLocationRelativeServerFolder: projectConfig.projectLocationRelativeServerFolder!,
            tsConfigPath: projectConfig.tsConfigPath!
        });

        const program = TypeScriptProgramHelper.createProgramFromConfig(projectConfig.tsConfigPath!);
        const tsConfig = TypeScriptProgramHelper.createTsConfig(projectConfig.tsConfigPath!);

        this._transformerConfigurator.initialize(program, this._morphProject);
        setTsProjectConfig(tsConfig);

        return {
            transformerConfigurator: this._transformerConfigurator,
            importManager: this._importManager
        };
    }
}