import {dest, src} from "gulp";
import {SsjsProjectBuilder} from "../../../builders/ssjs-project.builder";
import {projectConfig} from "../../../core/config/project-config";
import {createProject} from "gulp-typescript";
import {SsjsTransformerRegistry} from "../../../transformers/ssjs-transformer-registry";
import {TypeScriptProgramHelper} from "../../../core/utils/type-script-program-helper";
import ts from "typescript";

const include = require("gulp-include");

export const transformSsjs = (ssjsDirectory: string) => {
    const program = TypeScriptProgramHelper.createProgramFromConfig(projectConfig.tsConfigPath!);
    const tsConfig = TypeScriptProgramHelper.createTsConfig(projectConfig.tsConfigPath!);
    const ssjsTransformerRegistry = new SsjsTransformerRegistry(program, tsConfig.fileNames);

    const ssjsProject = createProject(projectConfig.tsConfigPath!, {
        typescript: ts,
        getCustomTransformers: () => ({
            before: ssjsTransformerRegistry.transformers.map(t => t.transform()),
            after: ssjsTransformerRegistry.afterTransformers.map(t => t.transform())
        })
    });

    return src([ssjsDirectory + "/*.ts"])
        .pipe(include({extensions: "ts"}))
        .pipe(ssjsProject())
        .pipe(dest(projectConfig.outDir + '/bin/ssjs'))
        .on("error", (error: any) => console.log(`🛑 Transpilation error: ${error}`))
        .on("end", () => {
            console.log(`☑️   SSJS transpiled successfully.`);
            console.log(`-------------------------------------------------------------\n`);
            console.log(`✅ SSJS files transpiled successfully [${new Date().toLocaleTimeString()}] 🕙`);
        });
};