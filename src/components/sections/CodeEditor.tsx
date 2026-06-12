"use client";

import React, { useState, useRef } from "react";
import { Play, RotateCcw, AlertTriangle } from "lucide-react";

const DEFAULT_CODE = `// CSI Cryptography Teaser Challenge
// Task: Fix the decryption function to unlock the hidden event!
// Hint: Check Finder -> Statistics to find how many years CSI VITC is strong. That is the key!

function decryptSecret(cipherText, key) {
  let plainText = "";
  for (let i = 0; i < cipherText.length; i++) {
    let code = cipherText.charCodeAt(i);
    // BUG: The decryption offset is wrong!
    // It should subtract the key from the code, but it is currently adding it.
    plainText += String.fromCharCode(code + key); 
  }
  return plainText;
}

const cipher = "JK\\\\YVGIK&NGIQGZNUT&[TRUIQKJ'";
console.log(decryptSecret(cipher, 6));`;

interface CodeEditorProps {
  onUnlockChallenge?: () => void;
}

export function CodeEditor({ onUnlockChallenge }: CodeEditorProps) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "CSI Code Editor Challenge v1.0",
    "Press 'Run Code' to execute the script..."
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setConsoleOutput(["Running challenge.js..."]);

    setTimeout(() => {
      // Analyze code content for the correct fix
      const normalizedCode = code.replace(/\s+/g, "");
      
      // The user must change code + key to code - key OR code - 6, etc.
      const hasMinusFix = normalizedCode.includes("code-key") || 
                          normalizedCode.includes("code-6") || 
                          normalizedCode.includes("charCodeAt(i)-key") || 
                          normalizedCode.includes("charCodeAt(i)-6");

      if (hasMinusFix) {
        setConsoleOutput([
          "> node challenge.js",
          "Decryption successful! Event unlocked! 🎉",
          "----------------------------------------------",
          "🎉 HIDDEN EVENT: DEVSPACE HACKATHON 2026",
          "📅 DATE: June 14 - 15, 2026",
          "📍 VENUE: Netaji Auditorium, VIT Chennai",
          "🔑 REGISTRATION PASSCODE: CSICRAFT2026",
          "----------------------------------------------",
          "[SYSTEM] VIP Ticket has been unlocked on the Desktop!"
        ]);
        if (onUnlockChallenge) {
          onUnlockChallenge();
        }
      } else {
        // Run buggy output simulation
        const isModified = code !== DEFAULT_CODE;
        if (!isModified || normalizedCode.includes("code+key") || normalizedCode.includes("code+6")) {
          setConsoleOutput([
            "> node challenge.js",
            "Decrypted String: PQb_bMSQ,TMOWMFTEZ,`TRaOQKP]",
            "----------------------------------------------",
            "Result: ACCESS DENIED.",
            "Hint: The statistics page says CSI is 6 years strong.",
            "Find and fix the decryption offset inside the loop (+ key vs - key)!"
          ]);
        } else {
          setConsoleOutput([
            "> node challenge.js",
            "SyntaxError: Invalid decryption offset formula.",
            "Hint: Subtract the key ( - 6 ) from the character code to decrypt correctly!"
          ]);
        }
      }
      setIsRunning(false);
    }, 1200);
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setConsoleOutput([
      "Editor reset to default code.",
      "Press 'Run Code' to execute the script..."
    ]);
  };

  return (
    <div 
      style={{
        width: "100%",
        height: "100%",
        background: "#0c0c0f",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
        overflow: "hidden"
      }}
    >
      {/* Editor Toolbar */}
      <div 
        style={{
          height: "44px",
          background: "#16161c",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          justifyContent: "space-between",
          flexShrink: 0
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>challenge.js - JavaScript</span>
        
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleReset}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: "#F0EBE1",
              padding: "4px 12px",
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            <RotateCcw size={12} />
            Reset
          </button>
          
          <button
            onClick={handleRun}
            disabled={isRunning}
            style={{
              background: "#27c93f",
              border: "none",
              borderRadius: "6px",
              color: "#0a0a0a",
              padding: "4px 16px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "opacity 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            <Play size={12} fill="currentColor" />
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Code Input */}
        <div style={{ flex: 2, display: "flex", position: "relative", minHeight: "150px" }}>
          {/* Line Numbers gutter */}
          <div 
            style={{
              width: "44px",
              background: "#0c0c0f",
              borderRight: "1px solid rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.2)",
              textAlign: "right",
              padding: "16px 8px 0 0",
              fontSize: "0.9rem",
              lineHeight: "1.5rem",
              userSelect: "none",
              boxSizing: "border-box"
            }}
          >
            {Array.from({ length: 22 }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#abb2bf",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "0.9rem",
              lineHeight: "1.5rem",
              padding: "16px",
              resize: "none",
              boxSizing: "border-box",
              tabSize: 2
            }}
          />
        </div>

        {/* Console Panel */}
        <div 
          style={{
            height: "150px",
            background: "#08080a",
            borderTop: "2px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0
          }}
        >
          <div 
            style={{
              height: "28px",
              background: "#121215",
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.4)",
              borderBottom: "1px solid rgba(255,255,255,0.05)"
            }}
          >
            Console Output
          </div>
          <div 
            style={{
              flex: 1,
              padding: "10px 16px",
              overflowY: "auto",
              color: "#a3b8cc",
              fontSize: "0.85rem",
              lineHeight: "1.3rem",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}
          >
            {consoleOutput.map((line, idx) => {
              const isHighlight = line.includes("🎉") || line.includes("successful");
              const isError = line.includes("DENIED") || line.includes("Error");
              const isCodeLine = line.startsWith("-");
              return (
                <div 
                  key={idx} 
                  style={{ 
                    color: isHighlight ? "#27c93f" : isError ? "#ff5f56" : isCodeLine ? "#3b82f6" : "#a3b8cc",
                    fontWeight: isHighlight ? "bold" : "normal"
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
