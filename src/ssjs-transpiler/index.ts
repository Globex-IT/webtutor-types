export {ProjectConfig} from './core/config/project-config';
export {ImportManager} from './core/utils/import-manager';
export {TransformerConfigurator} from './transformers/transformer-configurator';
export {SsjsProjectBuilder} from './builders/ssjs-project.builder';
export {transformSsjs} from './collectors/gulp/transforms/transformSsjs';
export * from '../ssjs-transpiler/transformers/project-transformer-registry';

import * as ts from 'typescript';
export { ts };