import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/field";
import { ListBox, ListBoxItem } from "@/components/ui/list-box";
import { MyNumberField } from "@/components/ui/numberfield";
import { Popover } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MyTextField } from "@/components/ui/textfield";
import { Character, HandleCharacterEdit } from "@/types/characters";
import { AlertTriangle } from "lucide-react";
import { startTransition, useActionState } from "react";
import { Form } from "react-aria-components";

type EditFormProps = {
  character: Character;
  onEdit: HandleCharacterEdit;
  afterSave: () => void;
};

function EditForm({ character, onEdit, afterSave }: EditFormProps) {
  // We are using React's new useActionState hook to manage the form state and submit action
  async function editCharacterAction(_prevState: unknown, payload: FormData) {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { error, success } = onEdit(character.url, payload);

    if (!success) {
      return { error };
    }
    afterSave();
  }

  const [state, formAction, isPending] = useActionState(
    editCharacterAction,
    null,
  );

  // I chose to use browser's native form validation, React Aria also provides as with the way of stylig error messages
  // Form elements are uncontrolled and their values are later parsed from FormData using Zod
  // If the form was more complex, I'd probably go for a more robust solution like React Hook Form or the new Tanstack Form library

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        startTransition(() => formAction(formData));
      }}
    >
      <div className="grid grid-cols-2 gap-x-2 gap-y-3">
        {/* ERROR */}
        {state?.error && (
          <div className="border-destructive bg-destructive/10 text-destructive col-span-full flex items-center gap-2 rounded-md border p-4">
            <AlertTriangle className="size-5" />
            <p>{state?.error}</p>
          </div>
        )}

        {/* NAME */}
        <MyTextField
          name="name"
          type="text"
          isRequired
          defaultValue={character.name}
          label="Name"
          className="max-sm:col-span-full"
        />
        {/* HEIGHT */}
        <MyNumberField
          name="height"
          isRequired
          minValue={0}
          defaultValue={+character.height}
          label="Height"
        />

        {/* MASS */}
        <MyNumberField
          name="mass"
          isRequired
          minValue={0}
          defaultValue={+character.mass}
          label="Mass"
        />
        {/* HAIR COLOR */}
        <MyTextField
          name="hair_color"
          type="text"
          isRequired
          defaultValue={character.hair_color}
          label="Hair color"
        />
        {/* SKIN COLOR */}
        <MyTextField
          name="skin_color"
          type="text"
          isRequired
          defaultValue={character.skin_color}
          label="Skin color"
        />

        {/* EYE COLOR */}
        <MyTextField
          name="eye_color"
          type="text"
          isRequired
          defaultValue={character.eye_color}
          label="Eye color"
        />

        {/* BIRTH YEAR */}
        <MyTextField
          name="birth_year"
          type="text"
          isRequired
          defaultValue={character.birth_year}
          validate={validateStarWarsYear}
          label="Birth year"
        />
        {/* GENDER */}
        <Select
          name="gender"
          defaultSelectedKey={character.gender}
          isRequired
          className="flex flex-col gap-1.5"
        >
          <Label className="font-bold">Gender</Label>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <Popover className="bg-swapi-950 w-[var(--trigger-width)]">
            <ListBox>
              <ListBoxItem textValue="Male" id="male">
                Male
              </ListBoxItem>
              <ListBoxItem textValue="Female" id="female">
                Female
              </ListBoxItem>
              <ListBoxItem textValue="Hermaphrodite" id="hermaphrodite">
                Hermaphrodite
              </ListBoxItem>
              <ListBoxItem textValue="None" id="none">
                None
              </ListBoxItem>
              <ListBoxItem textValue="N/A" id="n/a">
                N/A
              </ListBoxItem>
            </ListBox>
          </Popover>
        </Select>
      </div>

      {/* SUBMIT CONTROLS */}
      <div className="col-span-full mt-8 grid h-full grid-cols-2 gap-x-3">
        <Button slot="close" variant="secondary" isDisabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" isDisabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </Form>
  );
}

// Easter egg: Validate Star Wars year, check: https://starwars.fandom.com/wiki/Galactic_Standard_Calendar
function validateStarWarsYear(yearString: string): string | undefined {
  // "unknown" is a valid year
  if (yearString === "unknown") return undefined;

  const era = yearString.slice(-3); // Extract the era part
  const validEras = ["BBY", "ABY"];

  // Validate era
  if (!validEras.includes(era)) {
    return "Invalid Star Wars year";
  }

  const yearPart = yearString.slice(0, -3); // Extract the year part
  const year = parseInt(yearPart, 10); // Convert to integer

  // Validate year
  if (isNaN(year) || year < 0 || (era === "ABY" && year === 0)) {
    return "Invalid Star Wars year";
  }
  // If all checks pass, return undefined (valid year)
  return undefined;
}

export { EditForm };
