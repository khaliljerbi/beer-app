import { Beer } from "@/types/beer";

export const mockBeers: Beer[] = [
  {
    id: 1,
    name: "Beer 1",
    tagline: "Test Beer",
    first_brewed: "01/2023",
    description: "A test beer",
    image: "https://example.com/beer.png",
    abv: 5.0,
    ibu: 20,
    target_fg: 1010,
    target_og: 1050,
    ebc: 10,
    srm: 5,
    ph: 4.5,
    attenuation_level: 75,
    volume: { value: 20, unit: "litres" },
    boil_volume: { value: 25, unit: "litres" },
    method: {
      mash_temp: [
        {
          temp: { value: 65, unit: "celsius" },
          duration: 60,
        },
      ],
      fermentation: { temp: { value: 20, unit: "celsius" } },
      twist: null,
    },
    ingredients: {
      malt: [{ name: "Malt", amount: { value: 5, unit: "kg" } }],
      hops: [
        {
          name: "Hops",
          amount: { value: 50, unit: "grams" },
          add: "start",
          attribute: "bitter",
        },
      ],
      yeast: "Yeast strain",
    },
    food_pairing: ["Food 1", "Food 2"],
    brewers_tips: "Some tips",
    contributed_by: "Contributor",
  },
];
