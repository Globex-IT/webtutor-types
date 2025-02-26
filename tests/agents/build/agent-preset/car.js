{
    var __this = {
        _age: void 0,
        name: void 0
    };
    function __constructor(name) {
        __this.name = name;
        return This;
    }
    function bb() {
        return 3;
    }
    function age(theAge) {
        if (theAge <= 0 || theAge >= 200) {
            throw new Error('The age is invalid');
        }
        __this._age = theAge;
    }
    function getName() {
        return __this.name;
    }
}