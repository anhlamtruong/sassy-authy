import prismaAuthenticate from "@/lib/db/authenticate_db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation =
      await prismaAuthenticate.twoFactorConfirmation.findUnique({
        where: { userId },
      });
    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};
