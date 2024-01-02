import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prismaAuthenticate from "@/lib/db/authenticate_db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prismaAuthenticate),
  session: { strategy: "jwt" },
  ...authConfig,
});
