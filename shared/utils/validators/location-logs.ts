import { z } from "zod";
import { DescriptionSchema, LatitudeSchema, LongitudeSchema, NameSchema } from "./generics";

export const schema = z.object({
    name: NameSchema,
    description: DescriptionSchema,
    lat: LatitudeSchema,
    long: LongitudeSchema,
    started_at: z
        .number({
            required_error: "Start date is required.",
            invalid_type_error: "Start date must be a timestamp.",
        }).refine(val => !isNaN(new Date(val).getTime()), {
            message: "Start date must be a timestamp.",
        }),
    ended_at: z
        .number({
            required_error: "End date is required.",
            invalid_type_error: "End date must be a timestamp.",
        }).refine(val => !isNaN(new Date(val).getTime()), {
            message: "End date must be a timestamp.",
        }),
}).refine((data) => data.started_at <= data.ended_at, {
    message: "Start date must be less or equal to end date",
    path: ["ended_at"],
});

export type Schema = z.output<typeof schema>;