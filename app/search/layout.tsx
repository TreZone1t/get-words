import type { Metadata } from "next";
import "../globals.css";
import Searchbar from "@/components/searchbar";

export const metadata: Metadata = {
  title: "Word Search",
  description: "Search for words and their definitions",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Searchbar />
      <main className="mt-8 text-center w-full max-w-4xl">
        {children}
      </main>
    </div>
  );
}
