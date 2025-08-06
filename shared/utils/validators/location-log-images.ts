import { z } from "zod";

export const schema = z.object({
    key: z
        .string({
            required_error: "Key is required.",
            invalid_type_error: "Key must be a string."
        })
        .regex(/^[a-f\d]{24}\/[a-f\d]{24}\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.jpg$/, "Key format is invalid.")
});

export type Schema = z.output<typeof schema>;