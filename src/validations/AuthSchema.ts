import * as yup from "yup";

export const authSchema = yup.object().shape({
  email: yup.string().required("Email é obrigatório.").email("Email inválido"),
  password: yup
    .string()
    .required("Senha é obrigatório.")
    .min(6, "A senha deve conter no mínimo 6 caracteres"),
});
