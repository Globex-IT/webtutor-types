import ts from 'typescript';
import {ProjectConfig, projectConfig, setProjectConfig} from "../core/config/project-config";
import {Project} from "ts-morph";
import {ProjectTransformerRegistry} from "./project-transformer-registry";
import {ITransformerRegistry} from "../interfaces/transformer-registry.interface";
import {Runtime} from "../core/config/runtime";
import {generateRandomString} from "../core/generators/generate-random-string";
import {AtsParser} from "../ats-parsers/ats-parser";

export class TransformerConfigurator {
    private readonly _atsParser = new AtsParser();
    private _transformers?: ts.TransformerFactory<ts.SourceFile>[] = [];
    private _afterTransformers?: ts.TransformerFactory<ts.SourceFile>[] = [];
    private _registry?: ITransformerRegistry;

    public ts = ts;

    public initialize(program: ts.Program, morphProject: Project): void {
        if (!projectConfig.tsConfigPath)
            throw Error("To initialize you need to specify tsConfigPath");

        Runtime.id += generateRandomString(7);

        this._atsParser.parse(program.getSourceFiles())
        this._registry = new ProjectTransformerRegistry(program, morphProject);

        this._transformers = this._registry.transformers
            .map(transformer => transformer.transform());

        this._afterTransformers = this._registry.afterTransformers
            .map(transformer => transformer.transform());
    }

    public getTransformers(): ts.TransformerFactory<ts.SourceFile>[] {
        return this._transformers ?? [];
    }

    public getAfterTransformers(): ts.TransformerFactory<ts.SourceFile>[] {
        return this._afterTransformers ?? [];
    }

    public configure(config: Partial<ProjectConfig>): this {
        setProjectConfig({...projectConfig, ...config});
        return this;
    }
}

