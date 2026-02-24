'use client';
import Image from "next/image";
import { useState } from "react";
import { authSchema } from "@/validations/AuthSchema";
import { z } from "zod";
import { log } from "../../../../../logger";

export default function ResetPasswordComponentPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password match
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    // Validate using AuthSchema
   

    setError("");
    log("Reset password submitted", { email });
    // Call API or handle reset password logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-md"
        >
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Resetar Senha
          </h1>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md dark:bg-zinc-800 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md dark:bg-zinc-800 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-md dark:bg-zinc-800 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Resetar Senha
          </button>
        </form>
      </main>
    </div>
  );
}
