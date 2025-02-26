import {IBaseTransformer} from "../transformers/base/ibase.transformer";


export interface ITransformerRegistry {
    get transformers(): IBaseTransformer[];
    get afterTransformers(): IBaseTransformer[];
}