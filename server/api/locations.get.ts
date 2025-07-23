import { Location } from "../models/Location";

export default defineEventHandler(async (event) => {
    try {

        // Makes sure the user is logged in
        // This will throw a 401 error if the request doesn't come from a valid user session
        const { user } = await requireUserSession(event);

        const locations = await Location.find({ user: user._id }).lean();

        return {
            statusCode: 200,
            statusMessage: "Locations retrieved successfully.",
            data: {
                locations
            },
        };

    } catch (error) {

        return sendError(event, createError({
            statusCode: 500,
            statusMessage: "An error occurred while retrieving locations.",
        }));

    }
});