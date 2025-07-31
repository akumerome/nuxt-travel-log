import { schema } from "~/shared/utils/validators/signup";
import { User } from "~/server/models/User";

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

    const { username, email, password } = result.data;

    const doesUserExist = await User.findOne({ email: email });

    if (doesUserExist) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "Email address already exists.",
      }));
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

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
      statusMessage: "User signed up successfully.",
    };

  } catch (error) {

    return sendError(event, createError({
      statusCode: 500,
      statusMessage: "An error occurred while signing up the user.",
    }));

  }
});
