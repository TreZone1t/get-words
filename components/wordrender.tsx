import { Card, CardContent } from "@/components/ui/card";
import { fetchWords } from "@/lib/fetch";
import { ArrowRight, BookOpen, Shuffle, AlignLeft, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Word } from "@prisma/client";

type Props = {
  word : string
};



export default async function WordRender({word}: Props) {
  const { mainWord, synonyms, antonyms, similar } = await fetchWords(word);
  
  const renderWordList = (title: string, words: Word[], Icon: React.ElementType, colorClass: string) => (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-2 mb-4 ${colorClass}`}>
        <Icon className="w-5 h-5" />
        <h2 className="text-xl font-semibold tracking-wide">{title}</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {words.length > 0 ? words.map((w: Word) => (
          <Link key={w.id} href={`/search?search=${encodeURIComponent(w.word)}`} className="transition-all hover:-translate-y-1">
            <span className="px-4 py-2 rounded-full bg-background/50 border border-white/5 hover:border-primary/50 hover:bg-primary/10 text-sm font-medium shadow-sm flex items-center">
              {w.word}
            </span>
          </Link>
        )) : <p className="text-muted-foreground text-sm italic">No {title.toLowerCase()} found.</p>}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 transition duration-1000 group-hover:opacity-40"></div>
        <Card className="relative glass-card border-0 rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-secondary"></div>
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight glitch-effect">
                    {mainWord.word}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-sm font-bold tracking-widest uppercase">
                    {mainWord.type[0] || 'word'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-2xl md:text-3xl font-medium text-muted-foreground">
                  <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
                  <span dir="rtl" className="text-glow">{mainWord.translation.join(" ، ")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Meanings */}
        <Card className="glass-card border-0 rounded-2xl shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6 text-blue-400">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-2xl font-semibold">Meanings</h2>
            </div>
            <ul className="space-y-4">
              {mainWord.meaning.map((meaning: string, i: number) => (
                <li key={i} className="flex gap-3 text-lg text-foreground/90 leading-relaxed">
                  <span className="text-blue-500 font-bold mt-1">•</span>
                  <span>{meaning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Examples */}
        <Card className="glass-card border-0 rounded-2xl shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6 text-emerald-400">
              <MessageCircle className="w-6 h-6" />
              <h2 className="text-2xl font-semibold">Examples</h2>
            </div>
            <ul className="space-y-4">
              {mainWord.example.map((ex: string, i: number) => (
                <li key={i} className="flex gap-3 text-lg text-foreground/90 leading-relaxed italic border-l-2 border-emerald-500/30 pl-4 py-1">
                  &quot;{ex}&quot;
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Relations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-0 rounded-xl">
          <CardContent className="p-6">
            {renderWordList("Synonyms", synonyms, AlignLeft, "text-purple-400")}
          </CardContent>
        </Card>
        <Card className="glass-card border-0 rounded-xl">
          <CardContent className="p-6">
            {renderWordList("Antonyms", antonyms, Shuffle, "text-rose-400")}
          </CardContent>
        </Card>
        <Card className="glass-card border-0 rounded-xl">
          <CardContent className="p-6">
            {renderWordList("Similar", similar, Sparkles, "text-amber-400")}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
