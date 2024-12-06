import { aiService, wordService } from "@/lib/services";

const model = aiService.connectToModel();
export const translate = async (word: string , sentence: string) => {
    const prompt = `Translate in an interpretable way the following word '${word}' from the context of the following sentence into Arabic and also the full sentence into Arabic: '${sentence}' , please provide the following details in JSON format and do not put anything else in the message:
    {
      "translation": ["arabic word without tashkeel", ...],
      "fullSentence": "sentence"
    }
    and if the word is not a real word respond with: {"message": "('${word}') is not a real word"}
    `;
    const generatedContent = await model.generateContent(prompt);
    const responseText = await generatedContent.response.text();
    const cleanedText = responseText.replace(/```json|```/g, '');
    const jsonResponse = JSON.parse(cleanedText.trim()) as {  translation: string[]} | { message: string };
    if ('message' in jsonResponse) {
        throw new Error(jsonResponse.message);
    }
    const wordExists = await wordService.findWord(word);
    if (wordExists) { wordService.addTranslations(wordExists, jsonResponse.translation);}
    return jsonResponse;
}