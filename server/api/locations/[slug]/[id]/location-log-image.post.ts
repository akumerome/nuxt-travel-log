import { GetObjectCommand } from "@aws-sdk/client-s3";
import env from "~/lib/env";
import { LocationLogImage } from "~/server/models/LocationLogImage";
import { schema } from "~/shared/utils/validators/location-log-images";
import createS3Client from "~/utils/create-s3-client";

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
        const id = getRouterParam(event, "id") as string;
        await event.$fetch(`/api/locations/${slug}/${id}`);

        const client = createS3Client();
        const command = new GetObjectCommand({
            Bucket: env.S3_BUCKET,
            Key: result.data.key,
        });

        const response = await client.send(command);
        const metadata = response.Metadata;

        if (!metadata
            || metadata["location-log-id"] !== id
            || metadata["user-id"] !== user._id.toString()) {
            return sendError(event, createError({
                statusCode: 404,
                statusMessage: "Location log image not found",
            }));
        }

        const created = new LocationLogImage({
            ...result.data,
            location_log: id,
            user: user._id,
        });
        await created.save();

        return {
            statusCode: 201,
            statusMessage: "Location log image added successfully.",
        };

    } catch (error) {

        return sendError(event, createError({
            statusCode: 500,
            statusMessage: "An error occurred while adding the location log image.",
        }));

    }
});