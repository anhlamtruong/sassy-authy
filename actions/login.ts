"use server";

import * as z from "zod";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two_factor_token";
import { getTwoFactorConfirmationByUserId } from "@/data/two_factor_confirmation";
import prismaAuthenticate from "@/lib/db/authenticate_db";

/*
actions/login.ts
Handler for server-side login flow used by the app.
Responsibilities:
- Validate incoming login form fields
- Check user existence and email verification status
- If email not verified: generate a verification token and send verification email
- Handle two-factor authentication (2FA) flow: generate/send token or verify submitted code
- Perform actual sign-in using the credentials provider
- Return structured results for the calling UI to show messages or trigger 2FA UI
*/
// How to use: call this server action from the login form. Provide the form
// values and an optional callbackUrl to redirect after successful sign-in. The
// action validates input, enforces email verification and 2FA flows, and uses
// the credentials provider to sign the user in.
export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string
) => {
  try {
    // Validate request payload against schema
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    // Extract validated fields
    const { email, password, code } = validatedFields.data;
    // Load user from the application database (authenticate DB)
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: "Email does not exist!" };
    }
    // If the user's email hasn't been verified yet, generate a token and
    // send the verification email. We return immediately so the UI can inform the user
    // to check their inbox; the actual sign-in is not performed until verification.
    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        existingUser.email
      );
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );
      return { success: "Confirmation email sent !" };
    }
    // Two-factor authentication (2FA) handling
    // If 2FA is enabled for the user, the flow has two branches:
    // - If a `code` was submitted: verify it, mark confirmation in DB and continue
    // - If no `code` was submitted: generate a new token, email it, and signal client to show 2FA UI
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (code) {
        // Verify the submitted 2FA code
        const twoFactorToken = await getTwoFactorTokenByEmail(
          existingUser.email
        );

        if (!twoFactorToken) {
          return { error: "Invalid Code!" };
        }
        if (twoFactorToken.token !== code) {
          return { error: "Not the right code ╰（‵□′）╯" };
        }
        const hasExpired = new Date(twoFactorToken.expires) < new Date();
        if (hasExpired) {
          return { error: "Code Expired (っ °Д °;)っ" };
        }

        // Remove used token and create a confirmation record so subsequent requests know 2FA passed
        await prismaAuthenticate.twoFactorToken.delete({
          where: { id: twoFactorToken.id },
        });
        const existingConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        if (existingConfirmation) {
          await prismaAuthenticate.twoFactorConfirmation.delete({
            where: { id: existingConfirmation.id },
          });
        }
        await prismaAuthenticate.twoFactorConfirmation.create({
          data: { userId: existingUser.id },
        });
      } else {
        // Generate and send a new 2FA token, then tell the client to present the 2FA prompt
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(
          twoFactorToken.email,
          twoFactorToken.token
        );
        return { twoFactor: true };
      }
    }

    // Attempt to sign the user in using the credentials provider. The signIn helper
    // abstracts the session creation/redirect logic. We map AuthError cases to
    // user-friendly error messages for the UI.
    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: " Invalid credentials !" };
          default: {
            return { error: "Something went wrong :(" };
          }
        }
      }
      throw error;
    }

    // NOTE: generateVerificationToken is kept here (was in original code) but
    // depending on desired behavior it may be unnecessary after successful sign-in.
    await generateVerificationToken(email);

    return { success: "Email sent !" };
  } catch (err) {
    if (isNextRedirectError(err)) {
      throw err; // Important: let Next handle redirects
    }
    console.error("login action failed:", err);
    return { error: "Internal error" };
  }
};
function isNextRedirectError(err: unknown) {
  const anyErr = err as any;
  const message = anyErr?.message;
  const digest = anyErr?.digest;
  return (
    (typeof message === "string" && message.includes("NEXT_REDIRECT")) ||
    (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT"))
  );
}
