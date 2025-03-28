import { ChevronDown, ChevronUp } from "lucide-react";
import {
  ButtonProps as AriaButtonProps,
  Input as AriaInput,
  InputProps as AriaInputProps,
  NumberField as AriaNumberField,
  NumberFieldProps as AriaNumberFieldProps,
  ValidationResult as AriaValidationResult,
  Button,
  composeRenderProps,
  Text,
} from "react-aria-components";

import { twMerge as cn } from "tailwind-merge";
import { FieldError, FieldGroup, Label } from "./field";

const NumberField = AriaNumberField;

function NumberFieldInput({ className, ...props }: AriaInputProps) {
  return (
    <AriaInput
      className={composeRenderProps(className, (className) =>
        cn(
          "bg-background placeholder:text-muted-foreground w-fit min-w-0 flex-1 border-r border-transparent pr-2 outline outline-0 [&::-webkit-search-cancel-button]:hidden",
          className,
        ),
      )}
      {...props}
    />
  );
}

function NumberFieldSteppers({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "absolute right-0 flex h-full flex-col border-l",
        className,
      )}
      {...props}
    >
      <NumberFieldStepper slot="increment">
        <ChevronUp aria-hidden className="size-4" />
      </NumberFieldStepper>
      <div className="border-b" />
      <NumberFieldStepper slot="decrement">
        <ChevronDown aria-hidden className="size-4" />
      </NumberFieldStepper>
    </div>
  );
}

function NumberFieldStepper({ className, ...props }: AriaButtonProps) {
  return (
    <Button
      className={composeRenderProps(className, (className) =>
        cn("text-muted-foreground w-auto grow rounded-none px-0.5", className),
      )}
      {...props}
    />
  );
}

interface JollyNumberFieldProps extends AriaNumberFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: AriaValidationResult) => string);
}

function MyNumberField({
  label,
  description,
  errorMessage,
  className,
  ...props
}: JollyNumberFieldProps) {
  return (
    <NumberField
      className={composeRenderProps(className, (className) =>
        cn("flex flex-col gap-2", className),
      )}
      {...props}
    >
      <Label>{label}</Label>
      <FieldGroup>
        <NumberFieldInput />
        <NumberFieldSteppers />
      </FieldGroup>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
    </NumberField>
  );
}

export {
  NumberField,
  NumberFieldInput,
  NumberFieldSteppers,
  NumberFieldStepper,
  MyNumberField,
};
