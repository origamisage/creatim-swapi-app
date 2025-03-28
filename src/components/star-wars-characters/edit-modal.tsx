import { useState } from "react";
import { Heading } from "react-aria-components";
import { Person } from "../../queries";
import { Button } from "../ui/button";
import { ResponsiveModal } from "../ui/responsive-modal";
import { EditForm } from "./edit-form";

type EditModalProps = {
  character: Person;
  page: number;
};

export function EditModal({ character, page }: EditModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onPress={() => setOpen(!open)}
        className="@max-[320px]:h-11 @max-[320px]:self-center @max-[320px]:px-13 @max-[320px]:text-2xl"
      >
        Edit
      </Button>

      <ResponsiveModal open={open} setOpen={setOpen}>
        <Heading
          slot="title"
          className="bg-muted px-4.5 py-3 text-center text-xl font-bold tracking-tight"
        >
          Edit character
        </Heading>

        <div className="p-4.5">
          <EditForm
            character={character}
            page={page}
            afterSave={() => setOpen(false)}
          />
        </div>
      </ResponsiveModal>
    </>
  );
}
