"use server";

import { UserRole } from "@/generated/@prisma-client-authenticate";
import { currentRole } from "@/lib/auth";

// admin action
// How to use: call this server action from protected admin UI to verify that the
// current session role is ADMIN. Returns { success } when allowed or { error }
// when forbidden.
export const admin = async () => {
  try {
    const role = await currentRole();

    if (role === UserRole.ADMIN) {
      return { success: "Allowed Server Action!" };
    }

    return { error: "Forbidden Server Action!" };
  } catch (err) {
    console.error("admin action failed:", err);
    return { error: "Internal error" };
  }
};
