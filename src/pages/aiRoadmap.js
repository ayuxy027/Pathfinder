import axios from 'axios';
import { marked } from 'marked';
import JSON5 from 'json5';
import _ from 'lodash';
import getAIPrompt from './aiPrompt2';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const extractJSONFromMarkdown = (markdown) => {
  const tokenizer = new marked.Tokenizer();
  const tokens = marked.lexer(markdown);
  const codeBlocks = tokens.filter(token => token.type === 'code' && token.lang === 'json');
  return codeBlocks.length > 0 ? codeBlocks[0].text : null;
};

export const getAIResponse = async (userInput, profession, skillSections = []) => {
  try {
    if (!API_KEY) {
      throw new Error('API key is missing');
    }

    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: getAIPrompt(userInput, profession, skillSections)
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.data || !response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content || !response.data.candidates[0].content.parts || !response.data.candidates[0].content.parts[0].text) {
      throw new Error('Unexpected API response structure');
    }

    const rawText = response.data.candidates[0].content.parts[0].text;
    const jsonString = extractJSONFromMarkdown(rawText) || rawText;

    try {
      return JSON5.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      throw new Error('Invalid JSON in AI response');
    }
  } catch (error) {
    console.error('Error fetching response from API:', error);
    if (error.response) {
      console.error('API response error:', error.response.data);
    }
    throw new Error('Failed to fetch AI response. Please try again later.');
  }
};