import ts from "typescript";

export interface ISuperCallReplacer {
    replaceSuperCalls(node: ts.Node): ts.Node;
}