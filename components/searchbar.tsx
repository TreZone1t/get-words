import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

export default function Searchbar() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const searchTerm = formData.get("search") as string;
    if (searchTerm?.trim()) {
      redirect(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  }

  return (
    <Card className="mx-auto mb-8 w-3/4">
      <CardContent className="pt-6">
        <form className="flex items-center gap-4" action={handleSubmit}>
          <Input
            type="text"
            name="searchTerm"
            placeholder="Enter a word"
            className="flex-1 w-3/4"
            aria-label="Word input"
            required
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