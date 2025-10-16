"use server";

import { signOut } from "@/auth";

// logout action
// How to use: call this server action to sign out the current session.
// Returns void on success; errors are caught and logged.
export const logout = async () => {
  try {
    await signOut();
  } catch (err) {
    console.error("logout action failed:", err);
    throw err;
  }
};
