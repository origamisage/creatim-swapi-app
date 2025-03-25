import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  FieldError,
  Form,
  Group,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  ModalOverlay,
  NumberField,
  Popover,
  Select,
  SelectValue,
  TextField,
} from "react-aria-components";
import { z } from "zod";
import { Person } from "../App";
import {
  animate,
  AnimatePresence,
  AnimationState,
  clamp,
  DraggableProps,
  motion,
  MotionConfig,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";
import { twMerge as cn } from "tailwind-merge";
import { MotionModal, MotionModalOverlay } from "./motion-component-wrappers";
import { useMediaQuery } from "react-responsive";
import useMeasure from "react-use-measure";

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

export function EditModal({ character }: { character: Person }) {
  const [open, setOpen] = useState(false);

  const overlayFilterNumber = useMotionValue(0);
  const overlayFilter = useMotionTemplate`blur(${overlayFilterNumber}px)`;
  const overlayBg = useMotionValue(`rgba(0, 0, 0, 0)`); // Set initial color

  // DRAG CONTROLS
  const [heightRef, { height: modalHeight }] = useMeasure();
  const BLUR_CONSTANT = 4;
  const COLOR_OPACITY_CONSTANT = 0.6;
  const isMobile = useMediaQuery({ query: "(max-width: 576px)" });

  const dragStuff = isMobile
    ? ({
        drag: "y",
        dragConstraints: { top: 0, bottom: 0, left: 0, right: 0 },
        dragElastic: { top: 0.05, bottom: 1, left: 0, right: 0 },
        dragTransition: {
          bounceStiffness: 600,
          restDelta: 0.005,
        },
        onDrag: (_, { offset }) => {
          const offsetY = offset.y;
          const percentage = clamp(0, 1, offsetY / modalHeight);
          const bgPercent = (1 - percentage) * COLOR_OPACITY_CONSTANT;
          overlayBg.set(`rgba(0, 0, 0, ${bgPercent})`);
          const blurPercent = (1 - percentage) * BLUR_CONSTANT;
          overlayFilterNumber.set(blurPercent);
        },
        onDragEnd: (_, { offset, velocity }) => {
          if (offset.y / modalHeight > 0.5 || velocity.y > 20) {
            setOpen(false);
          } else {
            animate(overlayBg, `rgba(0, 0, 0, ${COLOR_OPACITY_CONSTANT})`);
            // animate(overlayFilterNumber, BLUR_CONSTANT);
          }
        },
      } as DraggableProps)
    : undefined;

  return (
    <MotionConfig
      transition={{
        type: "spring",
        damping: 45,
        mass: 1,
        stiffness: 700,
      }}
    >
      <Button
        onPress={() => setOpen(!open)}
        className={[
          "bg-swapi-400 rounded-md px-6 py-1.5 font-bold text-black",
          "data-hovered:bg-swapi-500",
          "@max-[320px]:self-center @max-[320px]:px-13 @max-[320px]:text-2xl",
        ].join(" ")}
      >
        Edit
      </Button>
      <AnimatePresence initial={false}>
        {open && (
          <>
            <MotionModalOverlay
              className={cn(
                "fixed inset-0",
                "z-50 sm:flex sm:items-center sm:justify-center",
                // "z-50 flex items-center justify-center",
              )}
              isOpen
              onOpenChange={setOpen}
              variants={{
                hidden: {
                  backgroundColor: `rgba(0, 0, 0, 0.0)`,
                  backdropFilter: "blur(0px)",
                  transition: {
                    duration: 0.1,
                  },
                },
                visible: {
                  backgroundColor: `rgba(0, 0, 0, ${COLOR_OPACITY_CONSTANT})`,
                  backdropFilter: `blur(${BLUR_CONSTANT}px)`,
                  transition: isMobile
                    ? {
                        duration: isMobile ? 0.3 : 0.2,
                      }
                    : {},
                },
              }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{
                backgroundColor: overlayBg as any,
                backdropFilter: overlayFilter as any,
                WebkitBackdropFilter: overlayFilter as any,
              }}
            >
              <MotionModal
                ref={heightRef}
                variants={{
                  hidden: {
                    // opacity: isMobile ? 1 : 0.01,
                    translateY: isMobile ? "100%" : "0%",
                    scale: isMobile ? 1 : 0.9,
                    transition: {
                      duration: 0.1,
                    },
                  },
                  visible: {
                    // opacity: 1,
                    translateY: "0%",
                    scale: 1,
                    transition: isMobile
                      ? {
                          type: "spring",
                          duration: 0.3,
                          bounce: 0,
                        }
                      : {},
                  },
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={cn(
                  "bg-red-400",
                  "sm:max-w-lg sm:min-w-96 sm:rounded-lg sm:border sm:p-6 sm:shadow-lg",
                  "max-sm:absolute max-sm:inset-x-0 max-sm:bottom-0 max-sm:h-fit max-sm:rounded-t-[20px] max-sm:p-4.5 max-sm:pb-4",
                )}
                {...dragStuff}
              >
                <motion.div className="bg-border absolute top-2 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full sm:hidden" />
                {isMobile && (
                  <span className="absolute right-0 -bottom-10 left-0 h-10 w-full bg-red-400" />
                )}
                <Dialog role="alertdialog" className="outline-none">
                  <EditForm character={character} />
                </Dialog>
              </MotionModal>
            </MotionModalOverlay>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

function EditForm({ character }: { character: Person }) {
  const queryClient = useQueryClient();

  function editCharacterAction(payload: FormData) {
    const formData = Object.fromEntries(payload);
    const { success, data, error } = editPersonSchema.safeParse(formData);

    if (!success) {
      console.log(error);
      return null;
    }

    const previousData = queryClient.getQueryData(["people", 1]);

    const updatedPeople = previousData?.results?.map((person) => {
      if (person.url === character.url) {
        return {
          ...person,
          ...data,
          edited: new Date().toISOString(),
        };
      }
      return person;
    });

    queryClient.setQueryData(["people", 1], (oldData) => ({
      ...oldData,
      results: updatedPeople,
    }));

    return null;
  }

  return (
    <Form
      className="text-white"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        startTransition(() => editCharacterAction(formData));
      }}
    >
      <fieldset className="mb-4">
        <legend className="sr-only">Edit Character Details</legend>

        {/* NAME */}
        <TextField
          name="name"
          type="text"
          isRequired
          defaultValue={character.name}
        >
          <Label>Name</Label>
          <Input className="border border-white" />
          <FieldError className="text-red-500" />
        </TextField>

        {/* HEIGHT */}
        <NumberField name="height" isRequired defaultValue={+character.height}>
          <Label>Height</Label>
          <Group>
            <Button slot="decrement">-</Button>
            <Input className="border border-white" />
            <Button slot="increment">+</Button>
          </Group>
        </NumberField>

        {/* MASS */}
        <NumberField
          name="mass"
          isRequired
          minValue={0}
          defaultValue={+character.mass}
        >
          <Label>Mass</Label>
          <Group>
            <Button slot="decrement">-</Button>
            <Input className="border border-white" />
            <Button slot="increment">+</Button>
          </Group>
        </NumberField>

        {/* HAIR COLOR */}
        <TextField
          name="hair_color"
          type="text"
          isRequired
          defaultValue={character.hair_color}
        >
          <Label>Hair color</Label>
          <Input className="border border-white" />
          <FieldError className="text-red-500" />
        </TextField>

        {/* SKIN COLOR */}
        <TextField
          name="skin_color"
          type="text"
          isRequired
          defaultValue={character.skin_color}
        >
          <Label>Skin color</Label>
          <Input className="border border-white" />
          <FieldError className="text-red-500" />
        </TextField>

        {/* EYE COLOR */}
        <TextField
          name="eye_color"
          type="text"
          isRequired
          defaultValue={character.eye_color}
        >
          <Label>Eye color</Label>
          <Input className="border border-white" />
          <FieldError className="text-red-500" />
        </TextField>

        {/* BIRTH YEAR */}
        <TextField
          name="birth_year"
          type="text"
          isRequired
          defaultValue={character.birth_year}
        >
          <Label>Birth year</Label>
          <Input className="border border-white" />
          <FieldError className="text-red-500" />
        </TextField>

        {/* GENDER */}
        <Select name="gender" defaultSelectedKey={character.gender} isRequired>
          <Label>Gender</Label>
          <Button>
            <SelectValue />
            <span aria-hidden="true">▼</span>
          </Button>
          <Popover className="bg-swapi-950">
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
      </fieldset>

      {/* SUBMIT CONTROLS */}
      <div className="mt-10 grid grid-cols-2 gap-x-3 justify-self-end">
        <Button
          slot="close"
          className="self-center rounded-md bg-stone-700 px-6 py-1.5 font-bold text-white data-hovered:bg-stone-600"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-swapi-400 data-hovered:bg-swapi-500 self-center rounded-md px-6 py-1.5 font-bold text-black"
        >
          Submit
        </Button>
      </div>
    </Form>
  );
}
