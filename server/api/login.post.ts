import { schema } from "~/shared/utils/validators/login";
import { formatBodyValidationErrors } from "../utils/body-validation-error-formatter";
import { User } from "../models/User";

export default defineEventHandler(async (event) => {
  try {

    const result = await readValidatedBody(event, schema.safeParse);

    if (!result.success) {

      const data = formatBodyValidationErrors(result);

      return sendError(event, createError({
        statusCode: 422,
        statusMessage: "Invalid submitted data.",
        data,
      }));
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email: email });

    if (!user) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "Email or password is incorrect.",
      }));
    }

    const isAuthenticated = await verifyPassword(user.password, password);

    if (!isAuthenticated) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "Email or password is incorrect.",
      }));
    }

    // Set the user session in the cookie
    await setUserSession(event, {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });

    return {
      statusCode: 200,
      statusMessage: "User logged in successfully.",
    };
  } catch (error) {

    return sendError(event, createError({
      statusCode: 500,
      statusMessage: "An error occurred while logging in the user.",
    }));

  }
});
