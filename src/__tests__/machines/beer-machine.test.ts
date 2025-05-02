import { beerMachine } from "@/machines/beer-machine";
import { describe, expect, it } from "vitest";
import { createActor } from "xstate";

function waitForState(actor, matcher: (state) => boolean): Promise<any> {
  return new Promise((resolve) => {
    const sub = actor.subscribe((state) => {
      if (matcher(state)) {
        sub.unsubscribe();
        resolve(state);
      }
    });
  });
}

describe("beerMachine", () => {
  it("fetches beers on FETCH_BEERS", async () => {
    const actor = createActor(beerMachine).start();
    actor.send({ type: "FETCH_BEERS" });

    const finalState = await waitForState(actor, (s) => s.matches("idle"));

    expect(finalState.context.beers).toHaveLength(2);
    expect(finalState.context.beers[0].name).toBe("Beer 1");
  });

  it("fetches beer details on SELECT_BEER", async () => {
    const actor = createActor(beerMachine).start();
    actor.send({ type: "SELECT_BEER", id: 5 });

    const finalState = await waitForState(actor, (s) => s.matches("idle"));

    expect(finalState.context.selectedBeer?.id).toBe(5);
    expect(finalState.context.selectedBeer?.name).toBe("Beer 5");
  });
});
