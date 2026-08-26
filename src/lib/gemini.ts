export async function generateHeadline(content: string) {
  const res = await fetch("/api/gemini/generate-headline", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to generate headline");
  return res.json();
}

export async function summarizeArticle(content: string, lang?: string) {
  const res = await fetch("/api/gemini/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, lang }),
  });
  if (!res.ok) throw new Error("Failed to summarize");
  return res.json();
}

export async function translateText(text: string, targetLang: string) {
  const res = await fetch("/api/gemini/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, targetLang }),
  });
  if (!res.ok) throw new Error("Failed to translate");
  return res.json();
}

export async function factCheckArticle(title: string, content: string) {
  const res = await fetch("/api/gemini/fact-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error("Failed to fact-check");
  return res.json();
}

export async function chatWithAI(message: string, history?: any[]) {
  const res = await fetch("/api/gemini/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error("Failed to send message to AI");
  return res.json();
}
