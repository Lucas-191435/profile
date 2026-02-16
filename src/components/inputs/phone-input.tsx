"use client";
import { useReducer } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"; // Shadcn UI import
import { Input } from "../ui/input"; // Shandcn UI Input
import { UseFormReturn } from "react-hook-form";

// Custom masking function
function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, "");
  const match = digits.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
  if (!match) return value;
  const [, areaCode, firstPart, secondPart] = match;
  let masked = "";
  if (areaCode) masked += `(${areaCode}`;
  if (firstPart) masked += `) ${firstPart}`;
  if (secondPart) masked += `-${secondPart}`;
  return masked;
}

type PhoneInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
};

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
            <Input
              value={applyPhoneMask(field.value || "")}
              onChange={(e: any) => {
                const digits = e.target.value.replace(/\D/g, "");
                field.onChange(digits); 
              }}
              onBlur={field.onBlur}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              type="tel"
              placeholder={placeholder ?? "(00) 00000-0000"}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}