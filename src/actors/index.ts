import { createActor } from "xstate";
import { beerMachine } from "../machines/beer-machine";
import { cartMachine } from "../machines/cart-machine";

export const beerActor = createActor(beerMachine);
export const cartActor = createActor(cartMachine);

beerActor.start();
cartActor.start();
