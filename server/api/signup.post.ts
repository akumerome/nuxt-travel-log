import { z } from "zod";
import { User } from "../models/User";

const bodySchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const { username, email, password } = await readValidatedBody(
    event,
    bodySchema.parse
  );

  const existing = await User.findOne({ email: email });

  if (existing) {
    throw createError({
      statusCode: 401,
      statusMessage: "Email address already exists.",
    });
  }

  const hashedPassword = await hashPassword(password);
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });
  await user.save();

  // set the user session in the cookie
  await setUserSession(event, {
    user: {
      username: user.username,
    },
  });

  return {
    statusMessage: "User signed up successfully.",
    user,
  };
});
