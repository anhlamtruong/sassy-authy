"use server";

import prismaAuthenticate from "@/lib/db/authenticate_db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  // newVerification action
  // How to use: Call this action from the verification page with the token
  // provided in the verification email. It validates the token, marks the
  // user's email as verified, and deletes the token.
  try {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      return { error: "Token does not exist!" };
    }
    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: "Token has expired" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: "Email does not exist!" };
    }

    await prismaAuthenticate.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingUser.email,
      },
    });
    await prismaAuthenticate.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return { success: "Email Verified" };
  } catch (err) {
    console.error("newVerification action failed:", err);
    return { error: "Internal error" };
  }
};
