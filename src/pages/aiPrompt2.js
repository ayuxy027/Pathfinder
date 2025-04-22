const getAIPrompt = (userInput, profession, skillSections = [], options = { logErrors: false }) => {
    // Helper: Validate input as non-empty strings
    const isValidString = (str) =>
      typeof str === 'string' && str.trim().length > 0;
  
    // Helper: Sanitize inputs to prevent code injections (XSS, SQL injection, etc.)
    const sanitizeInput = (input) =>
      input.replace(/[<>`"'{}]/g, '').trim();
  
    // Input Validation: Strict checks with specific error messages
    if (!isValidString(userInput)) {
      handleInvalidInput('Invalid or missing user input');
    }
  
    if (!isValidString(profession)) {
      handleInvalidInput('Invalid or missing profession input');
    }
  
    // Sanitize inputs
    const sanitizedUserInput = sanitizeInput(userInput);
    const sanitizedProfession = sanitizeInput(profession);
    
    // Format skill sections for inclusion in the prompt
    let skillSectionsText = '';
    if (skillSections && skillSections.length > 0) {
      skillSectionsText = `
Focus particularly on these skill categories the user is interested in:
${skillSections.map(skill => `- ${skill}`).join('\n')}
`;
    }
  
    // Template
    const prompt = `
  As RoadmapAI, an advanced career development assistant, your task is to create a comprehensive and personalized learning roadmap along with relevant flashcards for the user's profession. Analyze the user's input carefully and provide a detailed, actionable plan.
  
  User's Profession: ${sanitizedProfession}
  User's Request: ${sanitizedUserInput}
  ${skillSectionsText}
  
  Generate a response in the following JSON structure:
  
  {
    "roadmap": [
      {
        "stage": "Stage Name (e.g., 'Foundation', 'Intermediate', 'Advanced')",
        "description": "Detailed description of this career stage, including its importance and expected outcomes",
        "skills": [
          "Specific, relevant skill 1",
          "Specific, relevant skill 2",
          "Specific, relevant skill 3",
          "..."
        ],
        "resources": [
          {
            "name": "Resource Name (be specific and relevant)",
            "type": "Book/Course/Website/Tool/Conference",
            "link": "https://example.com"
          }
        ]
      }
    ],
    "flashcards": [
      {
        "question": "Concise question about a key concept in the profession",
        "answer": "Clear, informative answer to the question"
      }
    ]
  }
  
  Guidelines:
  1. Provide at least 4 detailed stages in the roadmap, each with 5-7 specific skills and 3-5 highly relevant resources.
  2. Ensure each stage builds upon the previous one, creating a clear progression path.
  3. Include a mix of technical skills, soft skills, and industry knowledge in each stage.${skillSections && skillSections.length > 0 ? `
  4. Make sure to include all the requested skill categories (${skillSections.join(', ')}) across the roadmap stages where relevant.` : ''}
  4. Recommend up-to-date, high-quality resources from reputable sources.
  5. Create at least 8 flashcards covering key concepts, terminology, and best practices in the profession.
  6. Tailor the roadmap and flashcards to the user's specific request and profession.
  7. Use clear, professional language throughout the response.
  
  Provide your response as a valid JSON object without any additional text or formatting.
    `;
  
    return prompt;
  
    // Handle invalid inputs with logging (if enabled)
    function handleInvalidInput(errorMessage) {
      if (options.logErrors) {
        console.error(`[getAIPrompt Error] ${errorMessage}`);
      }
      throw new Error(errorMessage);
    }
  };
  
  export default getAIPrompt;
  