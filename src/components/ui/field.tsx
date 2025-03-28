"use client";

import {
  FieldError as AriaFieldError,
  FieldErrorProps as AriaFieldErrorProps,
  Group as AriaGroup,
  GroupProps as AriaGroupProps,
  Label as AriaLabel,
  LabelProps as AriaLabelProps,
  Text as AriaText,
  TextProps as AriaTextProps,
  composeRenderProps,
} from "react-aria-components";

import { twMerge as cn } from "tailwind-merge";

const Label = ({ className, ...props }: AriaLabelProps) => (
  <AriaLabel
    className={cn(
      "leading-none font-bold",
      /* Disabled */
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
      /* Invalid */
      "group-data-[invalid]:text-destructive",
      className,
    )}
    {...props}
  />
);

function FormDescription({ className, ...props }: AriaTextProps) {
  return (
    <AriaText
      className={cn("text-muted-foreground", className)}
      {...props}
      slot="description"
    />
  );
}

function FieldError({ className, ...props }: AriaFieldErrorProps) {
  return (
    <AriaFieldError
      className={composeRenderProps(className, (className) =>
        cn("text-destructive text-sm", className),
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: AriaGroupProps) {
  return (
    <AriaGroup
      className={composeRenderProps(className, (className) =>
        cn(
          "border-input bg-background ring-offset-background relative flex h-12 w-full items-center overflow-hidden rounded-md border px-3 py-2",
          /* Focus Within */
          "data-[focus-within]:ring-ring data-[focus-within]:ring-2 data-[focus-within]:ring-offset-2 data-[focus-within]:outline-none",
          /* Disabled */
          "data-[disabled]:opacity-50",
          className,
        ),
      )}
      {...props}
    />
  );
}

export { Label, FieldGroup, FieldError, FormDescription };
