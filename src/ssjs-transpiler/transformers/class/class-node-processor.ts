import ts from 'typescript';
import {IMethodCreator} from "./interfaces/method-creator";
import {IPropertyAssignmentCreator} from "./interfaces/property-assignment-creator";
import {IConstructorCreator} from "./interfaces/constructor-creator";
import {IAccessorCreator} from "./interfaces/accessor-creator";
import {IAccessorTransformer} from "./interfaces/accessor-transformer";
import {IObjectCreator} from "./interfaces/object-creator";
import {ThisSuperTransformer} from "./helpers/this-super-transformer";
import {MethodCreator} from "./helpers/method-creator";
import {PropertyAssignmentCreator} from "./helpers/property-assignment-creator";
import {ConstructorCreator} from "./helpers/constructor-creator";
import {AccessorCreator} from "./helpers/accessor-creator";
import {AccessorTransformer} from "./helpers/accessor-transformer";
import {ObjectCreator} from "./helpers/object-creator";
import {ClassTransformer} from "./class-transformer";
import {SourceFileResolver} from "../../core/utils/source-file-resolver";
import {projectConfig} from "../../core/config/project-config";
import ScriptTarget = ts.ScriptTarget;
import path from "node:path";
import {Project} from "ts-morph";

export class ClassNodeProcessor {
    private readonly _sourceFileResolver = new SourceFileResolver();
    private _methodCreator: IMethodCreator;
    private _propertyAssignmentCreator: IPropertyAssignmentCreator;
    private _constructorCreator: IConstructorCreator
    private _accessorCreator: IAccessorCreator;
    private _accessorTransformer: IAccessorTransformer;
    private _objectCreator: IObjectCreator;
    private _thisSuperTransformer: ThisSuperTransformer;

    constructor(context: ts.TransformationContext, private program: ts.Program, private morphProject: Project) {
        this._methodCreator = new MethodCreator();
        this._propertyAssignmentCreator = new PropertyAssignmentCreator();
        this._constructorCreator = new ConstructorCreator(context, program);
        this._accessorCreator = new AccessorCreator();
        this._accessorTransformer = new AccessorTransformer();
        this._objectCreator = new ObjectCreator(context, program);
        this._thisSuperTransformer = new ThisSuperTransformer(context, program);
    }

    public classTransform(node: ts.Node): ts.NodeArray<ts.FunctionDeclaration | ts.VariableStatement> | undefined {
        if (ts.isClassDeclaration(node) && node.name)
            return this.createClassMembers(node);
    }

    public classMembersTransform(node: ts.Node): ts.Node | undefined {
        if (ts.isPropertyAccessExpression(node)) {
            const getter = this._accessorTransformer.getterTransform(node);
            if (getter)
                return getter;
        }

        if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
            const setter = this._accessorTransformer.setterTransform(node);
            if (setter)
                return setter;
        }

        if (ts.isNewExpression(node)) {
            const obj = this._objectCreator.create(node);
            if (obj)
                return obj;
        }

        const newNode = this._thisSuperTransformer.transform(node);
        if (newNode)
            return newNode;
    }

    private createClassMembers(node: ts.ClassDeclaration) {
        const constructors = node.members
            .filter(ts.isConstructorDeclaration)
            .map(ctor => this._constructorCreator.createConstructorFunction(ctor))
            .filter(ctor => ctor !== undefined) as ts.FunctionDeclaration[];

        const properties = node.members
            .filter(ts.isPropertyDeclaration)
            .map(prop => this._propertyAssignmentCreator.createPropertyAssignment(prop));

        const methods = node.members
            .filter(ts.isMethodDeclaration)
            .map(method => this._methodCreator.createMethodDeclaration(method))
            .filter(method => method !== undefined) as ts.FunctionDeclaration[];

        const getters = node.members
            .filter(ts.isGetAccessorDeclaration)
            .map(prop => this._accessorCreator.createFunction(prop))
            .filter(prop => prop !== undefined) as ts.FunctionDeclaration[];

        const setters = node.members
            .filter(ts.isSetAccessorDeclaration)
            .map(prop => this._accessorCreator.createFunction(prop))
            .filter(prop => prop !== undefined) as ts.FunctionDeclaration[];

        const superObj = ts.factory.createVariableStatement(
            undefined,
            ts.factory.createVariableDeclarationList(
                [
                    ts.factory.createVariableDeclaration(
                        ClassTransformer.superKeyword,
                        undefined,
                        undefined,
                        ts.factory.createVoidZero()
                    )
                ],
                ts.NodeFlags.Let
            )
        );

        const thisObj = ts.factory.createVariableStatement(
            undefined,
            ts.factory.createVariableDeclarationList(
                [
                    ts.factory.createVariableDeclaration(
                        ClassTransformer.thisKeyword,
                        undefined,
                        undefined,
                        ts.factory.createObjectLiteralExpression(properties, true)
                    )
                ],
                ts.NodeFlags.Let
            )
        );

        const members = [superObj, thisObj, ...constructors, ...getters, ...setters, ...methods];
        return ts.factory.createNodeArray(members);
    }
}