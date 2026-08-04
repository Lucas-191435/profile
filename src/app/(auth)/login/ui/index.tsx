"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authSchema } from "@/validations/AuthSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUsersTest } from "@/services/queries/useUser";
import { TRAINERS } from "@/utils/trainers";

const TEST_USERS_PASSWORD = "Teste123@";

const LoginComponentPage = () => {
  const {data: usersTest} = useUsersTest(true)

  const [testUserModalOpen, setTestUserModalOpen] = useState(false);
  const [selectedTestUserId, setSelectedTestUserId] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm(
    {
      defaultValues: {
        email: "",
        password: "",
      },
      resolver: yupResolver(authSchema),
    }
  )
  const { formState: { errors } } = form;
  log("Form errors:", errors); // Log para verificar erros de validação
  const { handleLogin } = useAuth();

  const handleResetPassword = () => {
    router.push("/forgot-password");
  }

  const handleSelectTestUser = () => {
    const selectedUser = usersTest?.find((u) => u.id === selectedTestUserId);
    if (!selectedUser) return;

    form.setValue("email", selectedUser.email);
    form.setValue("password", TEST_USERS_PASSWORD);
    form.handleSubmit(handleLogin)();
    setTestUserModalOpen(false);
  };

  return (
    <div
        className="w-full max-w-md rounded-2xl p-8 border border-white/10 shadow-2xl glow-red"
        style={{
          backgroundColor: "hsl(220 20% 7% / 0.35)",
          backdropFilter: "blur(16px) saturate(140%)",
          WebkitBackdropFilter: "blur(16px) saturate(140%)",
        }}
      >
      <Form {...form}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary glow-red flex items-center justify-center mb-4">
            <div className="w-5 h-5 rounded-full bg-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-widest text-glow text-foreground">
            POKÉDEX
          </h1>
          <p className="text-muted-foreground text-center mt-2 font-body">
            Bem-vindo, treinador! Faça login para continuar sua jornada.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(handleLogin)} className="w-full max-w-sm space-y-6 ">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Entre com seu email"
                  />
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
                  <input
                    {...field}
                    type="password"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Entre com sua senha"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={cn(
              "relative w-full  px-4 py-2 text-white focus:outline-none font-display focus:ring-2 focus:ring-accent transition-colors duration-500",
              [
                "bg-sidebar-accent text-sidebar-foreground shadow-lg shadow-primary/20",
                "border border-primary/30 font-semibold",
                "hover:cursor-pointer",
                "hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20",
              ],
            )}
          >
            Login
          </Button>
          {/* <button
            onClick={handleResetPassword}
            className="mt-4 text-sm text-blue-500 hover:underline hover:cursor-pointer"
          >
            Esqueceu a senha?
          </button> */}
          <Button
          type="button"
          onClick={() => setTestUserModalOpen(true)}
          className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-display tracking-wider glow-red-strong animate-float"
          size="lg"
        >
          Entrar com usuário TESTE
        </Button>
        </form>
      </Form>

      <Dialog open={testUserModalOpen} onOpenChange={setTestUserModalOpen}>
        <DialogContent className="bg-card border-border/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Escolha um usuário de teste</DialogTitle>
            <DialogDescription className="text-[16px] text-white">Selecione um treinador para entrar automaticamente. <b>NENHUM</b> treinador de teste consegue editar os dados!</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-2">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-2">
              {usersTest?.map((testUser) => {
                const trainer = TRAINERS.find((t) => t.id === testUser.avatar) ?? TRAINERS[0];
                const active = testUser.id === selectedTestUserId;
                return (
                  <button
                    key={testUser.id}
                    type="button"
                    onClick={() => setSelectedTestUserId(testUser.id)}
                    className={cn(
                      "rounded-xl border-2 p-2 flex flex-col items-center gap-1 transition-all hover:scale-105",
                      active
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                        : "border-border/40 bg-background/40",
                    )}
                  >
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={trainer.url} alt={trainer.name} className="object-contain" />
                      <AvatarFallback className="font-display">{testUser.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-display text-xs tracking-wide truncate w-full text-center">
                      {testUser.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setTestUserModalOpen(false)}>
              Fechar
            </Button>
            <Button type="button" disabled={!selectedTestUserId} onClick={handleSelectTestUser}>
              Escolher usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LoginComponentPage;