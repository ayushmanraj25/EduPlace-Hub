const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const supabase = require("../config/supabase");

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are a helpful AI tutor. 
    The user wants study notes on the topic: "{prompt}".
    Provide a clear, simple, and well-structured explanation with bullet points and key takeaways.
    Focus on helping the student understand the core concepts quickly.`;

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
module.exports = router;
