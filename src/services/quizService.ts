import { getPromptForQuestions, getFallbackPrompt } from './quizPrompt';
import { QuizQuestion } from '../types';

interface APIResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
}

/**
 * Generates quiz questions using an AI API
 */
export const generateQuizQuestions = async (topic: string, difficulty: string): Promise<QuizQuestion[]> => {
  try {
    // First attempt with detailed prompt
    const prompt = getPromptForQuestions(topic, difficulty);
    
    // Check if API key exists
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      throw new Error('API key is missing. Please add VITE_API_KEY to your environment variables.');
    }

    // Gemini API endpoint changed to the correct one
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    
    // Extract content from the Gemini API response structure
    let responseText = '';
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      // Extract text from the content parts
      responseText = data.candidates[0].content.parts
        .map(part => part.text || '')
        .join('');
    } else {
      throw new Error('Invalid API response structure');
    }
    
    // Try to extract JSON from the response text
    let jsonData;
    try {
      // Check if response contains code blocks and extract them
      if (responseText.includes('```json')) {
        const startIdx = responseText.indexOf('```json') + 7;
        const endIdx = responseText.indexOf('```', startIdx);
        if (endIdx > startIdx) {
          jsonData = JSON.parse(responseText.substring(startIdx, endIdx).trim());
        }
      } else if (responseText.includes('{') && responseText.includes('}')) {
        // Extract everything between the first { and the last }
        const startIdx = responseText.indexOf('{');
        const endIdx = responseText.lastIndexOf('}') + 1;
        if (endIdx > startIdx) {
          jsonData = JSON.parse(responseText.substring(startIdx, endIdx).trim());
        }
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      console.error("Raw response:", responseText);
      
      // Try fallback prompt if first attempt fails
      console.log("Trying fallback prompt...");
      return await tryFallbackPrompt(topic, difficulty, apiKey);
    }
    
    // Validate and return questions
    return parseAndValidateQuestions(jsonData);
  } catch (error) {
    console.error("Error generating questions:", error);
    
    // Try fallback or return mock questions
    try {
      const fallbackQuestions = await tryFallbackPrompt(topic, difficulty);
      return fallbackQuestions;
    } catch (fallbackError) {
      console.log("Using mock questions as final fallback");
      return generateMockQuestions(topic, difficulty);
    }
  }
};

/**
 * Try to generate questions with a fallback prompt
 */
const tryFallbackPrompt = async (topic: string, difficulty: string, apiKey?: string): Promise<QuizQuestion[]> => {
  const fallbackPrompt = getFallbackPrompt(topic, difficulty);
  
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fallbackPrompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Fallback API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid fallback API response');
  }
  
  const responseText = data.candidates[0].content.parts
    .map(part => part.text || '')
    .join('');
  
  // Try to extract JSON
  try {
    let jsonStr = responseText;
    if (responseText.includes('```')) {
      const startIdx = responseText.indexOf('```') + 3;
      const endIdx = responseText.lastIndexOf('```');
      jsonStr = responseText.substring(startIdx, endIdx).trim();
      
      // Remove json language identifier if present
      if (jsonStr.startsWith('json\n')) {
        jsonStr = jsonStr.substring(5);
      }
    } else if (responseText.includes('{')) {
      const startIdx = responseText.indexOf('{');
      const endIdx = responseText.lastIndexOf('}') + 1;
      jsonStr = responseText.substring(startIdx, endIdx);
    }
    
    const parsedData = JSON.parse(jsonStr);
    return parseAndValidateQuestions(parsedData);
  } catch (error) {
    console.error("Failed to parse fallback JSON:", error);
    throw error;
  }
};

/**
 * Parses and validates the API response to ensure it contains properly formatted questions
 */
