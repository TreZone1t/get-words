'use client';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Languages, ArrowRightLeft, Sparkles } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceText: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetchTranslation(values.sourceText);
      // Join multiple translation options with a clear separator
      setTranslation(response.translation.join('\n\n-- أو --\n\n'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl relative group mt-10">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 transition duration-1000 group-hover:opacity-40"></div>
      <Card className="relative glass-card border-0 rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-secondary"></div>
        <CardContent className="p-8 md:p-12">
          
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/20 rounded-xl text-primary">
              <Languages className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white glitch-effect">
              AI Translator
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col md:flex-row items-stretch gap-6">
                <FormField
                  control={form.control}
                  name="sourceText"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-muted-foreground font-medium uppercase tracking-wider text-xs ml-1">English Text</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter English text to translate..." 
                          className="min-h-[200px] resize-none bg-background/50 border-white/10 focus-visible:ring-blue-500/50 text-lg p-6 rounded-xl transition-all shadow-inner"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-center py-4 md:py-0">
                  <div className="p-4 rounded-full bg-white/5 border border-white/10 text-muted-foreground hidden md:block shadow-lg">
                    <ArrowRightLeft className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <label className="text-muted-foreground font-medium uppercase tracking-wider text-xs ml-1 block">Arabic Translation</label>
                  <Textarea 
                    placeholder={isLoading ? "Translating..." : "Translation will appear here"} 
                    className={`min-h-[200px] resize-none border-white/10 text-lg p-6 rounded-xl transition-all shadow-inner text-right ${isLoading ? 'bg-blue-500/5 animate-pulse' : 'bg-background/50'}`} 
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
                className="w-full md:w-auto md:min-w-[200px] md:mx-auto md:block px-8 py-6 rounded-xl font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95 bg-blue-600 hover:bg-blue-500 text-white"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" /> Translating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" /> Translate Now
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}