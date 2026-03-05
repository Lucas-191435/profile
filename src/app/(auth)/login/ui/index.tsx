"use client";

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
const LoginComponentPage = () => {

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
    return (
        <div className="flex min-h-screen items-center justify-center font-sans bg-background">
            <Form {...form}>
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
                                        placeholder="Enter your email"
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
                                <FormLabel className="text-foreground">Password</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        type="password"
                                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <button
                        type="submit"
                        className={cn(
                            "relative w-full rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-500",
                            [
                                "bg-sidebar-accent text-sidebar-foreground shadow-lg shadow-primary/20",
                                "border border-primary/30 font-semibold",
                                "hover:cursor-pointer",
                                "hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20",
                            ],
                        )}
                    >
                        Login
                    </button>
                    <button
                        onClick={handleResetPassword}
                        className="mt-4 text-sm text-blue-500 hover:underline hover:cursor-pointer"
                    >
                        Esqueceu a senha?
                    </button>
                </form>
            </Form>

        </div>
    )
}

export default LoginComponentPage;