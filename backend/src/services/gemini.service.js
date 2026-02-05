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

// Extract text from image using Gemini Vision
exports.extractTextFromImage = async (base64Image, mimeType = 'image/jpeg') => {
  try {
    // Remove data URL prefix if present
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
    
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: imageData
        }
      },
      `Extract ALL text visible in this image. 
       - Return ONLY the extracted text, nothing else
       - Preserve the original formatting and line breaks
       - If there are multiple languages, extract text in all languages
       - If no text is found, return "No text detected in image"
       - Do not add any explanations or additional content`
    ]);
    
    return result.response.text().trim();
  } catch (err) {
    console.error('OCR Error:', err);
    throw new Error('Failed to extract text from image');
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