import { Beer } from "../types/beer";

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API;

export const getBeers = async (
  page = 1,
  perPage = 10,
  searchTerm = ""
): Promise<Beer[]> => {
  try {
    const url = new URL(`${API_BASE_URL}/beers`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", String(perPage));
    if (searchTerm) {
      url.searchParams.set("beer_name", searchTerm);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch beers: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching beers:", error);
    throw error;
  }
};

export const getBeerById = async (id: number): Promise<Beer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/beers/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch beer with ID ${id}: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching beer with id ${id}:`, error);
    throw error;
  }
};
