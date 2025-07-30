import { schema } from "~/shared/utils/validators/locations";
import type { ILocation, ILocationLog } from "~/types/types";
import { Location, LocationDocument } from "../../models/Location";
import { LocationLog } from "../../models/LocationLog";
import slugify from "~/shared/utils/helpers/slugify";

export default defineEventHandler(async (event) => {
    try {

        // Makes sure the user is logged in
        // This will throw a 401 error if the request doesn't come from a valid user session
        const { user } = await requireUserSession(event);

        const result = await readValidatedBody(event, schema.safeParse);

        if (!result.success) {
            const data = formatBodyValidationErrors(result);

            return sendError(event, createError({
                statusCode: 422,
                statusMessage: "Invalid submitted data.",
                data,
            }));
        }

        const oldSlug = getRouterParam(event, "slug") as string;
        const location = await Location.findOne({ slug: oldSlug, user: user._id }) as LocationDocument;

        if (!location) {
            return sendError(event, createError({
                statusCode: 404,
                statusMessage: "Location not found.",
            }));
        }

        const newSlug = slugify(result.data.name);

        if (newSlug !== oldSlug) {
            const doesLocationExist = await Location.findOne({ slug: newSlug, user: user._id }).lean() as ILocation;
            if (doesLocationExist) {
                return sendError(event, createError({
                    statusCode: 409,
                    statusMessage: "A location with this name already exists.",
                }));
            }
        }

        location.name = result.data.name;
        location.slug = newSlug;
        location.description = result.data.description;
        location.lat = result.data.lat;
        location.long = result.data.long;
        await location.save();

        return {
            statusCode: 200,
            statusMessage: "Location edited successfully.",
            data: {
                location
            },
        };

    } catch (error) {
        console.error(error);
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: "An error occurred while editing the location.",
        }));

    }
});