function escapeHtml(text: string): string {
  return text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] ?? c));
}

function safeInterpolate(input: string): string {
  return input ? `Regarding "${escapeHtml(input)}" — ` : '';
}

function safeSolo(input: string): string {
  return input ? `Regarding "${escapeHtml(input)}" — ` : '';
}

const OFFLINE_RESPONSES: Record<string, (input: string) => string> = {
  career: (input: string) => `### Career Guidance

Here are some key career development strategies:

- **Continuous Learning**: Stay updated with industry trends and technologies
- **Networking**: Build meaningful professional relationships
- **Skill Development**: Focus on both technical and soft skills
- **Goal Setting**: Create clear, measurable career objectives

${safeInterpolate(input)}I'd recommend starting with a self-assessment to identify your strengths and interests, then research potential career paths that align with your goals.

Would you like more specific advice on any of these areas?`,

  programming: (input: string) => `### Programming Career Path

Here's a roadmap for your programming journey:

1. **Choose a specialization** — Frontend, Backend, Mobile, or Data Science
2. **Master fundamentals** — Data structures, algorithms, version control
3. **Build projects** — Create a portfolio showcasing your skills
4. **Contribute to open source** — Gain experience and visibility
5. **Stay current** — Follow industry blogs, attend meetups

${safeInterpolate(input)}The most in-demand languages right now include JavaScript/TypeScript, Python, Go, and Rust.

Would you like more detailed guidance on a specific area?`,

  resume: () => `### Resume Building Tips

**Structure:**
- **Header**: Name, contact info, LinkedIn/GitHub
- **Summary**: 2-3 sentences highlighting your value proposition
- **Experience**: Use the STAR method (Situation, Task, Action, Result)
- **Skills**: Group by category (Technical, Soft, Tools)
- **Education**: Include relevant coursework and certifications

**Best Practices:**
- Use action verbs: Led, Developed, Implemented, Achieved
- Quantify achievements: "Increased sales by 30%"
- Tailor to each position
- Keep to 1-2 pages
- Proofread carefully

Would you like help with a specific resume section?`,

  interview: () => `### Interview Preparation

**Before the Interview:**
- Research the company culture and recent news
- Prepare STAR method stories for behavioral questions
- Practice technical problems if applicable
- Prepare thoughtful questions to ask

**During the Interview:**
- Listen carefully to each question
- Take a moment to think before answering
- Be authentic and enthusiastic
- Ask clarifying questions if needed

**Common Questions:**
- "Tell me about yourself" — Keep it professional and concise
- "Why do you want to work here?" — Show research and genuine interest
- "What's your greatest weakness?" — Show self-awareness and growth mindset

Would you like practice with specific interview questions?`,

  skills: (input: string) => `### Skill Development

${safeSolo(input)}Here's how to effectively develop new skills:

1. **Set SMART Goals** — Specific, Measurable, Achievable, Relevant, Time-bound
2. **Use the 80/20 Rule** — Focus on the 20% that gives 80% of results
3. **Practice Deliberately** — Focus on weaknesses, not just strengths
4. **Find a Mentor** — Learn from someone who's already where you want to be
5. **Teach Others** — The best way to learn is to teach

**Recommended Platforms:**
- Coursera, Udemy, edX for structured courses
- LeetCode, HackerRank for coding practice
- Medium, Dev.to for industry insights

What specific skills are you looking to develop?`,

  salary: () => `### Salary Negotiation

**Research:**
- Use Glassdoor, LinkedIn Salary, and Payscale for market data
- Consider location, experience level, and company size
- Know your minimum acceptable salary

**During Negotiation:**
- Let them make the first offer
- Present your value with specific achievements
- Consider the total package (benefits, equity, PTO)
- Be prepared to walk away if needed

**Key Phrases:**
- "Based on my research, I believe a salary of X-Y is appropriate"
- "I'm excited about this opportunity and want to find terms that work for both of us"

Would you like more negotiation strategies?`,
};

function isValidInput(input: string): boolean {
  return typeof input === 'string' && input.trim().length > 0;
}

function getOfflineResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('switch career') || lower.includes('career change') || lower.includes('transitioning')) {
    return `### Career Transition Guide

Switching careers is a significant decision! Here's a structured approach:

1. **Identify Transferable Skills** — Communication, leadership, problem-solving
2. **Research Your Target Field** — Required qualifications, certifications
3. **Bridge the Gap** — Courses, portfolio, internships
4. **Plan Your Transition** — 6-18 month timeline, financial cushion

Would you like specific advice for a particular career transition?`;
  }

  if (lower.includes('code') || lower.includes('develop') || lower.includes('software') || lower.includes('web')) {
    return OFFLINE_RESPONSES.programming(input);
  }

  if (lower.includes('resume') || lower.includes('cv')) {
    return OFFLINE_RESPONSES.resume(input);
  }

  if (lower.includes('interview') || lower.includes('hire') || lower.includes('job')) {
    return OFFLINE_RESPONSES.interview(input);
  }

  if (lower.includes('skill') || lower.includes('learn') || lower.includes('course')) {
    return OFFLINE_RESPONSES.skills(input);
  }

  if (lower.includes('salary') || lower.includes('pay') || lower.includes('negotiate') || lower.includes('compensation')) {
    return OFFLINE_RESPONSES.salary(input);
  }

  if (lower.includes('remote') || lower.includes('work from home') || lower.includes('wfh')) {
    return `### Remote Work Guide

**Getting Remote Jobs:**
- Search on Remote.co, We Work Remotely, FlexJobs
- Highlight remote skills in your resume
- Build a remote-friendly online presence

**Being Productive Remotely:**
- Create a dedicated workspace
- Stick to a consistent schedule
- Use productivity tools (Notion, Slack, Zoom)
- Communicate proactively in async environments
- Take regular breaks to avoid burnout

Would you like tips for specific remote work challenges?`;
  }

  return OFFLINE_RESPONSES.career(input);
}

export function getAIResponse(userInput: string): Promise<string> {
  return new Promise((resolve) => {
    if (!isValidInput(userInput)) {
      resolve('Please ask a question to get started!');
      return;
    }

    setTimeout(() => {
      resolve(getOfflineResponse(userInput));
    }, 600 + Math.random() * 600);
  });
}