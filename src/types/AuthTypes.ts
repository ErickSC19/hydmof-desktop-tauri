import { z } from 'zod';

type Admin = {
  admin_id: string;
  username: string;
  email: string;
  password?: string;
  token?: string;
  confirmed?: boolean;
};

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

  type changePassword = {
    password: string;
    repassword: string;
  };
  const changePasswordSchema = z.object({
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

export type { LoginForm, RegisterForm, Admin };

export { loginSchema, registerSchema, changePasswordSchema };
