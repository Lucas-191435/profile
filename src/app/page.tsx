"use client"

import { log } from "../../logger";
import { toast } from "sonner"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { InferType } from "yup";
import { api } from "@/services/api";
import MoneyInput from "@/components/inputs/money-input";
import PhoneInput from "@/components/inputs/phone-input";
import CpfCnpjInput from "@/components/inputs/cpf-cnpj-input";
import { redirect } from "next/navigation";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  amount: yup.number().min(0, "Amount must be non-negative").required("Amount is required"),
  phone: yup.string().required("Phone is required").min(10, "Phone must be at least 10 digits").max(11, "Phone must be at most 11 digits"),
  document: yup.string().required("Document is required"),
});
type FormData = InferType<typeof schema>;
export default async function Home() {

  
      redirect("/login");
      
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "22",
      email: "222222",
      amount: 200,
      phone: "1111111",
      document: "50463750870",
    }
  });

  const {formState: {errors}} = form;
  console.log("Form errors:", errors); // Log para verificar erros de validação
  const submit = async (data: FormData) => {
    log("Submitting form with data:", data);
    const {request} = api.get("");
    const response = await request;
    log("Vendo response",response);
    toast(`Hello, ${data.name}!`);
  }
  log("Home page rendered"); // exemplo de log para desenvolvimento
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="w-full max-w-sm space-y-6">
          <FormField 
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <MoneyInput
            form={form}
            name="amount"
            label="Amount"
            placeholder="Enter amount"
          />

          <PhoneInput
            form={form}
            name="phone"
            label="Phone"
            placeholder="Enter phone number"
          />

          <CpfCnpjInput
            form={form}
            name="document"
            label="Document"
            placeholder="Enter document"
          />
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>   
      </Form>
    </div>
  );
}
