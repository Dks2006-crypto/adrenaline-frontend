// features/auth/schemas/auth.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  password: z.string().min(6, "Пароль от 6 символов"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Имя от 2 символов")
    .regex(/^[\p{L}\s]+$/u, "Только буквы"),
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  phone: z
    .string()
    .regex(/^[\d\s+()]+$/, "Некорректный формат телефона")
    .min(10, "Введите полный номер"),
  password: z
    .string()
    .min(6, "Пароль от 6 символов")
    .regex(/[A-Z]/, "Хотя бы одна заглавная")
    .regex(/[0-9]/, "Хотя бы одна цифра"),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Пароли не совпадают",
  path: ["password_confirmation"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;