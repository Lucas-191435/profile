"use client";

import { useAuth } from "@/hooks/useAuth";
import { forgotPasswordSchema } from "@/validations/AuthSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { MoveLeft } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { log } from "../../../../../logger";
import {
  useRouter,
} from "next/navigation";
import { Button } from "@/components/ui/button";
const ForgotPasswordComponentPage = () => {
  const router = useRouter();

  const form = useForm(
    {
      defaultValues: {
        email: "",
      },
      resolver: yupResolver(forgotPasswordSchema),
    }
  )
  const { formState: { errors } } = form;
  log("Form errors:", errors); // Log para verificar erros de validação
  const { handleForgotPassword } = useAuth();


  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black border border-red-400">
      <div className="w-full max-w-sm mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/login")} className="mb-4">
          <MoveLeft className="inline-block mr-1" color="black" size={16} />
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleForgotPassword)} className="w-full max-w-sm space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
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
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>

        </form>
      </Form>

    </div>
  )
}

export default ForgotPasswordComponentPage;