const parseAndValidateQuestions = (data: any): QuizQuestion[] => {
  // Check if data contains questions array directly
  let questions = data.questions;
  
  // If not, try to find questions somewhere else in the response
  if (!questions) {
    if (Array.isArray(data)) {
      // Sometimes the API might return an array directly
      questions = data;
    } else {
      // Look for any array in the response that might be questions
      const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
      if (possibleArrays.length > 0) {
        // Use the first array found
        questions = possibleArrays[0];
      }
    }
  }
  
  // Final check if we have questions
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    throw new Error('No valid questions found in the response');
  }

  // Validate each question and fix issues where possible
  return questions.map(q => {
    // Create a normalized question object
    const normalizedQuestion = {
      question: q.question || '',
      options: [],
      correctAnswer: '',
      explanation: q.explanation || 'No explanation provided',
      code: q.code || null
    };
    
    // Handle options
    if (q.options && Array.isArray(q.options)) {
      normalizedQuestion.options = q.options.slice(0, 4);
      // If we don't have enough options, add some generic ones
      while (normalizedQuestion.options.length < 4) {
        normalizedQuestion.options.push(`Option ${normalizedQuestion.options.length + 1}`);
      }
    } else {
      // Create generic options if none exist
      normalizedQuestion.options = ["Option A", "Option B", "Option C", "Option D"];
    }
    
    // Handle correct answer
    if (q.correctAnswer && normalizedQuestion.options.includes(q.correctAnswer)) {
      normalizedQuestion.correctAnswer = q.correctAnswer;
    } else {
      // If correct answer is invalid, use the first option
      normalizedQuestion.correctAnswer = normalizedQuestion.options[0];
    }
    
    // Validate question has content
    if (!normalizedQuestion.question) {
      normalizedQuestion.question = `Question about ${Array.isArray(q.options) ? q.options[0] : 'this topic'}`;
    }
    
    return normalizedQuestion;
  });
};

/**
 * Generates mock questions for testing or when API fails
 * @param {string} topic - The quiz topic
 * @param {string} difficulty - The difficulty level
 * @returns {Array} - Array of question objects
 */
export const generateMockQuestions = (topic: string, difficulty: string): QuizQuestion[] => {
  const mockQuestions = [];
  
  // Topic-specific mock questions
  if (topic === 'javascript') {
    mockQuestions.push({
      question: "What is the output of: console.log(typeof NaN)?",
      options: ["'undefined'", "'number'", "'NaN'", "'object'"],
      correctAnswer: "'number'",
      explanation: "Despite standing for 'Not a Number', NaN is actually of type 'number' in JavaScript.",
      code: "console.log(typeof NaN);"
    });
    
    mockQuestions.push({
      question: "Which method is used to serialize an object into a JSON string in JavaScript?",
      options: ["JSON.stringify()", "JSON.parse()", "JSON.toText()", "JSON.serialize()"],
      correctAnswer: "JSON.stringify()",
      explanation: "JSON.stringify() converts a JavaScript object into a JSON string, while JSON.parse() does the opposite.",
      code: "const obj = { name: 'John', age: 30 };\nconst jsonString = JSON.stringify(obj);"
    });
  } else if (topic === 'react') {
    mockQuestions.push({
      question: "What is the correct way to pass a prop called 'name' to a React component?",
      options: ["<Component {name} />", "<Component name={name} />", "<Component name='name' />", "<Component props={name} />"],
      correctAnswer: "<Component name={name} />",
      explanation: "Props are passed as attributes to React components, with the value in curly braces for JavaScript expressions.",
      code: "function Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n\n<Welcome name={user.name} />"
    });
    
    mockQuestions.push({
      question: "What hook would you use to run side effects in a function component?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correctAnswer: "useEffect",
      explanation: "useEffect is the React hook designed for handling side effects like data fetching, subscriptions, or DOM manipulation.",
      code: "useEffect(() => {\n  document.title = `Hello, ${name}`;\n}, [name]);"
    });
  } else {
    // Generic questions for other topics
    mockQuestions.push({
      question: `What is a key feature of ${topic} in a ${difficulty} context?`,
      options: [
        "Component-based architecture",
        "Dynamic typing system",
        "Static type checking",
        "Just-in-time compilation"
      ],
      correctAnswer: "Component-based architecture",
      explanation: `This is a fundamental concept in ${topic} that allows for modular and reusable code.`,
      code: topic === "html" ? "<div class=\"container\">\n  <h1>Hello World</h1>\n</div>" : null
    });
  }
  
  // Add one more generic question
  mockQuestions.push({
    question: `How do you create a ${topic} application from scratch?`,
    options: [
      `Using the create-${topic} command line tool`,
      "Using a starter template",
      "Manually setting up the configuration",
      "All of the above"
    ],
    correctAnswer: "All of the above",
    explanation: `There are multiple ways to start a ${topic} project, including CLI tools, templates, or manual configuration.`,
    code: null
  });
  
  return mockQuestions;
}; 