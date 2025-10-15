"use server";
import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendResetPasswordEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
export const reset = async (values: z.infer<typeof ResetSchema>) => {
  // reset action
  // How to use: call from the 'forgot password' form with a user's email. This
  // action validates the email, generates a password reset token, sends the
  // reset email, and returns a success message.
  try {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid Emails" };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return { error: "Email not found!" };
    }
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendResetPasswordEmail(
      passwordResetToken.email,
      passwordResetToken.token
    );

    return { success: "Reset Password sent to your email" };
  } catch (err) {
    console.error("reset action failed:", err);
    return { error: "Internal error" };
  }
};
