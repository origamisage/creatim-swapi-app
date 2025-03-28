export type Character = {
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
  results: Character[];
};

export type HandleCharacterEdit = (
  characterUrl: string,
  data: FormData,
) =>
  | {
      success: boolean;
      error: string;
    }
  | {
      success: boolean;
      error: boolean;
    };
