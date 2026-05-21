import axios from "axios";
import { fetchedWordResponse, FetchedWordResponseT } from "@/schema/word";
export const fetchWords = async (word: string): Promise<FetchedWordResponseT> => {
  try {
    const url = `/api/word/${encodeURIComponent(word)}`;
    const response = await axios.get(url);
    const data = fetchedWordResponse.parse(response.data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || error.message);
    }
    throw error;
  }
};

export const fetchTranslation = async (sentence: string): Promise<{ translation: string[] }> => {
  try {
    const url = `/api/translation`;
    const response = await axios.post(url, { sentence });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || error.message);
    }
    throw error;
  }
};

export const fetchTranslationWordInContext = async ({ word, sentence }: { word: string; sentence: string }): Promise<{ translation: string[], fullSentence: string }> => {
  try {
    if (!sentence.includes(word)) {
      throw new Error(`The word "${word}" does not exist in the sentence`);
    }
    const url = `/api/translation/context`;
    const response = await axios.post(url, { sentence, word });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || error.message);
    }
    throw error;
  }
};