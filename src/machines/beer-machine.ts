import { getErrorMessage } from "@/helpers";
import { assign, fromPromise, setup } from "xstate";
import { getBeerById, getBeers } from "../services/beerApi";
import { Beer } from "../types/beer";

const fetchBeersActor = fromPromise(
  async ({
    input,
  }: {
    input: {
      page: number;
      perPage: number;
      searchTerm: string;
      isLoadMore: boolean;
    };
  }) => {
    try {
      const beers = await getBeers(input.page, input.perPage, input.searchTerm);
      return { beers, isLoadMore: input.isLoadMore };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch beers"
      );
    }
  }
);

const fetchBeerByIdActor = fromPromise(
  async ({ input }: { input: { id: number } }) => {
    try {
      const beer = await getBeerById(input.id);
      return beer;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch beer details"
      );
    }
  }
);

export const beerMachine = setup({
  types: {
    context: {} as {
      beers: Beer[];
      selectedBeer: Beer | null;
      error: string | null;
      currentPage: number;
      perPage: number;
      searchTerm: string;
      loading: boolean;
      hasMore: boolean;
    },
    events: {} as
      | { type: "FETCH_BEERS" }
      | { type: "LOAD_MORE" }
      | { type: "SELECT_BEER"; id: number }
      | { type: "SET_PAGE_SIZE"; size: number }
      | { type: "SEARCH"; term: string },
    input: {} as unknown as undefined,
  },
  actors: {
    fetchBeers: fetchBeersActor,
    fetchBeerById: fetchBeerByIdActor,
  },
}).createMachine({
  id: "beer",
  initial: "idle",
  context: {
    beers: [],
    selectedBeer: null,
    error: null,
    currentPage: 1,
    perPage: 20,
    searchTerm: "",
    loading: false,
    hasMore: true,
  },
  states: {
    idle: {
      on: {
        FETCH_BEERS: {
          target: "loading",
          actions: assign({
            loading: true,
            currentPage: 1,
          }),
        },
        LOAD_MORE: {
          target: "loading",
          actions: assign({
            loading: true,
            currentPage: ({ context }) => context.currentPage + 1,
          }),
          guard: ({ context }) => context.hasMore,
        },
        SELECT_BEER: {
          target: "selectingBeer",
          actions: assign({
            selectedBeer: null,
            loading: true,
          }),
        },
        SEARCH: {
          target: "loading",
          actions: assign({
            searchTerm: ({ event }) => event.term,
            currentPage: 1,
            beers: [],
            loading: true,
            hasMore: true,
          }),
        },
        SET_PAGE_SIZE: {
          target: "loading",
          actions: assign({
            perPage: ({ event }) => event.size,
            currentPage: 1,
            beers: [],
            loading: true,
            hasMore: true,
          }),
        },
      },
    },
    loading: {
      invoke: [
        {
          src: "fetchBeers",
          input: ({ context }) => ({
            page: context.currentPage,
            perPage: context.perPage,
            searchTerm: context.searchTerm,
            isLoadMore: context.currentPage > 1,
          }),
          onDone: {
            target: "idle",
            actions: assign({
              beers: ({ context, event }) => {
                const { beers: newBeers, isLoadMore } = event.output;

                return isLoadMore ? [...context.beers, ...newBeers] : newBeers;
              },
              hasMore: ({ event, context }) => {
                const { beers: newBeers } = event.output;

                return newBeers.length >= context.perPage;
              },
              error: null,
              loading: false,
            }),
          },
          onError: {
            target: "error",
            actions: assign({
              error: ({ event }) => getErrorMessage(event.error),
              loading: false,
            }),
          },
        },
      ],
    },
    selectingBeer: {
      invoke: [
        {
          src: "fetchBeerById",
          input: ({ event }) => ({
            id: (event as { type: "SELECT_BEER"; id: number }).id,
          }),
          onDone: {
            target: "idle",
            actions: assign({
              selectedBeer: ({ event }) => event.output,
              error: null,
              loading: false,
            }),
          },
          onError: {
            target: "error",
            actions: assign({
              error: ({ event }) => getErrorMessage(event.error),
              loading: false,
            }),
          },
        },
      ],
    },
    error: {
      on: {
        FETCH_BEERS: {
          target: "loading",
          actions: assign({ loading: true }),
        },
      },
    },
  },
});
