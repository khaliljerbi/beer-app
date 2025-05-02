import { CartItem } from "@/types/cart";
import { assign, setup } from "xstate";
import { Beer } from "../types/beer";

const saveCartToLocalStorage = (items: CartItem[]): void => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const loadCartFromLocalStorage = (): CartItem[] => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

export const cartMachine = setup({
  types: {
    context: {} as {
      items: CartItem[];
      total: number;
    },
    events: {} as
      | { type: "ADD_TO_CART"; beer: Beer }
      | { type: "REMOVE_FROM_CART"; id: number }
      | { type: "UPDATE_QUANTITY"; id: number; quantity: number }
      | { type: "CLEAR_CART" }
      | { type: "LOAD_CART" },
    input: {} as unknown as undefined,
  },
}).createMachine({
  id: "cart",
  initial: "idle",
  context: {
    items: [],
    total: 0,
  },
  states: {
    idle: {
      entry: [
        assign({
          items: () => loadCartFromLocalStorage(),
        }),
        assign({
          total: ({ context }) =>
            context.items.reduce((sum, item) => sum + item.quantity, 0),
        }),
      ],
      on: {
        ADD_TO_CART: {
          actions: [
            assign({
              items: ({ context, event }) => {
                const existingItem = context.items.find(
                  (item) => item.id === event.beer.id
                );

                if (existingItem) {
                  return context.items.map((item) =>
                    item.id === event.beer.id
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
                  );
                } else {
                  return [
                    ...context.items,
                    { id: event.beer.id, quantity: 1, beer: event.beer },
                  ];
                }
              },
            }),
            ({ context }) => saveCartToLocalStorage(context.items),
            assign({
              total: ({ context }) =>
                context.items.reduce((sum, item) => sum + item.quantity, 0),
            }),
          ],
        },
        REMOVE_FROM_CART: {
          actions: [
            assign({
              items: ({ context, event }) =>
                context.items.filter((item) => item.id !== event.id),
            }),
            ({ context }) => saveCartToLocalStorage(context.items),
            assign({
              total: ({ context }) =>
                context.items.reduce((sum, item) => sum + item.quantity, 0),
            }),
          ],
        },
        UPDATE_QUANTITY: {
          actions: [
            assign({
              items: ({ context, event }) =>
                context.items.map((item) =>
                  item.id === event.id
                    ? { ...item, quantity: event.quantity }
                    : item
                ),
            }),
            ({ context }) => saveCartToLocalStorage(context.items),

            assign({
              total: ({ context }) =>
                context.items.reduce((sum, item) => sum + item.quantity, 0),
            }),
          ],
        },
        CLEAR_CART: {
          actions: [
            assign({ items: [] }),

            () => saveCartToLocalStorage([]),

            assign({ total: 0 }),
          ],
        },
        LOAD_CART: {
          actions: [
            assign({
              items: () => loadCartFromLocalStorage(),
            }),

            assign({
              total: ({ context }) =>
                context.items.reduce((sum, item) => sum + item.quantity, 0),
            }),
          ],
        },
      },
    },
  },
});
