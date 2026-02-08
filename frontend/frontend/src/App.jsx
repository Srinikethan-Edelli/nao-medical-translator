import { useEffect, useState } from "react";
import api from "./api";
import "./index.css";


let audioContext;
let processor;
let inputNode;
let globalStream;
let recordedChunks = [];

function App() {
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [role, setRole] = useState("doctor");
  const [language, setLanguage] = useState("Spanish");

  const [recording, setRecording] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);


  // ----------------------------
  // LOAD / CREATE CONVERSATION
  // ----------------------------
  useEffect(() => {
    const savedId = localStorage.getItem("conversation_id");

    if (savedId) {
      setConversationId(savedId);

      api.get(`messages/${savedId}/`).then((r) => {
        setMessages(r.data);
      });
    } else {
      api.post("conversation/").then((res) => {
        const id = res.data.conversation_id;
        localStorage.setItem("conversation_id", id);
        setConversationId(id);
      });
    }
  }, []);

  // ----------------------------
  // SEND TEXT MESSAGE
  // ----------------------------
  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;

    const res = await api.post("message/", {
      text: input,
      role,
      target_language: language,
      conversation_id: conversationId,
    });

    setMessages((prev) => [
      ...prev,
      {
        role,
        original: input,
        translated: res.data.translated,
      },
    ]);

    setInput("");
  };

  // ----------------------------
  // AUDIO RECORDING (WAV SAFE)
  // ----------------------------
  const startRecording = async () => {
    if (!conversationId) return;

    globalStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    audioContext = new AudioContext();

    inputNode = audioContext.createMediaStreamSource(globalStream);

    processor = audioContext.createScriptProcessor(4096, 1, 1);

    recordedChunks = [];

    processor.onaudioprocess = (e) => {
      recordedChunks.push(
        new Float32Array(e.inputBuffer.getChannelData(0))
      );
    };

    inputNode.connect(processor);
    processor.connect(audioContext.destination);

    setRecording(true);
  };

  const stopRecording = async () => {
    if (!processor) return;

    processor.disconnect();
    inputNode.disconnect();

    globalStream.getTracks().forEach((t) => t.stop());

    const buffer = flattenArray(recordedChunks);

    const wavBlob = encodeWAV(buffer, audioContext.sampleRate);

    const file = new File([wavBlob], "recording.wav", {
      type: "audio/wav",
    });

    const formData = new FormData();
    formData.append("audio", file);
    formData.append("role", role);
    formData.append("conversation_id", conversationId);

    const res = await api.post("audio/", formData);

    setMessages((prev) => [
      ...prev,
      {
        role,
        audio: res.data.audio_url,
      },
    ]);

    setRecording(false);
  };

  // ----------------------------
  // SEARCH
  // ----------------------------
  const runSearch = async () => {
    if (!searchTerm || !conversationId) {
      setSearchResults([]);
      return;
    }

    const res = await api.get("search/", {
      params: {
        q: searchTerm,
        conversation_id: conversationId,
      },
    });

    setSearchResults(res.data);
  };

  const highlightText = (text, term) => {
    if (!text || !term) return text;

    const regex = new RegExp(`(${term})`, "gi");

    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };



  const generateSummary = async () => {
  if (!conversationId) return;

  setLoadingSummary(true);

  try {
    const res = await api.post("summary/", {
      conversation_id: conversationId,
    });

    setSummary(res.data.summary);
  } catch (err) {
    console.error("Summary failed", err);
    setSummary("⚠ Unable to generate summary right now.");
  }

  setLoadingSummary(false);
};



  // ----------------------------
  // UI
  // ----------------------------
  return (
  <div className="page-wrapper">
    <div className="app-shell">

      <h1 className="app-title">Doctor–Patient Translator</h1>

      {/* TOP CONTROLS */}
      <div className="top-controls">

        <div className="control-row">
          <span>Role:</span>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>

          <span>Target Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>Spanish</option>
            <option>Hindi</option>
            <option>French</option>
          </select>
        </div>

        <div className="control-row">
          <input
            placeholder="Search conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={runSearch}>Search</button>
        </div>

        <button onClick={generateSummary}>
          {loadingSummary ? "Generating Summary..." : "📋 Generate Summary"}
        </button>

        {summary && (
          <div className="summary-box">
            <strong>Conversation Summary</strong>
            <p>{summary}</p>
          </div>
        )}

      </div>

      {/* CHAT */}
      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <strong>{m.role}:</strong>{" "}
            {highlightText(m.original, searchTerm)}

            {m.translated && (
              <small>
                {highlightText(m.translated, searchTerm)}
              </small>
            )}

            {m.audio && (
              <audio
                controls
                preload="auto"
                src={`http://127.0.0.1:8000${m.audio}`}
                style={{ marginTop: 6 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* AUDIO */}
      <div className="record-row">
        {!recording ? (
          <button onClick={startRecording}>🎙 Start Recording</button>
        ) : (
          <button className="secondary-btn" onClick={stopRecording}>
            ⏹ Stop
          </button>
        )}
      </div>

    </div>
  </div>
);
}

// ===================================================
// WAV ENCODER HELPERS
// ===================================================

function flattenArray(channelBuffer) {
  let length = 0;
  channelBuffer.forEach((b) => (length += b.length));

  const result = new Float32Array(length);
  let offset = 0;

  channelBuffer.forEach((b) => {
    result.set(b, offset);
    offset += b.length;
  });

  return result;
}

function encodeWAV(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, "WAVE");

  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);

  writeString(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(view, 44, samples);

  return new Blob([view], { type: "audio/wav" });
}

function floatTo16BitPCM(view, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export default App;
