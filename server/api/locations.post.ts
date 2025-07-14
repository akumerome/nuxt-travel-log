import { schema } from "~/shared/utils/validators/locations";
import { formatBodyValidationErrors } from "../utils/body-validation-error-formatter";
import slugify from "~/shared/utils/helpers/slugify";
import { Location } from "../models/Location";

export default defineEventHandler(async (event) => {
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

  try {
    const created = new Location({
      ...result.data,
      slug: slugify(result.data.name),
      user: user._id,
    });
    await created.save();

    return {
      statusCode: 200,
      statusMessage: "Location added successfully.",
    };

  } catch (error) {

    return sendError(event, createError({
      statusCode: 500,
      statusMessage: "Error adding location.",
    }));

  }
});
