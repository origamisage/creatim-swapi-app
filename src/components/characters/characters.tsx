import { Pagination } from "./pagination";
import { StarWarsCharacterCard } from "./character-card";
import { AlertTriangle } from "lucide-react";
import useCharacters from "@/hooks/useCharacters";
import { twMerge as cn } from "tailwind-merge";

function StarWarsCharacters() {
  const {
    data,
    isLoading,
    error,
    page,
    handleDecrementPage,
    handleIncrementPage,
    hasNextPage,
    hasPreviousPage,
    handleCharacterEdit,
  } = useCharacters();

  if (isLoading) {
    return (
      <section>
        <ul className="mx-auto grid w-full max-w-4xl grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-6 gap-y-6">
          {/* SKELETON */}
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <li className="@container h-full" key={index}>
                <div
                  className={cn(
                    "bg-muted h-[300px] animate-pulse rounded-xl",
                    "@max-[320px]:h-154",
                  )}
                ></div>
              </li>
            ))}
        </ul>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="border-destructive bg-destructive/10 text-destructive col-span-full flex items-center gap-2 rounded-md border p-4">
          <AlertTriangle className="size-5" />
          <p>The Force is strong with this error. Please try again.</p>
        </div>
      </section>
    );
  }

  const characters = data?.results;

  return (
    <section>
      <ul className="mx-auto grid w-full max-w-4xl grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-6 gap-y-6">
        {characters?.map((character) => (
          <li key={character.url}>
            <StarWarsCharacterCard
              character={character}
              onEdit={handleCharacterEdit}
            />
          </li>
        ))}
      </ul>

      <Pagination
        page={page}
        onNext={handleIncrementPage}
        onPrevious={handleDecrementPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </section>
  );
}

export { StarWarsCharacters };
