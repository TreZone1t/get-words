import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavMenu from "@/components/navMenu";
import { Earth , BookA } from 'lucide-react';
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "getwords",
  description: "Search for words and their definitions and translations",
};

const menu = [ { title: "Search", href: "/search" }, { title: "Translation", href: "/translation" }, { title: "Context Translation", href: "/translation/context" }];

const title = () => (
  <p className="font-bold flex items-center text-center text-2xl tracking-tight text-white">getW<Earth className="h-5 w-5 mx-0.5 text-blue-400" />rds  <BookA className="h-6 w-6 ml-2 text-emerald-400" /></p>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
            <NavMenu menu={menu} title={title()} />
            <main className="mt-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
