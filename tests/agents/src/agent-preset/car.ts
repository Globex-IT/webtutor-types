import {Engine} from "./engine";

export class Car extends Engine {
    private _age: number;

    public name: string;

    constructor();
    constructor(name?: string) {
        super();

        this.name = name;
    }

    public get bb() {
        return 3;
    }

    public set age(theAge: number) {
        if (theAge <= 0 || theAge >= 200) {
            throw new Error('The age is invalid');
        }

        this._age = theAge;
    }

    getName() {
        return this.name;
    }
}