"use client"

import Image from "next/image";
import { log } from "../../logger";
import { toast } from "sonner"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { InferType } from "yup";
import { api } from "@/services/api";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});
type FormData = InferType<typeof schema>;
export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const submit = async (data: FormData) => {
    const {request} = api.get("");
    const response = await request;
    log("Vendo response",response);
    toast(`Hello, ${data.name}!`);
  }
  log("Home page rendered"); // exemplo de log para desenvolvimento
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            {...register("name")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register("email")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Show Toast
          </button>
        </div>
      </form>
    </div>
  );
}
