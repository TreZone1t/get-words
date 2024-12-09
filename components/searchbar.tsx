import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormControl } from "./ui/form";
import { useForm as useHookForm } from "react-hook-form";

const formSchema = z.object({
  searchTerm: z.string().min(1, "Please enter a search term"),
});

export default function Searchbar() {
  const router = useRouter();
  const form = useHookForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchTerm: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.searchTerm.trim()) {
      router.push(`/search?search=${encodeURIComponent(values.searchTerm.trim())}`);
    }
  }

  return (
    <Card className="mx-auto mb-8 w-3/4">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="searchTerm"
              render={({ field }) => (
                <FormItem className="flex-1 w-3/4">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter a word"
                      aria-label="Word input"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              aria-label="Search button" 
              className="transition-transform hover:scale-105 active:scale-95"
            >
              <Search />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}