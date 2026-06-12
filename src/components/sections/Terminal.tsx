"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface CommandLog {
  command: string;
  output: React.ReactNode;
}

export function Terminal() {
  const [history, setHistory] = useState<CommandLog[]>([
    {
      command: "",
      output: (
        <div>
          <pre style={{ color: "#3b82f6", fontStyle: "normal", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.1, margin: 0 }}>
{` ██████╗███████╗██╗██████╗  ██████╗  ██████╗
██╔════╝██╔════╝██║██╔══██╗██╔═══██╗██╔════╝
██║     ███████╗██║██████╔╝██║   ██║██║     
██║     ╚════██║██║██╔═══╝ ██║   ██║██║     
╚██████╗███████║██║██║     ╚██████╔╝╚██████╗
 ╚══════╝╚══════╝╚═╝╚═╝      ╚═════╝  ╚═════╝`}
          </pre>
          <div style={{ marginTop: "10px", color: "#27c93f", fontWeight: "bold" }}>CSI Terminal Shell v1.0.0</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginBottom: "15px" }}>Type "help" to list available commands.</div>
        </div>
      )
    }
  ]);
  const [input, setInput] = useState("");
  const [isMatrix, setIsMatrix] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll to bottom on history change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on click
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Matrix Rain Animation Effect
  useEffect(() => {
    if (!isMatrix) return;
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 500;

    const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabet = katakana.split("");

    const fontSize = 14;
    const columns = canvas.width / fontSize;

    const rainDrops: number[] = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    let animationFrame: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 500;
      const cols = canvas.width / fontSize;
      for (let x = rainDrops.length; x < cols; x++) {
        rainDrops[x] = 1;
      }
    };
    window.addEventListener("resize", handleResize);

    const handleKeyDown = () => {
      setIsMatrix(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleKeyDown);
    };
  }, [isMatrix]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const lowerCmd = cmd.toLowerCase();
    let response: React.ReactNode;

    switch (lowerCmd) {
      case "help":
        response = (
          <div style={{ color: "rgba(255,255,255,0.85)" }}>
            <div style={{ fontWeight: "bold", color: "#3b82f6", marginBottom: "4px" }}>Available Commands:</div>
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px", fontFamily: "monospace" }}>
              <div>help</div><div>Show this commands guide</div>
              <div>about</div><div>Learn about CSI Student Chapter</div>
              <div>projects</div><div>View active projects built by CSI members</div>
              <div>neofetch</div><div>Display system specifications & ASCII logo</div>
              <div>matrix</div><div>Run the digital matrix code rain animation</div>
              <div>whoami</div><div>Show current shell user permissions</div>
              <div>clear</div><div>Clear the terminal window screen</div>
            </div>
          </div>
        );
        break;
      case "about":
        response = (
          <div style={{ color: "rgba(255,255,255,0.8)" }}>
            <span style={{ color: "#3b82f6", fontWeight: "bold" }}>Computer Society of India (CSI) VITC</span> is the premier technical student chapter at VIT Chennai. We are a collective of developers, designers, and system architects building real-world projects. Our mission is to bridge technical academics with open-source development and high-impact engineering.
          </div>
        );
        break;
      case "projects":
        response = (
          <div style={{ color: "rgba(255,255,255,0.8)" }}>
            <div style={{ fontWeight: "bold", color: "#3b82f6", marginBottom: "4px" }}>CSI Production Registry:</div>
            <ul style={{ margin: "0 0 0 16px", padding: 0 }}>
              <li><strong style={{ color: "#27c93f" }}>CampusOS</strong> - Centralized management utility for student workflows.</li>
              <li><strong style={{ color: "#27c93f" }}>SentinelX</strong> - Autonomous threat detection and cyber security laboratory tool.</li>
              <li><strong style={{ color: "#27c93f" }}>LectureLens</strong> - Computer vision tool mapping real-time video transcript analysis.</li>
              <li><strong style={{ color: "#27c93f" }}>Aaroha</strong> - High-fidelity web platform for tech fest registration operations.</li>
            </ul>
          </div>
        );
        break;
      case "whoami":
        response = <div style={{ color: "rgba(255,255,255,0.7)" }}>csi_guest@vitc-desktop (guest shell session)</div>;
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "matrix":
        setIsMatrix(true);
        setInput("");
        return;
      case "neofetch":
        response = (
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <pre style={{ color: "#27c93f", margin: 0, fontSize: "0.85rem", lineHeight: 1.1 }}>
{`   /\\_/\\
  ( o.o )
   > ^ <
  /     \\
 (       )
  \\__*__/`}
            </pre>
            <div style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>
              <div style={{ fontWeight: "bold", color: "#3b82f6" }}>csi_guest@vitc-desktop</div>
              <div>-------------------------</div>
              <div><strong style={{ color: "#27c93f" }}>OS</strong>: CSI VITC Desktop Engine v1.0</div>
              <div><strong style={{ color: "#27c93f" }}>Kernel</strong>: NextJS 16.2.6 (React SSR Setup)</div>
              <div><strong style={{ color: "#27c93f" }}>Shell</strong>: bash 5.2.15</div>
              <div><strong style={{ color: "#27c93f" }}>Uptime</strong>: 1 hour, 42 minutes</div>
              <div><strong style={{ color: "#27c93f" }}>Resolution</strong>: Dynamic CSS Viewports</div>
              <div><strong style={{ color: "#27c93f" }}>WM</strong>: Antigravity Window Manager</div>
              <div><strong style={{ color: "#27c93f" }}>CPU</strong>: Agentic AI Model Core</div>
              <div><strong style={{ color: "#27c93f" }}>Memory</strong>: 2.1 GB / 16.0 GB</div>
            </div>
          </div>
        );
        break;
      default:
        response = <div style={{ color: "#ff5f56" }}>bash: command not found: {cmd}. Type "help" for a list of commands.</div>;
    }

    setHistory((prev) => [...prev, { command: cmd, output: response }]);
    setInput("");
  };

  return (
    <div 
      onClick={handleContainerClick}
      style={{ 
        width: "100%", 
        height: "100%", 
        background: "#08080a", 
        color: "#27c93f", 
        fontFamily: "monospace", 
        fontSize: "0.95rem", 
        padding: "16px", 
        boxSizing: "border-box", 
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {isMatrix ? (
        <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "black" }}>
          <canvas ref={matrixCanvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
          <div style={{ position: "absolute", bottom: "16px", left: "16px", color: "rgba(0,255,0,0.5)", fontSize: "0.8rem", pointerEvents: "none" }}>
            Press any key or click to exit Matrix Rain
          </div>
        </div>
      ) : null}

      <div 
        ref={containerRef}
        style={{ 
          flex: 1, 
          overflowY: "auto", 
          display: "flex", 
          flexDirection: "column", 
          gap: "10px",
          paddingBottom: "10px"
        }}
      >
        {history.map((h, index) => (
          <div key={index} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {h.command && (
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ color: "#3b82f6" }}>csi-admin@vitc:~$</span>
                <span style={{ color: "#F0EBE1" }}>{h.command}</span>
              </div>
            )}
            <div>{h.output}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleCommand} style={{ display: "flex", gap: "8px", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "10px", flexShrink: 0 }}>
        <span style={{ color: "#3b82f6", flexShrink: 0 }}>csi-admin@vitc:~$</span>
        <input 
          ref={inputRef}
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          style={{ 
            flex: 1, 
            background: "transparent", 
            border: "none", 
            outline: "none", 
            color: "#F0EBE1", 
            fontFamily: "monospace", 
            fontSize: "0.95rem" 
          }}
        />
      </form>
    </div>
  );
}
