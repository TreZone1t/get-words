import { aiService } from "@/lib/services";

const model = aiService.connectToModel();
export const translate = async ( sentence: string) => {
    const prompt = `Translate the following sentence into Arabic : ${sentence} , please provide the following details in JSON format and do not put anything else in the message :
    {
      "translation": "sentence"
    }
    `;
    const generatedContent = await model.generateContent(prompt);
    const responseText = await generatedContent.response.text();
    const cleanedText = responseText.replace(/```json|```/g, '');
    const jsonResponse = JSON.parse(cleanedText.trim()) as {  translation: string[]} | { message: string };
    return jsonResponse;
}