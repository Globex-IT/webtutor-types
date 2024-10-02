import ts from 'typescript';
import {TransformerRegistry} from "./transformer-registry";

export class TransformerConfigurator {
    private readonly enabledTransformers: Set<ts.TransformerFactory<ts.SourceFile>>;
    private registry: TransformerRegistry;

    public ts = ts;

    constructor() {
        this.registry = new TransformerRegistry();
        this.enabledTransformers = new Set<ts.TransformerFactory<ts.SourceFile>>(this.registry.getAllTransformers()
            .map(transformer => transformer.transform()));
    }

    public getTransformers(): ts.TransformerFactory<ts.SourceFile>[] {
        return Array.from(this.enabledTransformers);
    }

    public disableTransformer(transformerFactory: ts.TransformerFactory<ts.SourceFile>): void {
        this.enabledTransformers.delete(transformerFactory);
    }
}

