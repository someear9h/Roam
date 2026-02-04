const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

exports.generateContent = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error(err);
    return 'Error generating response. Please try again.';
  }
};

exports.buildPrompt = (system, context, userQuery) => `
SYSTEM: ${system}
CONTEXT: ${JSON.stringify(context)}
USER: ${userQuery}

IMPORTANT FORMATTING RULES:
- Use proper markdown formatting for your response
- Use **bold** for important terms and headings
- Use bullet points (- ) for lists
- Use numbered lists (1. ) for steps
- Keep responses concise and well-organized
- Break up long responses into clear sections
- Use emojis sparingly for visual appeal

OUTPUT: Provide a helpful, well-formatted response.
`;