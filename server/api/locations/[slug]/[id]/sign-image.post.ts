import { schema } from "~/shared/utils/validators/image-metadata";
import createS3Client from "~/utils/create-s3-client";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import env from "~/lib/env";

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

        const fileName = crypto.randomUUID();
        const key = `${user._id}/${id}/${fileName}.jpg`;

        const { url, fields } = await createPresignedPost(client, {
            Bucket: env.S3_BUCKET,
            Key: key,
            Expires: 120,
            Fields: {
                "x-amz-checksum-sha256": result.data.checksum,
            },
            Conditions: [
                ["content-length-range", result.data.content_length, result.data.content_length],
                ["eq", "$x-amz-meta-user-id", user._id.toString()],
                ["eq", "$x-amz-meta-location-log-id", id],
            ],
        });

        fields["x-amz-meta-user-id"] = user._id.toString();
        fields["x-amz-meta-location-log-id"] = id;

        return {
            url,
            fields,
            key,
        };
    } catch (error) {
        console.error(error);
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: "An error occurred while generating the presigned URL.",
        }));
    }
});