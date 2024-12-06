import axios from "axios";
import { fetchedWordResponse, FetchedWordResponseT } from "@/schema/word";
import { toast } from "@/hooks/use-toast";

export const fetchWords = async (word: string): Promise<FetchedWordResponseT> => {
  try {
    const response = await axios.get(`http://localhost:3000/api/word/${word}`);
    const data = fetchedWordResponse.parse(response.data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast({
        title: "Error",
        description: error.response?.data.message || error.message,
        variant: "destructive",
      });
    }
    throw error;
  }
};

export const fetchTranslation = async (sentence: string): Promise<{ translation: string }> => {
  try {
    const response = await axios.post(`http://localhost:3000/api/translation`, { sentence });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast({
        title: "Translation Error",
        description: error.response?.data.message || error.message,
        variant: "destructive",
      });
    }
    throw error;
  }
};

export const fetchTranslationWordInContext = async ({ word, sentence }: { word: string; sentence: string }): Promise<{ translation: string[], fullSentence: string }> => {
  try {
    if (!sentence.includes(word)) {
      toast({
        title: "Invalid Input",
        description: `The word "${word}" does not exist in the sentence`,
        variant: "destructive",
      });
      throw new Error(`The word "${word}" does not exist in the sentence`);
    }
    const response = await axios.post(`http://localhost:3000/api/translation/context`, { sentence , word });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast({
        title: "Context Translation Error",
        description: error.response?.data.message || error.message,
        variant: "destructive",
      });
    }
    throw error;
  }
};