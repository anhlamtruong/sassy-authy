import prismaAuthenticate from "@/lib/db/authenticate_db";

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await prismaAuthenticate.account.findFirst({
      where: { userId },
    });

    return account;
  } catch {
    return null;
  }
};
