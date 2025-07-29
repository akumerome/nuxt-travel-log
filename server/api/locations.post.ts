import { schema } from "~/shared/utils/validators/locations";
import { formatBodyValidationErrors } from "../utils/body-validation-error-formatter";
import slugify from "~/shared/utils/helpers/slugify";
import { Location } from "../models/Location";
import { ILocation } from "~/types/types";

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

    const slug = slugify(result.data.name);

    const doesLocationExist = await Location.findOne({ slug, user: user._id }).lean();
    if (doesLocationExist) {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: "A location with this name already exists.",
      }));
    }

    const created = new Location({
      ...result.data,
      slug,
      user: user._id,
    });
    await created.save();

    return {
      statusCode: 201,
      statusMessage: "Location added successfully.",
    };

  } catch (error) {

    return sendError(event, createError({
      statusCode: 500,
      statusMessage: "An error occurred while adding the location.",
    }));

  }
});
