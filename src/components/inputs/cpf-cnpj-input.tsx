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

// Custom masking function for CPF and CNPJ
function applyCpfCnpjMask(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 11) {
    // CPF mask: 000.000.000-00
    const match = digits.match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
    if (!match) return value;
    const [, part1, part2, part3, part4] = match;
    let masked = "";
    if (part1) masked += part1;
    if (part2) masked += `.${part2}`;
    if (part3) masked += `.${part3}`;
    if (part4) masked += `-${part4}`;
    return masked;
  } else {
    // CNPJ mask: 00.000.000/0000-00
    const match = digits.match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
    if (!match) return value;
    const [, part1, part2, part3, part4, part5] = match;
    let masked = "";
    if (part1) masked += part1;
    if (part2) masked += `.${part2}`;
    if (part3) masked += `.${part3}`;
    if (part4) masked += `/${part4}`;
    if (part5) masked += `-${part5}`;
    return masked;
  }
}

type PhoneInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
};

export default function CpfCnpjInput({
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
              value={applyCpfCnpjMask(field.value || "")}
              onChange={(e: any) => {
                const digits = e.target.value.replace(/\D/g, "");
                field.onChange(digits); 
              }}
              onBlur={field.onBlur}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              type="tel"
              placeholder={placeholder ?? "000.000.000-00 ou 00.000.000/0000-00"}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}