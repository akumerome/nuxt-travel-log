import { z } from "zod";
import { DescriptionSchema, LatitudeSchema, LongitudeSchema, NameSchema } from "./generics";

export const schema = z.object({
    name: NameSchema,
    description: DescriptionSchema,
    lat: LatitudeSchema,
    long: LongitudeSchema,
});

export type Schema = z.output<typeof schema>;