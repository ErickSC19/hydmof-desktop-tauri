import { z } from 'zod';

type LoginForm = {
  email: string;
  password: string;
};
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Escribe tu correo.')
    .email('Escribe un correo valido.'),
  password: z
    .string()
    .min(1, 'Escribe tu contraseña.')
    .min(8, 'You password must have 8 characters or more.')
});

type RegisterForm = {
  email: string;
  username: string;
  password: string;
  repassword: string;
};
const registerSchema = z.object({
  username: z
  .string()
  .min(1, 'Escribe tu nombre de usuario.'),
  email: z
    .string()
    .min(1, 'Escribe tu correo.')
    .email('Escribe un correo valido.'),
  password: z
    .string()
    .min(1, 'Escribe tu contraseña.')
    .min(8, 'Tu contraseña tiene que tener al menos 8 caracteres'),
  repassword: z
    .string()
    .min(1, 'Repite la contraseña.')
}).refine((data) => data.password === data.repassword, {
    message: "Las contraseñas no coinciden",
    path: ["repassword"], 
  });

export type { LoginForm, RegisterForm };

export { loginSchema, registerSchema };
