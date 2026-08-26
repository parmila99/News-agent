import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini with process.env.GEMINI_API_KEY
const getGeminiClient = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// API Routes
app.post("/api/gemini/generate-headline", async (req, res) => {
  try {
    const { content } = req.body;
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an elite chief editor at Rajbanshi Global News Network (RGNN). Generate 3 catchy, professional, SEO-optimized headlines (one direct, one analytical, one breaking-style) for the following news text:
${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: "The best primary headline" },
            alternativeHeadlines: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["headline", "alternativeHeadlines"]
        }
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("AI Headline Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate headline" });
  }
});

app.post("/api/gemini/summarize", async (req, res) => {
  try {
    const { content, lang } = req.body;
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a concise, 3-bullet point executive news brief and a 2-sentence quick summary in ${lang || 'English'} for this article:
${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brief: { type: Type.STRING, description: "Short 2-sentence summary" },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["brief", "keyTakeaways"]
        }
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("AI Summarize Error:", error);
    res.status(500).json({ error: error.message || "Failed to summarize" });
  }
});

app.post("/api/gemini/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Translate the following news article text professionally and accurately to ${targetLang} (support English, Nepali, Hindi, Rajbanshi language dialects, or Bengali):
${text}`,
    });
    res.json({ translatedText: response.text });
  } catch (error: any) {
    console.error("AI Translate Error:", error);
    res.status(500).json({ error: error.message || "Failed to translate" });
  }
});

app.post("/api/gemini/fact-check", async (req, res) => {
  try {
    const { title, content } = req.body;
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this news submission for journalistic integrity, sensationalism, potential misinformation, and source credibility:
Headline: ${title}
Content: ${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            credibilityScore: { type: Type.NUMBER, description: "Score from 0 to 100" },
            verdict: { type: Type.STRING, description: "e.g., Highly Credible, Needs Source Verification, Sensationalist Tone" },
            analysis: { type: Type.STRING },
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["credibilityScore", "verdict", "analysis", "redFlags"]
        }
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("AI Fact Check Error:", error);
    res.status(500).json({ error: error.message || "Failed to fact-check" });
  }
});

app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are RGNN AI Assistant, a world-class investigative news assistant for the Rajbanshi Global News Network (RGNN), founded by Rahul Prasad Rajbanshi. 
Answer user questions regarding world news, Nepal/South Asia affairs, technology, economy, and platform features objectively, concisely, and with journalistic rigor.
User message: ${message}`,
    });
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to chat" });
  }
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RGNN Server running on http://localhost:${PORT}`);
  });
});
