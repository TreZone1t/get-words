import WordRender from '@/components/wordrender';
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
                <Suspense fallback={<div className="text-center">Loading word data...</div>}>
                    <WordRender word={search} />
                </Suspense>
        </div>
    );
}