import { useState } from "react";
import useStarWarsPeopleTest from "../../hooks/test-query";
import { StarWarsCharacterCard } from "./star-wars-character-card";
import { Pagination } from "./pagination";

function StarWarsCharacters() {
  // NOTE: In a real app, pagination should probably be handled via naviagation (/?page=3), making the URL the source of truth instead of an app state
  // Since the API doesn't provide any POST endpoints, we prop drill the page number in order to know what cached value in localStorage to update
  // Ideally, we would update the character and revalidate all the data upon succesful
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useStarWarsPeopleTest({
    page: page,
  });

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
                  className={[
                    "bg-muted h-[300px] animate-pulse rounded-xl",
                    "@max-[320px]:h-154",
                  ].join(" ")}
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
        <p>Ups, error..</p>
      </section>
    );
  }

  const characters = data?.results;

  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  return (
    <section>
      <ul className="mx-auto grid w-full max-w-4xl grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-6 gap-y-6">
        {characters?.map((character) => (
          <li key={character.url}>
            <StarWarsCharacterCard character={character} page={page} />
          </li>
        ))}
      </ul>

      <Pagination
        page={page}
        setPage={(page: number) => setPage(page)}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </section>
  );
}

export { StarWarsCharacters };
