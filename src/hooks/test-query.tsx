import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AllPeople } from "../queries";
import { z } from "zod";

// NOTE: This solution "works" but I would not use it to build a real app, I would rather reach for a battle-tested library like Tanstack Query to handle async state synchronization and caching
// This soulution does not provide a way to refetch/revalidate data and is not scalable

const editPersonSchema = z.object({
  name: z.string(),
  birth_year: z.string(),
  eye_color: z.string(),
  gender: z.string(),
  hair_color: z.string(),
  height: z.string(),
  mass: z.string(),
  skin_color: z.string(),
});

type StarWarsContextType = {
  data: AllPeople | null;
  setData: React.Dispatch<React.SetStateAction<AllPeople | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const CharactersContext = createContext<StarWarsContextType | undefined>(
  undefined,
);

export function StarWarsContextProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AllPeople | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <CharactersContext.Provider
      value={{ data, setData, isLoading, setIsLoading, error, setError }}
    >
      {children}
    </CharactersContext.Provider>
  );
}

function useStarWarsContext() {
  const context = useContext(CharactersContext);
  if (context === undefined) {
    throw new Error("useStarWarsContext must be used within a CountProvider");
  }
  return context;
}

export default function useStarWarsPeopleTest({ page }: { page: number }) {
  const { data, setData, isLoading, setIsLoading, error, setError } =
    useStarWarsContext();

  useEffect(() => {
    // Ignore flag is necessary to prevent race conditions when url changes
    let ignore = false;

    const handleFetch = async () => {
      setData(null);
      setIsLoading(true);
      setError(null);

      //
      const cacheKey = `people-${page}`;

      // Check local storage for existing data
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        if (!ignore) {
          setData(JSON.parse(cachedData));
          setIsLoading(false);
        }
        return; // Exit early if data is found in local storage
      }

      try {
        const res = await fetch(`https://swapi.dev/api/people/?page=${page}`);
        if (ignore) {
          return;
        }
        if (res.ok === false) {
          throw new Error(`A network error occurred.`);
        }
        const json = await res.json();
        // Save data to local storage
        localStorage.setItem(cacheKey, JSON.stringify(json));

        setData(json);
        setIsLoading(false);
      } catch {
        setError("Something went wrong. Please try again later.");
        setIsLoading(false);
      }
    };

    handleFetch();

    return () => {
      ignore = true;
    };
  }, [page, setData, setError, setIsLoading]);

  const updateCharacter = (characterUrl: string, data: FormData) => {
    // This is where we would make the API call to update the character
    // try {
    //     const res = await fetch(`https://swapi.dev/api/updatePerson`, {
    //       method: "POST",
    //       body: data,
    //     });
    //     if (ignore) {
    //       return;
    //     }
    //     if (res.ok === false) {
    //       throw new Error(`A network error occurred.`);
    //     }
    //     const json = await res.json();
    //     // Save data to local storage
    //     localStorage.setItem(cacheKey, JSON.stringify(json));

    //   } catch (e) {
    //     setError("Something went wrong.");
    //     setIsLoading(false);
    //   }

    // Since we are not making an API call, we can just update the local storage

    // Validate the incoming data against the schema
    const formData = Object.fromEntries(data);

    const parsedData = editPersonSchema.safeParse(formData);
    if (!parsedData.success) {
      console.log(parsedData.error);
    }

    // Retrieve the existing data from local storage
    const cacheKey = `people-${page}`;
    const prevData = localStorage.getItem(cacheKey);

    // If the previous data is not available, we return it as is
    if (!prevData)
      return {
        success: false,
        error: "Something went wrong.",
      };

    // We are "assuming" that the data is of correct type, we could also parse it with Zod to validate it
    const parsedPrevData = JSON.parse(prevData) as AllPeople;

    // Update the local storage with the new data
    const updatedData = {
      ...parsedPrevData,
      results: parsedPrevData.results.map((person) => {
        if (person.url === characterUrl) {
          const updatedCharacter = {
            ...person,
            ...parsedData.data, // Use validated data
            edited: new Date().toISOString(),
          };
          return updatedCharacter;
        }
        return person;
      }),
    };
    setData(updatedData);
    localStorage.setItem(cacheKey, JSON.stringify(updatedData));

    return {
      success: true,
      error: false,
    };
  };

  return { data, isLoading, error, updateCharacter };
}
