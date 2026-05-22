import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

export default function Searchbar() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const searchTerm = formData.get("searchTerm") as string;
    if (searchTerm?.trim()) {
      redirect(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  }

  return (
    <div className="mx-auto mb-10 w-full max-w-2xl relative group">
      <Card className="relative glass-card border-0 rounded-xl">
        <CardContent className="p-4">
          <form className="flex flex-col sm:flex-row items-center gap-4" action={handleSubmit}>
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <Input
                type="text"
                name="searchTerm"
                placeholder="Type a word to explore..."
                className="w-full bg-background/50 border-white/10 pl-10 pr-4 py-4 sm:py-6 text-base sm:text-lg rounded-lg focus-visible:ring-primary/50 transition-all shadow-inner placeholder:text-muted-foreground/70"
                aria-label="Word input"
                required
              />
            </div>
            <Button 
              type="submit" 
              size="lg"
              aria-label="Search button" 
              className="w-full sm:w-auto px-8 py-4 sm:py-6 rounded-lg font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] active:scale-95 bg-primary text-primary-foreground"
            >
              Explore
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}