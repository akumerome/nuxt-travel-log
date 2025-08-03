import { schema } from "~/shared/utils/validators/location-logs";
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

        const _id = getRouterParam(event, "id") as string;
        const locationLog = await LocationLog.findOne({ _id, user: user._id });

        if (!locationLog) {
            return sendError(event, createError({
                statusCode: 404,
                statusMessage: "Location log not found.",
            }));
        }

        locationLog.name = result.data.name;
        locationLog.description = result.data.description;
        locationLog.started_at = result.data.started_at;
        locationLog.ended_at = result.data.ended_at;
        locationLog.lat = result.data.lat;
        locationLog.long = result.data.long;
        await locationLog.save();

        return {
            statusCode: 200,
            statusMessage: "Location log edited successfully.",
            data: {
                location_log: locationLog
            },
        };

    } catch (error) {
        console.error(error);
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: "An error occurred while editing the location log.",
        }));
    }
});