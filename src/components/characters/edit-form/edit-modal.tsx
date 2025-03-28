import { useState } from "react";
import { Heading } from "react-aria-components";
import { EditForm } from "./edit-form";
import { Character, HandleCharacterEdit } from "@/types/characters";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";

type EditModalProps = {
  character: Character;
  onEdit: HandleCharacterEdit;
};

export function EditModal({ character, onEdit }: EditModalProps) {
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
            onEdit={onEdit}
            afterSave={() => setOpen(false)}
          />
        </div>
      </ResponsiveModal>
    </>
  );
}
