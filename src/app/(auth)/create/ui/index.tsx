"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvatarPicker } from "@/components/shared/AvatarPicker";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import { useCreateUser } from "@/services/queries/useUser";
import { createUserSchema, CreateUserSchemaType } from "@/validations/AuthSchema";
import { PrivateRoutes, PublicRoutes } from "@/constants/mapperRoutes";
import { TRAINERS } from "@/utils/trainers";
import { errorToast, infoToast, successToast } from "@/utils/toasts";

const inputClassName =
  "w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

const CreateUserComponentPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createUser = useCreateUser();
  const [avatarOpen, setAvatarOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      avatar: TRAINERS[0].id,
      name: "",
      description: "",
      email: "",
      password: "",
      validatePassword: "",
    },
    resolver: yupResolver(createUserSchema),
  });

  const avatarId = useWatch({ control: form.control, name: "avatar" });
  const trainer = TRAINERS.find((t) => t.id === avatarId) ?? TRAINERS[0];
  const isSubmitting = form.formState.isSubmitting;

  const handleCreate = async (data: CreateUserSchemaType) => {
    const { avatar, name, description, email, password } = data;

    try {
      await createUser.mutateAsync({
        avatar,
        name: name.trim(),
        description: description?.trim() || undefined,
        email,
        password,
      });
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 409) {
        form.setError("email", { message: "E-mail já cadastrado" });
      } else {
        errorToast({ description: "Não foi possível criar a conta. Tente novamente." });
      }
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });

    if (!result?.ok) {
      infoToast({ description: "Conta criada, faça login" });
      router.replace(`${PublicRoutes.login.defaultPage}?email=${encodeURIComponent(email)}`);
      return;
    }

    api.clearSessionCache();
    queryClient.clear();
    successToast({ description: "Conta criada! Bem-vindo, treinador!" });
    router.replace(PrivateRoutes.client.dashboard);
  };

  return (
    <div
      className="w-full max-w-md rounded-2xl p-8 border border-white/10 shadow-2xl glow-red my-8"
      style={{
        backgroundColor: "hsl(220 20% 7% / 0.35)",
        backdropFilter: "blur(16px) saturate(140%)",
        WebkitBackdropFilter: "blur(16px) saturate(140%)",
      }}
    >
      <Form {...form}>
        <div className="flex flex-col items-center mb-6">
          <h1 className="font-display text-3xl font-bold tracking-widest text-glow text-foreground">
            NOVO TREINADOR
          </h1>
          <p className="text-muted-foreground text-center mt-2 font-body">
            Escolha seu avatar e crie sua conta para começar a jornada.
          </p>
        </div>

        <div className="flex flex-col items-center mb-6">
          <button
            type="button"
            onClick={() => setAvatarOpen(true)}
            className="relative group hover:cursor-pointer"
            aria-label="Trocar avatar"
          >
            <Avatar className="w-24 h-24 border-4 border-card ring-2 ring-primary/50 bg-background">
              <AvatarImage src={trainer.url} alt={trainer.name} className="object-contain" />
              <AvatarFallback className="font-display">{trainer.name[0]}</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Pencil className="w-3 h-3" />
            </span>
          </button>
          <span className="font-display text-xs tracking-wide text-muted-foreground mt-2">{trainer.name}</span>
        </div>

        <form onSubmit={form.handleSubmit(handleCreate)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Nome</FormLabel>
                <FormControl>
                  <input {...field} maxLength={50} className={inputClassName} placeholder="Nome do treinador" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Descrição (opcional)</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    maxLength={160}
                    rows={2}
                    className={cn(inputClassName, "resize-none")}
                    placeholder="Conte algo sobre você"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormControl>
                  <input {...field} type="email" className={inputClassName} placeholder="Entre com seu email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Senha</FormLabel>
                <FormControl>
                  <input {...field} type="password" className={inputClassName} placeholder="Mínimo 6 caracteres" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="validatePassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Confirmar senha</FormLabel>
                <FormControl>
                  <input {...field} type="password" className={inputClassName} placeholder="Repita a senha" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "relative w-full px-4 py-2 text-white focus:outline-none font-display focus:ring-2 focus:ring-accent transition-colors duration-500",
              [
                "bg-sidebar-accent text-sidebar-foreground shadow-lg shadow-primary/20",
                "border border-primary/30 font-semibold",
                "hover:cursor-pointer",
                "hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20",
              ],
            )}
          >
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href={PublicRoutes.login.defaultPage} className="text-primary hover:underline">
              Já tenho conta
            </Link>
          </p>
        </form>
      </Form>

      <AvatarPicker
        open={avatarOpen}
        onOpenChange={setAvatarOpen}
        selectedId={avatarId}
        onSelect={(id) => {
          form.setValue("avatar", id);
          setAvatarOpen(false);
        }}
      />
    </div>
  );
};

export default CreateUserComponentPage;
