import { Location } from "../../models/Location";

export default defineEventHandler(async (event) => {
    try {

        // Makes sure the user is logged in
        // This will throw a 401 error if the request doesn't come from a valid user session
        const { user } = await requireUserSession(event);

        const slug = getRouterParam(event, "slug") as string;
        const location = await Location.deleteOne({ slug, user: user._id });

        if (!location.deletedCount) {
            return sendError(event, createError({
                statusCode: 404,
                statusMessage: "Location not found.",
            }));
        }

        return {
            statusCode: 204,
            statusMessage: "Location deleted successfully.",
            data: {
                location
            },
        };

    } catch (error) {
        console.error(error);
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: "An error occurred while deleting the location.",
        }));

    }
});