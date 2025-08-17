import { useState, useRef } from "react";

function App() {
  const [transcript, setTranscript] = useState("");
  const [instruction, setInstruction] = useState(
    "Summarize in bullet points with action items."
  );
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("Meeting Summary");
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    const text = await file.text();
    setTranscript((t) => (t ? t + "\n\n" + text : text));
  };

  const generateSummary = async () => {
    if (!transcript.trim()) return alert("Provide a transcript");
    setLoading(true);
    try {
      const res = await fetch("https://sumarizemeet.onrender.com/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, instruction }),
      });
      const data = await res.json();
      setSummary(data.summary || "");
    } catch (err) {
      alert("Error generating summary");
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    const recipients = emailTo.split(/[, ]+/).filter(Boolean);
    if (!recipients.length) return alert("Enter at least one recipient");

    try {
      const res = await fetch("https://sumarizemeet.onrender.com/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipients,
          subject: emailSubject,
          html: summary.replace(/\n/g, "<br/>"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("Email sent!");
    } catch (err) {
      alert("Error sending email");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", padding: 20 }}>
      <h1>AI Meeting Notes Summarizer</h1>

      <h3>Transcript</h3>
      <textarea
        rows={8}
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />
      <div>
        <button onClick={() => fileRef.current.click()}>Upload .txt</button>
        <input
          ref={fileRef}
          type="file"
          accept="text/plain"
          hidden
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />
      </div>

      <h3>Instruction</h3>
      <textarea
        rows={3}
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />

      <button onClick={generateSummary} disabled={loading}>
        {loading ? "Generating..." : "Generate Summary"}
      </button>

      <h3>Editable Summary</h3>
      <textarea
        rows={8}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />
      
      <h3>Share via Email</h3>
      <input
        type="text"
        placeholder="Recipients (comma separated)"
        value={emailTo}
        onChange={(e) => setEmailTo(e.target.value)}
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
      />
      <input
        type="text"
        placeholder="Subject"
        value={emailSubject}
        onChange={(e) => setEmailSubject(e.target.value)}
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
      />
      <button onClick={sendEmail}>Send Email</button>
    </div>
  );
}

export default App;
