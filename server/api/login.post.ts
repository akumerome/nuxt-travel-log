import { z } from "zod";
import { User } from "../models/User";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse);

  const user = await User.findOne({ email: email });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Email or password is incorrect.",
    });
  }

  const isAuthenticated = await verifyPassword(user.password, password);

  if (!isAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: "Email or password is incorrect.",
    });
  }

  // set the user session in the cookie
  await setUserSession(event, {
    user: {
      username: user.username,
    },
  });

  return {
    statusMessage: "User logged in successfully.",
    user: { name: user.name, email: user.email },
  };
});
