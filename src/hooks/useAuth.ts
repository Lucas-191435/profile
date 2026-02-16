/* eslint-disable camelcase */
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  useRouter,
  usePathname,
} from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { PrivateRoutes, PublicRoutes } from "@/constants/mapperRoutes";
import { useEffect, useState, useCallback, useMemo } from "react";
import { authSchema } from "@/validations/AuthSchema";
import { errorToast, successToast } from "@/utils/toasts";


type Login = {
  email: string;
  password: string;
};

const useAuth = () => {
  const { data, status } = useSession({
    required: false,
    onUnauthenticated: () => {},
  });
  const { replace } = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState<"text" | "password">("password");
  const queryClient = useQueryClient();



  const sessionData = useMemo(
    () => ({
      user: data?.user,
      token: data?.token,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
    }),
    [data?.user, data?.token, status],
  );

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const verifyUserAuth = useCallback(() => {
    if (sessionData.isAuthenticated && sessionData.user?.role) {
      const role = sessionData.user.role;

      // Define rotas permitidas para cada tipo de usuário
      const isInValidRoute =
        (role === "CONSULTANT" &&
          (pathname.startsWith("/consultant") ||
            pathname.startsWith("/client"))) ||
        (role === "CLIENT" && pathname.startsWith("/client"));

      // Redireciona apenas se não estiver em uma rota válida
      if (!isInValidRoute) {
        if (role === "CONSULTANT") {
          replace(PrivateRoutes.consultant.clients);
        } else if (role === "CLIENT") {
          replace(PrivateRoutes.client.dashboard);
        }
      }
    }
  }, [sessionData.isAuthenticated, sessionData.user?.role, pathname, replace]);

  useEffect(() => {
    if (status !== "loading") {
      verifyUserAuth();
    }
  }, [status, verifyUserAuth]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin: SubmitHandler<Login> = async (data) => {
    try {
      const { email, password } = data;
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.status === 401) {
        if (
          result?.error ===
          "Sua conta foi desativada. Entre em contato com o suporte."
        ) {
          errorToast({
            description:
              "Sua conta foi desativada. Entre em contato com o suporte.",
          });
        } else {
          errorToast({ description: "Credenciais inválidas !" });
        }
      } else {
        successToast({ description: "Login efetuado com sucesso !" });
        api.clearSessionCache();
        queryClient.clear();
        verifyUserAuth();

      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    api.clearSessionCache();
    queryClient.clear();


    successToast({ description: "Usuário desconectado!" });
    replace(PublicRoutes.login.defaultPage);
  };

  return {
    errors,
    isSubmitting,
    data: sessionData.user,
    status,
    sessionData,
    visible,
    setVisible,
    logout,
    register,
    handleSubmit,
    handleLogin,
  };
};

export { useAuth };
