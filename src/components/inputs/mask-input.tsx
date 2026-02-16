"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { UseFormReturn } from "react-hook-form";
import { InputMask } from "@react-input/mask";

type PhoneInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
};

// Criamos um componente temporário com o tipo correto
const MaskedInput = InputMask as any;

export default function PhoneInput({
  form,
  name,
  label,
  placeholder,
}: PhoneInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MaskedInput
              mask="(__) _____-____"
              replacement={{ _: /\d/ }}
              value={field.value || ""}
              onChange={(e: any) => {
                const digits = e.target.value.replace(/\D/g, "");
                field.onChange(digits); // salva só números
              }}
              onBlur={field.onBlur}
            >
              {(inputProps: any) => (
                <Input
                  {...inputProps}
                  type="tel"
                  placeholder={placeholder ?? "(00) 00000-0000"}
                />
              )}
            </MaskedInput>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}