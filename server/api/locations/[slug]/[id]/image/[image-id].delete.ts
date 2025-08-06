import { LocationLogImage } from "~/server/models/LocationLogImage";
import createS3Client from "~/utils/create-s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import env from "~/lib/env";

export default defineEventHandler(async (event) => {
    try {

        // Makes sure the user is logged in
        // This will throw a 401 error if the request doesn't come from a valid user session
        const { user } = await requireUserSession(event);

        const slug = getRouterParam(event, "slug") as string;
        const _id = getRouterParam(event, "id") as string;
        const locationLogImageId = getRouterParam(event, "image-id") as string;

        await event.$fetch(`/api/locations/${slug}/${_id}`);

        const locationLogImage = await LocationLogImage.findOneAndDelete({ _id: locationLogImageId, user: user._id });

        if (!locationLogImage) {
            return sendError(event, createError({
                statusCode: 404,
                statusMessage: "Location log image not found.",
            }));
        }

        const client = createS3Client();
        const command = new DeleteObjectCommand({
            Bucket: env.S3_BUCKET,
            Key: locationLogImage.key,
        });

        await client.send(command);

        return {
            statusCode: 204,
            statusMessage: "Location log image deleted successfully.",
            data: {
                locationLogImage
            },
        };
    } catch (error) {
        console.error(error);
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: "An error occurred while deleting the location log image.",
        }));
    }
});