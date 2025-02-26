function main() {
    var car = OpenCodeLibrary("x-local://" + "D:/Projects/WebTutors/webtutor-types/tests/agents/build/agent-preset/car.js").__constructor();
    var name = car.getName();
    var bb = car.bb();
    car.age(44);
}
main();