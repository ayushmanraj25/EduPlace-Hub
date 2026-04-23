const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const supabase = require("../config/supabase");

// Frontend se prompt lega
// Gemini AI se notes generate karega
// Optional: Supabase me save karega
// // Response frontend ko bhejega

router.post("/generate", async (req, res) => {
  try {
    const { prompt, userId } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required." });
    }
    let apiKey = (process.env.GEMINI_API_KEY || process.env.AI_API_KEY || "").trim();
    if (!apiKey || apiKey === "your_ai_key") {
      return res.status(500).json({ 
        message: "API Key Missing. Please get a free key from Google AI Studio and put it in backend/.env as GEMINI_API_KEY=your_key" 
      });
    }
    // AI client create
    // model select (fast + cheap)
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are an intelligent, helpful, and conversational AI assistant for a student platform called EduPlace-Hub. 
    User query: "{prompt}"
    
    Instructions:
    1. Answer smartly and naturally, similar to how ChatGPT would casually converse.
    2. Keep your answers concise and direct. Do not provide a massive "Study Notes" structure with long bullet points unless the user explicitly asks for "detailed notes" or a "long explanation".
    3. If the user asks a simple question, give a simple short answer.
    4. Only use formatting (like bolding or bullets) if it genuinely helps readability for a short answer.`;

    const finalPrompt = systemPrompt.replace("{prompt}", prompt);

    try {
      const result = await model.generateContent(finalPrompt);
      const response = await result.response;
      const text = response.text();

      // Automatically save to Supabase if userId is provided
      if (userId && process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && supabase) {
        try {
          await supabase
            .from('notes')
            .insert([{ 
              subject: "AI Synthesis", 
              topic: prompt.substring(0, 50), 
              content: text, 
              user_id: userId 
            }]);
        } catch (dbErr) {
          console.warn("AI Note save to Supabase failed silently:", dbErr.message);
        }
      }

      res.status(200).json({ notes: text });
    } catch (apiError) {
       console.error("GOOGLE AI SDK ERROR:", apiError);
       res.status(500).json({ 
         message: apiError.status === 429 
           ? "AI Quota Exceeded. Please try again later or update your API key."
           : "AI Engine Failed at Generation Layer", 
         error: apiError.message,
         status: apiError.status || 500
       });
    }
  } catch (error) {
    console.error("AI ROUTE CRITICAL ERROR:", error);
    res.status(500).json({ message: "AI Engine Failed to generate notes. Please check API Key limits or server logs." });
  }
});

// POST /api/ai/format-bulk - Formats a raw block of questions and hints into a structured JSON array
router.post("/format-bulk", async (req, res) => {
  try {
    const { questionsText, hintsText } = req.body;

    if (!questionsText || !hintsText) {
      return res.status(400).json({ message: "both questionsText and hintsText are required." });
    }

    let apiKey = (process.env.GEMINI_API_KEY || process.env.AI_API_KEY || "").trim();
    if (!apiKey || apiKey === "your_ai_key") {
      return res.status(500).json({ message: "API Key Missing." });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use flash model, but instruct it to return strictly JSON
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const finalPrompt = `You are a backend data formatter.

The following input contains multiple interview questions and their corresponding answers/hints written together in a single block.

Your task:
1. Split the questions using patterns like Q1, Q2, Q3, etc.
2. Split the hints/answers accordingly in the same order.
3. Each question must match with its correct hint.
4. Remove numbering like Q1, Q2.
5. Clean the text.

Return the output in JSON format like this:
[
  {
    "question": "Question text here",
    "hint": "Hint or answer here"
  }
]

IMPORTANT:
- Number of questions and hints must match
- Keep order same
- Do not merge everything into one
- Do not skip any item

Questions:
"${questionsText}"

Hints:
"${hintsText}"`;

    try {
      const result = await model.generateContent(finalPrompt);
      const response = await result.response;
      const text = response.text();
      
      const parsedData = JSON.parse(text);
      res.status(200).json({ data: parsedData });
    } catch (apiError) {
       console.error("GOOGLE AI PARSING ERROR:", apiError);
       res.status(500).json({ message: "Failed at AI string parsing layer", error: apiError.message });
    }
  } catch (error) {
    console.error("AI ROUTE BULK CRITICAL ERROR:", error);
    res.status(500).json({ message: "AI Engine Failed to format bulk data." });
  }
});

module.exports = router;
