import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// === Health Check API ===
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is working ✅" });
});

// === Gemini client ===
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// === Summarize API ===
app.post("/summarize", async (req, res) => {
  try {
    const { transcript, instruction } = req.body;
    if (!transcript) return res.status(400).json({ error: "Transcript required" });

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    });

    const prompt = `
You are a meeting summarizer. Always produce clear, structured output (bullets, sections, action items).

Instruction: ${instruction}
Transcript:
${transcript}
`;

    const result = await model.generateContent(prompt);
    const summary =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Summarization failed" });
  }
});

// === Email API ===
app.post("/email", async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    if (!to?.length) return res.status(400).json({ error: "Recipients required" });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "Summarizer <noreply@example.com>",
      to: to.join(","),
      subject,
      html,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email sending failed" });
  }
});
if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}


// ✅ Export app for Vercel
export default app;
