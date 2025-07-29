import { z } from "zod";

const NAME_MAX = 100;
const DESCRIPTION_MAX = 1000;
const LAT_MAX = 90;
const LONG_MAX = 180;

export const schema = z.object({
    name: z
        .string({
            required_error: "Name is required.",
            invalid_type_error: "Name must be a string.",
        })
        .min(1, "Name is required.")
        .max(NAME_MAX, `Name must contain at most ${NAME_MAX} characters.`),
    description: z
        .string()
        .max(
            DESCRIPTION_MAX,
            `Name must contain at most ${DESCRIPTION_MAX} characters.`
        )
        .optional(),
    lat: z
        .number({
            required_error: "Latitude is required.",
            invalid_type_error: "Latitude must be a number.",
        })
        .min(-LAT_MAX, `Latitude must be greater than or equal to -${LAT_MAX}`)
        .max(LAT_MAX, `Latitude must be less than or equal to ${LAT_MAX}`),
    long: z
        .number({
            required_error: "Longitude is required.",
            invalid_type_error: "Longitude must be a number.",
        })
        .min(-LONG_MAX, `Longitude must be greater than or equal to -${LONG_MAX}`)
        .max(LONG_MAX, `Longitude must be less than or equal to ${LONG_MAX}`),
});

export type Schema = z.output<typeof schema>;