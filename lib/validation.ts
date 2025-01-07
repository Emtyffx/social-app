import { z } from "zod";

export const loginSchema = z.object({
  name: z
    .string()
    .min(5, "The minimum username length is 5 characters.")
    .max(20, "Maximum username length is 20 characters"),
  password: z
    .string()
    .min(5, "The minimum password length is 5 characters.")
    .max(20, "Maximum password length is 20 characters"),
});

export type loginParams = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
  name: z.string().min(5, "The minimum username length is 5 characters.").max(20, "Maximum username length is 20 characters"),
  email: z.string().email("The email must be valid."),
  password: z.string().min(5, "The minimum password length is 5 characters.").max(20, "Maximum password length is 20 characters"),
})

export type signUpParams = z.infer<typeof signUpSchema>;
