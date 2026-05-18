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

DO NOT include anything outside the JSON structure.`;
};

export const getFallbackPrompt = (topic: string, difficulty: string): string => {
  return `Create 3 multiple choice questions about ${topic} at ${difficulty} level.
Format as JSON with array of questions containing: question, options (array of 4 choices),
correctAnswer (exact text of correct option), and explanation fields.
Return ONLY valid JSON, no additional text.`;
};