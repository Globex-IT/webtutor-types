import ts from "typescript";

export interface IBaseTransformer {
    transform(): ts.TransformerFactory<ts.SourceFile>;
}