"use server";

import { signOut } from "@/auth";

// logout action
// How to use: call this server action to sign out the current session.
// Returns void on success; errors are caught and logged.
export const logout = async () => {
  try {
    await signOut({ redirectTo: "/auth/login" });
  } catch (err) {
    // If signOut triggers Next's redirect sentinel (NEXT_REDIRECT), rethrow it
    // so the framework can perform the redirect. Swallowing it prevents the
    // redirect and leaves the user on the protected page.
    const anyErr = err as any;
    const message = anyErr?.message;
    const digest = anyErr?.digest;
    if (
      (typeof message === "string" && message.includes("NEXT_REDIRECT")) ||
      (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT"))
    ) {
      throw err; // allow Next to handle redirect
    }
    console.error("logout action failed:", err);
    // Surface a friendly error shape for callers if needed
    return { error: "Failed to sign out" };
  }
};
