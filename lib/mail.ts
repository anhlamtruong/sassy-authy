import EmailResetPasswordTemplate from "../components/email/reset_password_email";
import { EmailConfirmTemplate } from "../components/email/sign_in_confirm_email";
import EmailTwoFactorTemplate from "../components/email/two_factor_email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;
const emailFrom = process.env.RESEND_EMAIL_ID ?? "anhlamtruong1012@resend.dev";
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  try {
    console.log("Sending Two Factor email");
    await resend.emails.send({
      from: emailFrom,
      to: [email],
      subject: "2FA Code",
      react: EmailTwoFactorTemplate({ token }) as React.ReactElement,
    });
  } catch (err) {
    console.error("Failed to send two-factor email:", err);
    throw err;
  }
};
export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    console.log("Sending verification email");
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;
    await resend.emails.send({
      from: emailFrom,
      to: [email],
      subject: "Confirm your email",
      react: EmailConfirmTemplate({ confirmLink }) as React.ReactElement,
    });
  } catch (err) {
    console.error("Failed to send verification email:", err);
    throw err;
  }
};
export const sendResetPasswordEmail = async (email: string, token: string) => {
  try {
    console.log("Sending reset password email");
    const resetLink = `${domain}/auth/new-password?token=${token}`;
    await resend.emails.send({
      from: emailFrom,
      to: [email],
      subject: "Reset your password email.",
      react: EmailResetPasswordTemplate({
        resetPasswordLink: resetLink,
      }) as React.ReactElement,
    });
  } catch (err) {
    console.error("Failed to send reset password email:", err);
    throw err;
  }
};
