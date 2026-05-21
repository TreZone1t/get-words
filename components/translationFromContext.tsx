'use client';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Languages, ArrowRightLeft, Sparkles, BookOpen } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: '',
      sentence: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetchTranslationWordInContext(values);
      setTranslation(response.translation.join(', '));
      setFullSentence(response.fullSentence);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl relative group mt-10">
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl blur opacity-20 transition duration-1000 group-hover:opacity-40"></div>
      <Card className="relative glass-card border-0 rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"></div>
        <CardContent className="p-8 md:p-12">
          
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Contextual Translator
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <FormField
                control={form.control}
                name="sentence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground font-medium uppercase tracking-wider text-xs ml-1">Context Sentence</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the full sentence here for context..." 
                        className="min-h-[120px] resize-none bg-background/50 border-white/10 focus-visible:ring-emerald-500/50 text-lg p-6 rounded-xl transition-all shadow-inner" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col md:flex-row items-stretch gap-6 bg-background/30 p-6 rounded-xl border border-white/5">
                <FormField
                  control={form.control}
                  name="word"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-muted-foreground font-medium uppercase tracking-wider text-xs ml-1">Target Word</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Word to translate" 
                          className="bg-background/50 border-white/10 focus-visible:ring-emerald-500/50 text-lg py-6 rounded-xl transition-all shadow-inner" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-center py-4 md:py-0 mt-4 md:mt-6">
                  <div className="p-4 rounded-full bg-white/5 border border-white/10 text-muted-foreground hidden md:block shadow-lg">
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <label className="text-muted-foreground font-medium uppercase tracking-wider text-xs ml-1 block">Word Translation</label>
                  <Input 
                    placeholder={isLoading ? "Translating..." : "Translation"} 
                    className={`border-white/10 text-lg py-6 rounded-xl transition-all shadow-inner text-center font-bold ${isLoading ? 'bg-emerald-500/5 animate-pulse' : 'bg-background/50'}`} 
                    readOnly 
                    dir="rtl"
                    value={translation} 
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                size="lg"
                disabled={isLoading}
                className="w-full md:w-auto md:min-w-[250px] md:mx-auto md:block px-8 py-6 rounded-xl font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 bg-emerald-600 hover:bg-emerald-500 text-white mt-8"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" /> Translating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" /> Translate in Context
                  </span>
                )}
              </Button>
            </form>
          </Form>

          {fullSentence && !isLoading && (
            <div className="mt-8 p-6 glass border border-emerald-500/20 rounded-xl relative overflow-hidden group/result">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
              <div className="relative">
                <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4" /> Full Translation
                </p>
                <p className="text-xl md:text-2xl font-medium leading-relaxed" dir="rtl">{fullSentence}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}