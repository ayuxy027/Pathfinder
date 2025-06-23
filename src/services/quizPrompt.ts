/**
 * Generates the prompt for quiz questions based on topic and difficulty
 */
export const getPromptForQuestions = (topic: string, difficulty: string): string => {
  return `Generate 5 multiple-choice questions about ${topic} with ${difficulty} difficulty level.

IMPORTANT: Your response MUST be valid JSON following EXACTLY this format without ANY additional text, markdown formatting, or explanations outside the JSON structure:

{
  "questions": [
    {
      "question": "The question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The exact text of the correct option",
      "explanation": "A clear explanation of why this answer is correct",
      "code": "// Optional code snippet if relevant to the question\\nfunction example() {\\n  return true;\\n}"
    }
  ]
}

Guidelines:
1. Create EXACTLY 5 questions related to ${topic} at ${difficulty} level
2. Each question MUST have EXACTLY 4 options
3. The correctAnswer MUST match EXACTLY one of the options
4. Include code examples for programming questions when relevant
5. Provide a clear explanation for each correct answer
6. Return ONLY the JSON object with no additional text before or after
7. Use appropriate escaping for any special characters in JSON strings
8. Ensure the JSON is valid and can be parsed with JSON.parse()

Example of a good question structure for ${topic}:
{
  "question": "What is the main benefit of using React's virtual DOM?",
  "options": [
    "It eliminates the need for JavaScript",
    "It makes rendering slower but more accurate",
    "It improves performance by minimizing direct DOM manipulations",
    "It allows HTML to be written directly in JavaScript files"
  ],
  "correctAnswer": "It improves performance by minimizing direct DOM manipulations",
  "explanation": "React's virtual DOM creates a lightweight copy of the actual DOM in memory and compares it with previous versions to determine the minimal set of changes needed, reducing expensive DOM operations."
}

DO NOT include anything outside the JSON structure. No markdown, no code blocks, no introductions or conclusions.`;
};

/**
 * Function to generate a fallback prompt if the main one fails
 */
export const getFallbackPrompt = (topic: string, difficulty: string): string => {
  return `Create 3 multiple choice questions about ${topic} at ${difficulty} level. 
  Format as JSON with array of questions containing: question, options (array of 4 choices), 
  correctAnswer (exact text of correct option), and explanation fields. 
  Return ONLY valid JSON, no additional text.`;
}; 