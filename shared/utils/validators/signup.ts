import { z } from "zod";

export const schema = z
    .object({
        username: z.string({
            required_error: "Username is required.",
        }),
        email: z
            .string({
                required_error: "Email is required.",
            })
            .email("Email must be a valid email address."),
        password: z
            .string({
                required_error: "Password is required.",
            })
            .min(8, "Password must be at least 8 characters.")
            .regex(/^(?=.*[a-z])/, "Password must include at least a lowercase character.")
            .regex(/^(?=.*[A-Z])/, "Password must include at least an uppercase character.")
            .regex(/^(?=.*\d)/, "Password must include at least a number.")
            .regex(/^(?=.*[\W_])/, "Password must include at least a special character."),
        password_confirmation: z.string({
            required_error: "Password confirmation is required.",
        }),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match.",
        path: ["password_confirmation"],
    });

export type Schema = z.output<typeof schema>;