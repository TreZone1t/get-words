import WordRender from '@/components/wordrender';
import { Loader } from 'lucide-react';
import { Suspense } from 'react';

type SearchParams = Promise<{
    search?: string;
}>

export default async function Search({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    // Wait for searchParams to be ready
    const params = await searchParams;
    const search = params?.search;
    console.log(search);
    if (!search) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-bold mb-4">Please provide a search term</h1>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto p-4">
                <Suspense fallback={<div className="text-center"><div className="flex items-center justify-center"><Loader className="w-5 h-5 animate-spin m-2" /> Loading ...</div></div>}>
                    <WordRender word={search} />
                </Suspense>
        </div>
    );
}