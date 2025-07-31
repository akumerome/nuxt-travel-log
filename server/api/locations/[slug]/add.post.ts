import { schema } from "~/shared/utils/validators/location-logs";
import { Location } from "~/server/models/Location";
import { LocationLog } from "~/server/models/LocationLog";

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

        const slug = getRouterParam(event, "slug") as string;
        const location = await Location.findOne({ slug, user: user._id });

        if (!location) {
            return sendError(event, createError({
                statusCode: 404,
                statusMessage: "Location not found.",
            }));
        }

        const created = new LocationLog({
            ...result.data,
            location: location._id,
            user: user._id,
        });
        await created.save();

        return {
            statusCode: 201,
            statusMessage: "Location log added successfully.",
        };
    } catch (error) {

    }
});
