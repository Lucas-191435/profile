import * as yup from "yup";
import {InferType} from "yup";

export const authSchema = yup.object().shape({
  email: yup.string().required("Email é obrigatório.").email("Email inválido"),
  password: yup
    .string()
    .required("Senha é obrigatório.")
    .min(3, "A senha deve conter no mínimo 6 caracteres"),
});


export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().required("Email é obrigatório.").email("Email inválido"),
});

export const resetPasswordSchema = yup.object().shape({
  token: yup.string().required("Token é obrigatório."),
  password: yup
    .string()
    .required("Senha é obrigatório.")
    .min(3, "A senha deve conter no mínimo 6 caracteres"),
  validatePassword: yup
  .string()
  .oneOf([yup.ref("password"), null as unknown as string], "As senhas devem ser iguais")
  .required("Confirmação de senha é obrigatória"),
});

export type AuthSchemaType = InferType<typeof authSchema>;
export type ForgotPasswordSchemaType = InferType<typeof forgotPasswordSchema>;
export type ResetPasswordSchemaType = InferType<typeof resetPasswordSchema>;
