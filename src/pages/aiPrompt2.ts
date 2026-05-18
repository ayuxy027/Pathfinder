export default function getAIPrompt(userInput: string, profession: string, skillSections: string[] = []): string {
  const sanitizeInput = (input: string): string =>
    input.replace(/[`{}]/g, '').trim();

  if (!userInput?.trim()) {
    throw new Error('Invalid or missing user input');
  }

  if (!profession?.trim()) {
    throw new Error('Invalid or missing profession input');
  }

  const sanitizedUserInput = sanitizeInput(userInput);
  const sanitizedProfession = sanitizeInput(profession);

  let skillSectionsText = '';
  if (skillSections && skillSections.length > 0) {
    skillSectionsText = `
Focus particularly on these skill categories the user is interested in:
${skillSections.map(skill => `- ${skill}`).join('\n')}
`;
  }

  return `
As RoadmapAI, an advanced career development assistant, your task is to create a comprehensive and personalized learning roadmap along with relevant flashcards for the user's profession.

User's Profession: ${sanitizedProfession}
User's Request: ${sanitizedUserInput}
${skillSectionsText}

Generate a response in the following JSON structure:

{
  "roadmap": [
    {
      "stage": "Stage Name",
      "description": "Detailed description of this career stage",
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "resources": [
        {
          "name": "Resource Name",
          "type": "Book/Course/Website/Tool/Conference",
          "link": "https://example.com"
        }
      ]
    }
  ],
  "flashcards": [
    {
      "question": "Concise question about a key concept",
      "answer": "Clear, informative answer"
    }
  ]
}

Guidelines:
1. Provide at least 4 detailed stages in the roadmap
2. Ensure each stage builds upon the previous one
3. Include a mix of technical skills, soft skills, and industry knowledge
4. Recommend up-to-date, high-quality resources
5. Create at least 8 flashcards covering key concepts
6. Tailor the roadmap to the user's specific request and profession

Provide your response as a valid JSON object without any additional text or formatting.`;
}