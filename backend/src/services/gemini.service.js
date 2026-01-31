const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

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
OUTPUT FORMAT: Bullet points + actionable steps.
`;