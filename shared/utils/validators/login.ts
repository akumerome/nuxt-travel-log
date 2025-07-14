import { z } from "zod";

export const schema = z.object({
    email: z
        .string({
            required_error: "Email is required.",
        })
        .email("Email must be a valid email address."),
    password: z.string({
        required_error: "Password is required.",
    }),
});

export type Schema = z.output<typeof schema>;