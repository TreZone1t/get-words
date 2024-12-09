import axios from "axios";
import { urlService } from "./services";
import { fetchedWordResponse, FetchedWordResponseT } from "@/schema/word";

const URL =  urlService.getMyURL();
export const fetchWords = async (word: string): Promise<FetchedWordResponseT> => {
  try {
    console.log(`${URL}/api/word/${encodeURIComponent(word)}`);
    const response = await axios.get(`${URL}/api/word/${encodeURIComponent(word)}`);
    const data = fetchedWordResponse.parse(response.data);
    console.log(data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch word data. Please try again later.');
    }
    console.error('Unexpected Error:', error);
    throw new Error('An unexpected error occurred. Please try again later.');
  }
};

export const fetchTranslation = async (sentence: string): Promise<{ translation: string }> => {
  try {
    const response = await axios.post(URL + "/api/translation", { sentence });
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
    const response = await axios.post(URL + "/api/translation/context", { sentence, word });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || error.message);
    }
    throw error;
  }
};