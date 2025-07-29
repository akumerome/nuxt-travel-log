import type { ILocation, ILocationLog } from "~/types/types";
import { Location } from "../../models/Location";
import { LocationLog } from "../../models/LocationLog";
export default defineEventHandler(async (event) => {
    try {

        await new Promise(resolve => setTimeout(resolve, 5000));
        // Makes sure the user is logged in
        // This will throw a 401 error if the request doesn't come from a valid user session
        const { user } = await requireUserSession(event);

        const slug = getRouterParam(event, "slug") as string;
        const location = await Location.findOne({ slug, user: user._id }).populate("location_logs").lean() as ILocation;

        if (!location) {
            return sendError(event, createError({
                statusCode: 404,
                statusMessage: "Location not found.",
            }));
        }

        const location_logs = await LocationLog.find({ location: location._id }).lean() as ILocationLog[];
        location.location_logs = location_logs;

        return {
            statusCode: 200,
            statusMessage: "Location retrieved successfully.",
            data: {
                location
            },
        };

    } catch (error) {
        console.error(error);
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: "An error occurred while retrieving location.",
        }));

    }
});