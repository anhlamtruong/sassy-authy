"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma-client-authenticate";

export const admin = async () => {
  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    return { success: "Allowed Server Action!" };
  }

  return { error: "Forbidden Server Action!" };
};
