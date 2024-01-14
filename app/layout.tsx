import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SASSY AUTHY",
  description: "Very Sexy Authentication Application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </ThemeProvider>
    </SessionProvider>
  );
}
