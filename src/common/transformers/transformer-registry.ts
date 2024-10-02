import {ForTransformer} from "./loop.transformer";
import {ArrowFunctionTransformer} from "./lambda.transformer";
import {ArrayMethodTransformer} from "./array.transformer";
import {IBaseTransformer} from "./interfaces/ibase.transformer";

export type TransformerName =
    | 'ForTransformer'
    | 'ArrowFunctionTransformer'
    | 'ArrayTransformer';

export class TransformerRegistry {
    private transformers: Map<TransformerName, IBaseTransformer> = new Map();

    constructor() {
        this.registerTransformers();
    }

    private registerTransformers(): void {
        this.transformers.set('ForTransformer', new ForTransformer());
        this.transformers.set('ArrowFunctionTransformer', new ArrayMethodTransformer());
        this.transformers.set('ArrayTransformer', new ArrowFunctionTransformer());
    }

    public getTransformer(name: TransformerName): IBaseTransformer | undefined {
        return this.transformers.get(name);
    }

    public getAllTransformers(): IBaseTransformer[] {
        return Array.from(this.transformers.values());
    }
}