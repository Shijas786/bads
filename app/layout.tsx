import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import "@farcaster/auth-kit/styles.css";
import { Providers } from "./providers";
import { headers } from "next/headers";
import ContextProvider from "@/app/context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "BADS | Decentralized Advertising",
  description: "Earn $BADS by watching ads. Be the voice of Farcaster.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get('cookie');

  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <ContextProvider cookies={cookies}>
          <Providers>
            {children}
          </Providers>
        </ContextProvider>
      </body>
    </html>
  );
}
