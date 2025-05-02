import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://punkapi.online/v3/beers", () => {
    return HttpResponse.json([
      { id: 1, name: `Beer 1`, tagline: "Mocked" },
      { id: 2, name: `Beer 2`, tagline: "Mocked" },
    ]);
  }),

  http.get("https://punkapi.online/v3/beers/:id", ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      id: Number(id),
      name: `Beer ${id}`,
      tagline: "A Mocked IPA",
    });
  }),
];
