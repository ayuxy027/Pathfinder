const getAIPrompt = (userInput, profession) => {
    if (!userInput || !profession) {
      throw new Error('User input and profession are required');
    }
  
    return `
  As RoadmapAI, an advanced career development assistant, your task is to create a comprehensive and personalized learning roadmap along with relevant flashcards for the user's profession. Analyze the user's input carefully and provide a detailed, actionable plan.
  
  User's Profession: ${profession}
  User's Request: ${userInput}
  
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
  3. Include a mix of technical skills, soft skills, and industry knowledge in each stage.
  4. Recommend up-to-date, high-quality resources from reputable sources.
  5. Create at least 8 flashcards covering key concepts, terminology, and best practices in the profession.
  6. Tailor the roadmap and flashcards to the user's specific request and profession.
  7. Use clear, professional language throughout the response.
  
  Provide your response as a valid JSON object without any additional text or formatting.
  `;
  };
  
  export default getAIPrompt;