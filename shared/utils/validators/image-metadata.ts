import { z } from "zod";
import { MAX_IMAGE_SIZE } from "~/lib/constants";

export const schema = z.object({
    content_length: z
        .number({
            required_error: "Content length is required.",
            invalid_type_error: "Content length must be a number.",
        })
        .min(1, "Content length must be greater than or equal to 1.")
        .max(MAX_IMAGE_SIZE, `Content length must be less than or equal to ${MAX_IMAGE_SIZE}.`),
    checksum: z
        .string({
            required_error: "Checksum is required.",
            invalid_type_error: "Checksum must be a string.",
        })
        .min(1, "Checksum is required.")
});

export type Schema = z.output<typeof schema>;