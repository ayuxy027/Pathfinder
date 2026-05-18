const MOCK_ROADMAP_RESPONSES: Record<string, (goal: string) => string> = {
  default: (goal: string) => `I'd be happy to help you with your career question!${
    goal ? ` Regarding "${goal}",` : ''
  } here are some general career guidance tips:

### Key Considerations
- **Self-Assessment**: Identify your strengths, weaknesses, and interests
- **Market Research**: Understand current trends and opportunities in your field
- **Skill Development**: Focus on both technical and soft skills
- **Networking**: Build meaningful professional relationships
- **Continuous Learning**: Stay updated with industry changes

### Action Steps
1. Create a clear career development plan
2. Seek mentorship from experienced professionals
3. Take on challenging projects to grow your skills
4. Document your achievements and learnings

Would you like me to provide more specific guidance on any of these topics?`
};

export function getAIResponse(userInput: string): string {
  const input = userInput.toLowerCase();

  if (input.includes('switch career') || input.includes('career change') || input.includes('transition')) {
    return `### Career Transition Guide

Switching careers is a significant decision! Here's a structured approach:

1. **Identify Transferable Skills** - Many skills are valuable across industries:
   - Communication and leadership
   - Project management
   - Problem-solving and analytical thinking
   - Technical literacy

2. **Research Your Target Field**
   - Understand required qualifications and certifications
   - Network with professionals in the field
   - Follow industry news and trends

3. **Bridge the Gap**
   - Take relevant courses or certifications
   - Build a portfolio showcasing relevant projects
   - Seek internship or volunteer opportunities

4. **Plan Your Transition**
   - Set a realistic timeline (6-18 months)
   - Build financial cushion before making the jump
   - Start networking actively in your new field

Would you like specific advice for a particular career transition?`;
  }

  if (input.includes('programming') || input.includes('coding') || input.includes('developer') || input.includes('software')) {
    return `### Programming Career Guide

Here's a roadmap for building a successful career in software development:

1. **Choose Your Path**
   - Frontend: React, Vue, Angular, HTML/CSS/JavaScript
   - Backend: Node.js, Python, Java, Go
   - Mobile: React Native, Flutter, Swift, Kotlin
   - Data Science: Python, R, SQL, Machine Learning

2. **Build Foundational Skills**
   - Master one programming language thoroughly
   - Learn data structures and algorithms
   - Understand version control (Git)
   - Practice problem-solving on platforms like LeetCode

3. **Gain Experience**
   - Contribute to open-source projects
   - Build personal projects and portfolio
   - Participate in hackathons and coding challenges

4. **Stay Current**
   - Follow industry blogs and podcasts
   - Attend conferences and meetups
   - Continuously learn new technologies

What specific area of programming interests you most?`;
  }

  if (input.includes('resume') || input.includes('cv') || input.includes('interview')) {
    return `### Resume & Interview Tips

**Resume Best Practices:**
1. **Tailor Your Resume** - Customize for each position
2. **Use Action Verbs** - Led, developed, implemented, achieved
3. **Quantify Achievements** - "Increased sales by 30%"
4. **Keep It Concise** - 1-2 pages maximum
5. **Proofread** - No typos or grammatical errors

**Interview Preparation:**
1. **Research the Company** - Mission, values, recent news
2. **Practice Common Questions** - Prepare STAR method responses
3. **Prepare Questions** - Show genuine interest
4. **Technical Prep** - Code challenges, system design
5. **Follow Up** - Send a thank-you email within 24 hours

Would you like more specific resume templates or interview practice questions?`;
  }

  if (input.includes('salary') || input.includes('negotiate') || input.includes('pay') || input.includes('compensation')) {
    return `### Salary Negotiation Guide

**Preparation:**
1. **Research Market Rates** - Use Glassdoor, LinkedIn Salary, Payscale
2. **Know Your Worth** - Factor in experience, skills, and location
3. **Set a Range** - Have a minimum acceptable salary in mind

**During Negotiation:**
1. **Let Them Go First** - Avoid being the first to name a number
2. ** Focus on Value** - Emphasize what you bring to the company
3. **Be Professional** - Stay calm and confident
4. **Consider the Total Package** - Benefits, equity, bonuses, PTO

**Key Phrases:**
- "Based on my research and experience, I believe a salary of X-Y is appropriate"
- "I'm excited about this opportunity and want to find a number that works for both of us"
- "Could we explore ways to bridge the gap?"

Would you like more negotiation strategies?`;
  }

  if (input.includes('remote') || input.includes('work from home') || input.includes('wfh')) {
    return `### Remote Work Guide

**Getting Remote Jobs:**
1. **Search on Remote Platforms** - Remote.co, We Work Remotely, FlexJobs
2. **Highlight Remote Skills** - Self-motivation, communication, time management
3. **Build a Remote-Friendly Portfolio** - Online presence, GitHub, personal website

**Being Productive Remotely:**
1. **Create a Dedicated Workspace** - Separate work from living areas
2. **Stick to a Schedule** - Set clear work hours
3. **Use Productivity Tools** - Notion, Slack, Zoom, Trello
4. **Communicate Proactively** - Over-communicate in async environments
5. **Take Breaks** - Avoid burnout with regular breaks

**Common Challenges:**
- Isolation: Schedule virtual coffee chats
- Distractions: Use Pomodoro technique
- Time zones: Be flexible with meeting times

Would you like tips for specific remote work challenges?`;
  }

  return MOCK_ROADMAP_RESPONSES.default(userInput);
}