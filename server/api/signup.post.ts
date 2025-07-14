import { schema } from "~/shared/utils/validators/signup";
import { formatBodyValidationErrors } from "../utils/body-validation-error-formatter";
import { User } from "../models/User";

export default defineEventHandler(async (event) => {
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

  const existing = await User.findOne({ email: email });

  if (existing) {
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
});
