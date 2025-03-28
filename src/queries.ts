import { queryOptions, useQuery } from "@tanstack/react-query";

export type Person = {
  name: string;
  birth_year: string;
  eye_color: string;
  gender: string;
  hair_color: string;
  height: string;
  mass: string;
  skin_color: string;
  homeworld: string;
  films: string[];
  species: string[];
  starships: string[];
  vehicles: string[];
  url: string;
  created: string;
  edited: string;
};

export type AllPeople = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[];
};

// NOTE: We assume the shape of the schema is correct, and we don't validate it
// We could use Zod to validate the shape during run-time, but that would add some overhead and is probably an overkill for a demo app
async function fetchPeople({ page }: { page: number }): Promise<AllPeople> {
  const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
  const data = await response.json();
  return data;
}

// By extracting the query options, we can easily reuse them and ensure typesafety even when interacting dirrectly with the query cache through getQueryData
export const allPeopleOptions = ({ page = 1 }: { page: number }) =>
  queryOptions({
    queryKey: ["people", { page: page }],
    queryFn: () => fetchPeople({ page: page }),

    // Stale time is intentionally set to a large number, by doing so we prevent data from being refetched
    // In a real application, you would want to set this to a reasonable value to keep the data in sync with the server
    staleTime: 1000 * 60 * 60 * 24, // 24 hours

    // Again, we prevent useQuery from refetching data on window focus, keeping localStorage as the "source of truth"
    refetchOnWindowFocus: false,
  });

export function useAllStarWarsCharacters({ page = 1 }: { page: number }) {
  return useQuery(allPeopleOptions({ page }));
}
