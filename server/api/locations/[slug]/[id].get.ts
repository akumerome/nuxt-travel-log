import { LocationLog } from "~/server/models/LocationLog";
import { LocationLogImage } from "~/server/models/LocationLogImage";

export default defineEventHandler(async (event) => {
    try {

        // Makes sure the user is logged in
        // This will throw a 401 error if the request doesn't come from a valid user session
        const { user } = await requireUserSession(event);

        const _id = getRouterParam(event, "id") as string;
        const locationLog = await LocationLog.findOne({ _id, user: user._id }).lean();

        if (!locationLog) {
            return sendError(event, createError({
                statusCode: 404,
                statusMessage: "Location log not found.",
            }));
        }

        const locationLogImages = await LocationLogImage.find({ location_log: locationLog._id }).sort({ created_at: -1 }).lean();
        locationLog.location_log_images = locationLogImages;

        return {
            statusCode: 200,
            statusMessage: "Location log retrieved successfully.",
            data: {
                location_log: locationLog
            },
        };

    } catch (error) {
        console.error(error);
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: "An error occurred while retrieving the location log.",
        }));
    }
});