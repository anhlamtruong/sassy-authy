import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SASSY AUTHY",
  description: "Very Sexy Authentication Application",
  icons: {
    icon: "/icon.png", // Or /favicon.ico if you prefer
    shortcut: "/favicon.ico", // For older browsers/OS
    apple: "/apple-touch-icon.png",
  },
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
          <body className={inter.className}>
            <Toaster />
            {children}
          </body>
        </html>
      </ThemeProvider>
    </SessionProvider>
  );
}
