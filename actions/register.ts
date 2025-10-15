"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import prismaAuthenticate from "@/lib/db/authenticate_db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // register action
  // How to use: call this server action from the registration form with the
  // user's name, email and password. It validates input, checks for duplicates,
  // generates a verification token, sends the verification email and then
  // creates the user record only after the email is accepted for delivery.

  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  if (!prismaAuthenticate) {
    return { error: "Something wrong with our database :(" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use" };
  }

  // Generate a one-time verification token which will be emailed to the user.
  // Keep token generation and email-sending before persisting the user to avoid
  // creating accounts when email delivery fails (better for data hygiene).
  const verificationToken = await generateVerificationToken(email);

  try {
    // If sending the email fails, we surface an error and do NOT create the user.
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
  } catch (err) {
    console.error(
      "Failed to send verification email during registration:",
      err
    );
    return {
      error: "Failed to send verification email. Please try again later.",
    };
  }

  // Now that the verification email was accepted for delivery, persist the user.
  await prismaAuthenticate?.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { success: "User created successfully! Confirmation email sent!" };
};
