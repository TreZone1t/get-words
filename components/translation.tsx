'use client';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Languages, ArrowLeftRight } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { fetchTranslation } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

const formSchema = z.object({
  sourceText: z.string().min(1, "Source text is required"),
});

export default function Translator() {
  const [translation, setTranslation] = useState('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceText: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await fetchTranslation(values.sourceText);
    setTranslation(response.translation);
  };

  return (
    <Card className="mx-auto max-w-3xl">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="sourceText"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">Source Text</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter text to translate" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ArrowLeftRight className="text-muted-foreground" />
              <Textarea 
                placeholder="Translation will appear here" 
                className="flex-1 min-h-[100px]" 
                readOnly 
                value={translation} 
              />
            </div>
            <Button type="submit" className="w-full">
              <Languages className="mr-2 h-4 w-4" />
              Translate
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}