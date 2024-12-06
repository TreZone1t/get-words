'use client';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Languages, ArrowLeftRight } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { fetchTranslationWordInContext } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  word: z.string().min(1, "Word is required"),
  sentence: z.string().min(1, "Sentence is required"),
});

export default function TranslationFromContext() {
  const [translation, setTranslation] = useState('');
  const [fullSentence, setFullSentence] = useState('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: '',
      sentence: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await fetchTranslationWordInContext(values);
    setTranslation(response.translation.join(', '));
    setFullSentence(response.fullSentence);
  };

  return (
    <Card className="mx-auto max-w-3xl">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="word"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Word to Translate</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a word" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ArrowLeftRight className="text-muted-foreground mt-8" />
              <FormItem className="flex-1">
                    <FormLabel>Translation</FormLabel>
                    <FormControl>
                      <Input                
                       placeholder="Translation will appear here" 
                      className="flex-1 min-h-[40px]" 
                      readOnly 
                      value={translation} 
                       />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
            </div>
            <FormField
              control={form.control}
              name="sentence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Context Sentence</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a sentence for context" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <Languages className="mr-2 h-4 w-4" />
              Translate in Context
            </Button>
          </form>
        </Form>
        {fullSentence && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="font-medium mb-2">Translated Sentence:</p>
            <p>{fullSentence}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}