import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import "./globals.css";
import Providers from "@/components/Provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CHAT With PDF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Providers>
      <html lang="en" style={{ height: "100vh"}}>
        <body className={inter.className} style={{ height: "100vh"}}>
    
          {children}
      <Toaster />
        </body>
      </html>
      </Providers>
    </ClerkProvider>
  );
}