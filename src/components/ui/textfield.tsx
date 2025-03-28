import {
  Input as AriaInput,
  InputProps as AriaInputProps,
  TextArea as AriaTextArea,
  TextAreaProps as AriaTextAreaProps,
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  composeRenderProps,
  ValidationResult as AriaValidationResult,
  Text,
} from "react-aria-components";

import { twMerge as cn } from "tailwind-merge";
import { FieldError, Label } from "./field";

const TextField = AriaTextField;

const Input = ({ className, ...props }: AriaInputProps) => {
  return (
    <AriaInput
      className={composeRenderProps(className, (className) =>
        cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground file: flex h-12 w-full rounded-md border px-3 py-2 file:border-0 file:bg-transparent file:font-medium",
          /* Disabled */
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          /* Focused */
          "data-[focused]:ring-ring data-[focused]:ring-2 data-[focused]:ring-offset-2 data-[focused]:outline-none",
          /* Resets */
          "focus-visible:outline-none",
          className,
        ),
      )}
      {...props}
    />
  );
};

const TextArea = ({ className, ...props }: AriaTextAreaProps) => {
  return (
    <AriaTextArea
      className={composeRenderProps(className, (className) =>
        cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground flex min-h-[80px] w-full rounded-md border px-3 py-2",
          /* Focused */
          "data-[focused]:ring-ring data-[focused]:ring-2 data-[focused]:ring-offset-2 data-[focused]:outline-none",
          /* Disabled */
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          /* Resets */
          "focus-visible:outline-none",
          className,
        ),
      )}
      {...props}
    />
  );
};

interface MyTextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: AriaValidationResult) => string);
  textArea?: boolean;
}

function MyTextField({
  label,
  description,
  errorMessage,
  className,
  ...props
}: MyTextFieldProps) {
  return (
    <TextField
      className={composeRenderProps(className, (className) =>
        cn("flex flex-col gap-2", className),
      )}
      {...props}
    >
      <Label>{label}</Label>
      <Input />
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  );
}
export { Input, TextField, TextArea, MyTextField };
