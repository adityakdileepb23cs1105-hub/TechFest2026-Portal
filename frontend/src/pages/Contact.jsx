import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [feedbackList, setFeedbackList] = useState([]);
  const [status, setStatus] = useState("");
  const [xssDemoOutput, setXssDemoOutput] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  async function fetchFeedback() {
    try {
      const res = await axios.get(`${API}/feedback`);
      setFeedbackList(res.data);
    } catch {
      // In standalone or offline mode
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Submitting feedback...");
    try {
      const res = await axios.post(`${API}/feedback`, formData);
      setStatus(res.data.message || "Feedback submitted safely!");
      setFormData({ name: "", email: "", message: "" });
      fetchFeedback();
    } catch (err) {
      const msg = err.response?.data?.message || "Error submitting feedback";
      setStatus(msg);
    }
  }

  function runXssDemonstration() {
    // Demonstration of raw injection vs sanitized text rendering
    const attackPayload = "<script>alert('XSS Exploit Attempt')</script><b>Injected Payload</b>";
    setXssDemoOutput(attackPayload);
  }

  return (
    <div className="page" style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <h1>Contact & Feedback</h1>
      <p>MBCET Campus, Thiruvananthapuram | Email: techfest2026@mbcet.ac.in | Phone: +91 98765 43210</p>

      {/* Security Demonstration Box (Manual Step 4) */}
      <div style={{ background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: "8px", padding: "1rem", margin: "1.5rem 0" }}>
        <h3>Security Audit: OWASP A03 (XSS Prevention Verification)</h3>
        <p style={{ fontSize: "0.9rem" }}>
          Try submitting: <code>&lt;script&gt;alert(&#39;hi&#39;)&lt;/script&gt;</code> into the feedback box.
        </p>
        <button type="button" onClick={runXssDemonstration} style={{ marginRight: "0.5rem" }}>
          Simulate Inputting XSS Payload
        </button>
        {xssDemoOutput && (
          <div style={{ marginTop: "1rem", background: "#fff", padding: "0.75rem", borderRadius: "4px", border: "1px solid #ccc" }}>
            <strong>Raw Input Payload:</strong> <code>{xssDemoOutput}</code>
            <p><strong>Safe React DOM Rendering (Escaped):</strong></p>
            {/* React automatically escapes all string variables rendered in JSX */}
            <div style={{ color: "#065f46", fontWeight: "bold" }}>{xssDemoOutput}</div>
            <small style={{ color: "#4b5563" }}>
              Notice that the script did not execute as active JavaScript because React treats strings in JSX as safe plain text, and express-validator escapes HTML tags.
            </small>
          </div>
        )}
      </div>

      <h2>Leave Feedback / Inquiry</h2>
      {status && <p style={{ padding: "0.5rem", background: "#f0fdf4", color: "#166534", borderRadius: "4px" }}>{status}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div>
          <label htmlFor="contact-name" style={{ display: "block", marginBottom: "0.25rem" }}>Full Name:</label>
          <input
            id="contact-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. John Doe"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label htmlFor="contact-email" style={{ display: "block", marginBottom: "0.25rem" }}>Email Address:</label>
          <input
            id="contact-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. student@mbcet.ac.in"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label htmlFor="contact-msg" style={{ display: "block", marginBottom: "0.25rem" }}>Feedback / Message:</label>
          <textarea
            id="contact-msg"
            rows="4"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Type your message or test payload here..."
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button type="submit" style={{ padding: "0.6rem 1.2rem", alignSelf: "flex-start" }}>
          Submit Feedback
        </button>
      </form>

      {feedbackList.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Recent Verified Feedback</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {feedbackList.map((item, idx) => (
              <li key={idx} style={{ borderBottom: "1px solid #eee", padding: "0.5rem 0" }}>
                <strong>{item.name}</strong> ({item.email}):
                <div>{item.message}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Contact;
