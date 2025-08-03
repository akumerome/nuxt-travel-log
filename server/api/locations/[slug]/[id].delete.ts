import { LocationLog } from "~/server/models/LocationLog";

export default defineEventHandler(async (event) => {
    try {

        // Makes sure the user is logged in
        // This will throw a 401 error if the request doesn't come from a valid user session
        const { user } = await requireUserSession(event);

        const _id = getRouterParam(event, "id") as string;
        const locationLog = await LocationLog.deleteOne({ _id, user: user._id });

        if (!locationLog.deletedCount) {
            return sendError(event, createError({
                statusCode: 404,
                statusMessage: "Location log not found.",
            }));
        }

        return {
            statusCode: 204,
            statusMessage: "Location log deleted successfully.",
            data: {
                locationLog
            },
        };

    } catch (error) {
        console.error(error);
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: "An error occurred while deleting the location log.",
        }));
    }
});