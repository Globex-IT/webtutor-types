import {Car} from "./car";

function main() {
    const car = new Car();
    const name = car.getName()
    const bb = car.bb;
    car.age = 44;
}

main();

export {};