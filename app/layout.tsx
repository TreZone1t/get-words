import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavMenu from "@/components/navMenu";
import { Earth , BookA } from 'lucide-react';
import { Providers } from "./providers";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "getworda",
  description: "search for words and their definitions and translations",
};
const menu = [ { title: "Search", href: "/search" }, { title: "translation", href: "/translation" }, { title: "translation from context", href: "/translation/context" }];
const title = () => (
  <p className="font-bold flex items-center text-center text-2xl ">get W<Earth className="h-3 w-3" />rds  <BookA className="h-5 w-5" /></p>
);
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark m-2 items-center justify-center`}
      >
        <Providers>
          <NavMenu menu={menu} title={title()} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
