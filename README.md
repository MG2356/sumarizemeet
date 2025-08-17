
---

# 📌 Frontend README (`/frontend/README.md`)

```markdown
# AI Meeting Notes Summarizer – Frontend

This is the **frontend React app** for the AI-powered Meeting Notes Summarizer & Sharer.  
It allows users to:
- Upload/paste transcripts
- Enter custom summarization instructions
- Generate summaries using the backend API
- Edit summaries
- Share via email

---

## 🚀 Tech Stack
- **React.js**
- **Axios** (API calls)
- **TailwindCSS** (UI styling)
- **Framer Motion** (animations)

---

## 🖥️ Features

1. **Transcript Input**  
   Paste or upload meeting transcript text.

2. **Custom Instructions**  
   Example: `"Summarize in bullet points for executives"`

3. **Generate Summary**  
   Calls `/api/summarize` on backend → AI summary returned.

4. **Editable Summary**  
   User can refine the AI output manually.

5. **Email Share**  
   Sends summary to recipients via `/api/email`.

---

## 📡 API Integration

The frontend calls the backend APIs:

- **Summarize** → `POST /api/summarize`
- **Email** → `POST /api/email`

---

## ✅ Notes
- The app is designed for seamless collaboration with the backend.  
- Backend must be running for the summarization and email features to work.


# AI Meeting Notes Summarizer – Backend

This is the **backend service** for the AI-powered Meeting Notes Summarizer & Emailer.  
It provides APIs to:
- Generate summaries from transcripts using **Google Gemini API**
- Send summaries via email using **SMTP (Nodemailer)**

---

## 🚀 Tech Stack
- **Node.js + Express**
- **Google Generative AI (Gemini API)**
- **Nodemailer** (SMTP email)
- **CORS + body-parser**

---

## 📡 API Endpoints

### **POST** `/api/summarize`
Generate a summary from transcript + instruction.

**Request:**
```json
{
  "transcript": "Meeting discussion transcript...",
  "instruction": "Summarize in bullet points with action items."
}
