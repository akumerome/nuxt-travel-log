import { z } from "zod";
import { User } from "../models/User";

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const { name, email, password } = await readValidatedBody(
    event,
    bodySchema.parse
  );

  const existing = await User.findOne({ email: email });

  if (existing) {
    throw createError({
      statusCode: 401,
      message: "Email address already exists.",
    });
  }

  const hashedPassword = await hashPassword(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  await user.save();

  return {
    message: "User registered successfully.",
    user,
  };
});
