import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";  
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/overlays";

function App() {
  const [overlays, setOverlays] = useState([]);
  const [rtspUrl, setRtspUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [form, setForm] = useState({ content: "", type: "text" });

  useEffect(() => {
    fetchOverlays();
  }, []);

  const fetchOverlays = async () => {
    try {
      const res = await axios.get(API_URL);
      setOverlays(res.data);
    } catch (err) {
      console.error("Error fetching overlays:", err);
    }
  };

  const addOverlay = async () => {
    if (!form.content) return alert("Please enter content");
    const newOverlay = {
      content: form.content,
      type: form.type,
      x: 50, 
      y: 50,
      width: 150,
      height: 50
    };
    await axios.post(API_URL, newOverlay);
    setForm({ content: "", type: "text" }); 
    fetchOverlays(); 
  };

  const updateOverlay = async (id, data) => {
    
    setOverlays((prevOverlays) =>
      prevOverlays.map((item) =>
        item._id === id ? { ...item, ...data } : item
      )
    );

    try {
      await axios.put(`${API_URL}/${id}`, data);
    } catch (err) {
      console.error("Failed to save position", err);
    }
  };

  const deleteOverlay = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchOverlays();
  };

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>RTSP Livestream Overlay App</h1>

      <div className="control-panel">
        <h3>1. Stream Setup</h3>
        <p>Enter an HTTP-compatible RTSP stream URL (e.g., from RTSP.me)</p>
        <input
          style={{ width: "300px", padding: "8px" }}
          placeholder="Paste Stream URL here..."
          value={rtspUrl}
          onChange={(e) => setRtspUrl(e.target.value)}
        />
        <button className="btn-primary"
          onClick={() => setIsPlaying(true)}
          style={{ marginLeft: "10px", padding: "8px 15px", cursor: "pointer" }}
        >
          Play Stream
        </button>
      </div>

      <div className="control-panel"
        style={{
          position: "relative",
          width: "640px",
          height: "360px",
          backgroundColor: "black",
          margin: "0 auto",
          overflow: "hidden"
        }}
      >
        {isPlaying ? (
          <video
            src={rtspUrl}
            width="100%"
            height="100%"
            controls
            autoPlay
            style={{ objectFit: "contain" }}
          />
        ) : (
          <div style={{ color: "white", paddingTop: "150px" }}>Video Player Ready</div>
        )}

        {overlays.map((item) => (
          <Rnd
            key={item._id}
            size={{ width: item.width, height: item.height }}
            position={{ x: item.x, y: item.y }}
            bounds="parent" 
            onDragStop={(e, d) => {
              updateOverlay(item._id, { x: d.x, y: d.y }); 
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateOverlay(item._id, {
                width: ref.style.width,
                height: ref.style.height,
                ...position,
              }); 
            }}
            style={{
              border: "1px dashed cyan",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white"
            }}
          >
            {item.type === "image" ? (
              <img src={item.content} alt="overlay" style={{ width: "100%", height: "100%" }} />
            ) : (
              <span>{item.content}</span>
            )}

            <button className="btn-delete"
              onClick={() => deleteOverlay(item._id)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "red",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              x
            </button>
          </Rnd>
        ))}
      </div>

      <div className="control-panel" style={{ marginTop: "20px", padding: "10px" }}>
        <h3>2. Manage Overlays</h3>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          style={{ padding: "8px" }}
        >
          <option value="text">Text Overlay</option>
          <option value="image">Image Overlay</option>
        </select>
        <input
          type="text"
          placeholder={form.type === "image" ? "Enter Image URL" : "Enter Text"}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          style={{ marginLeft: "10px", width: "300px", padding: "8px" }}
        />
        <button className="btn-primary"
          onClick={addOverlay}
          style={{ marginLeft: "10px", padding: "8px 15px", cursor: "pointer" }}
        >
          Create Overlay
        </button>
      </div>
    </div>
  );
}

export default App;