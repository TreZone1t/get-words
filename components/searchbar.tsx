'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export default function Searchbar() {
  const router = useRouter();
  const [word, setWord] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (word.trim()) {
      router.push(`/search/${encodeURIComponent(word.trim())}`);
    }
  };

  return (
    <Card className="mx-auto mb-8 w-3/4">
      <CardContent className="pt-6">
        <form className="flex items-center gap-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Enter a word"
            className="flex-1 w-3/4"
            aria-label="Word input"
            required
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <Button 
            type="submit" 
            aria-label="Search button" 
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <Search />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}