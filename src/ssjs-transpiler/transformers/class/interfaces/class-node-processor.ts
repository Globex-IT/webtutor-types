import ts from 'typescript';

export interface IClassNodeProcessor {
    transform(node: ts.Node): ts.Node;
    afterClassNodeTransform(node: ts.Node): ts.Node;
}