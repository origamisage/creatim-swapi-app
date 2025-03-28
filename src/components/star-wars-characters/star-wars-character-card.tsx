import { Person } from "../../queries";
import { EditModal } from "./edit-modal";

type StarWarsCharacterCardProps = {
  character: Person;
  page: number;
};

export function StarWarsCharacterCard({
  character,
  page,
}: StarWarsCharacterCardProps) {
  // Extract the ID from the URL
  const id = extractId(character.url);
  // Select appropriate image based on the ID, if null, use a placeholder
  const imageUrl = getImageUrl(id);

  return (
    <div className="@container h-full">
      <div
        className={[
          "bg-card relative flex h-full w-full flex-col overflow-hidden rounded-xl",
          "@max-[320px]:h-154 @max-[320px]:justify-end",
        ].join(" ")}
      >
        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 @[320px]:hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%), url(${imageUrl})`,
          }}
        />

        {/* NAME */}
        <h2
          className={[
            "bg-muted relative w-full px-4 py-3 text-2xl font-bold",
            "@max-[320px]:bg-transparent @max-[320px]:px-5 @max-[320px]:py-0 @max-[320px]:text-3xl",
          ].join(" ")}
        >
          {character.name}
        </h2>

        <div
          className={[
            "relative grid grid-cols-2 gap-x-4 p-4",
            "@max-[320px]:grid-cols-1 @max-[320px]:gap-y-9 @max-[320px]:px-5 @max-[320px]:pb-11 @max-[320px]:text-lg",
          ].join(" ")}
        >
          <CharacterAttributes character={character} />

          <div className="flex flex-col gap-y-4">
            <img
              src={imageUrl}
              alt={character.name}
              className={[
                "mt-0.5 aspect-square rounded-lg object-cover object-top",
                "@max-[320px]:hidden",
              ].join(" ")}
            />

            <EditModal page={page} character={character} />
          </div>
        </div>
      </div>
    </div>
  );
}

type CharacterAttributesProps = Pick<
  Person,
  | "height"
  | "mass"
  | "hair_color"
  | "skin_color"
  | "eye_color"
  | "birth_year"
  | "gender"
>;

const CharacterAttributes = ({
  character,
}: {
  character: CharacterAttributesProps;
}) => (
  <ul className="grid h-fit grid-cols-1 gap-y-2 @max-[320px]:gap-y-1">
    <li>
      Height: <span className="font-bold">{character.height} cm</span>
    </li>
    <li>
      Mass: <span className="font-bold">{character.mass} kg</span>
    </li>
    <li className="capitalize">
      Hair color: <span className="font-bold">{character.hair_color}</span>
    </li>
    <li className="capitalize">
      Skin color:{" "}
      <span className="font-bold capitalize">{character.skin_color}</span>
    </li>
    <li className="capitalize">
      Eye color:{" "}
      <span className="font-bold capitalize">{character.eye_color}</span>
    </li>
    <li>
      Birth year: <span className="font-bold">{character.birth_year}</span>
    </li>
    <li className="capitalize">
      Gender: <span className="font-bold capitalize">{character.gender}</span>
    </li>
  </ul>
);

// Helper function to get the image URL
function getImageUrl(id: string | null) {
  if (!id) {
    return "/src/assets/images/people/placeholder.webp";
  }
  return `/src/assets/images/people/${id}.jpg`;
}

// Helper function to extract the ID from the URL
function extractId(url: string) {
  const parts = url.split("/");
  const index = parts.indexOf("people");
  return index !== -1 && index + 1 < parts.length ? parts[index + 1] : null;
}
