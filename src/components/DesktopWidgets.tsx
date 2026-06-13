"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function DesktopWidgets() {
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [mounted, setMounted] = useState(false);

  // Simulated metrics
  const [cpu, setCpu] = useState(14);
  const [ram, setRam] = useState(48);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }));
      setDateStr(now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" }));
    };
    updateTime();
    const clockTimer = setInterval(updateTime, 1000);

    const metricsTimer = setInterval(() => {
      setCpu(Math.floor(10 + Math.random() * 15)); // fluctuating between 10-25%
      setRam(Math.floor(45 + Math.random() * 5));  // fluctuating between 45-50%
    }, 3000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(metricsTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div 
      style={{
        position: "absolute",
        top: "30px",
        left: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        zIndex: 5,
        pointerEvents: "auto",
        width: "280px"
      }}
    >
      {/* Clock & System Widget */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          padding: "20px",
          color: "#F0EBE1",
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          cursor: "default",
          userSelect: "none"
        }}
      >
        <div>
          <div style={{ fontSize: "2.4rem", fontWeight: 700, fontFamily: "var(--font-anton), sans-serif", letterSpacing: "1px", lineHeight: 1.1 }}>
            {time}
          </div>
          <div style={{ fontSize: "0.85rem", color: "rgba(240, 235, 225, 0.6)", fontWeight: 500, marginTop: "2px" }}>
            {dateStr}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)", marginBottom: "4px" }}>
              <span>CPU Core</span>
              <span>{cpu}%</span>
            </div>
            <div style={{ width: "100%", height: "4px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "2px", overflow: "hidden" }}>
              <motion.div animate={{ width: `${cpu}%` }} transition={{ duration: 0.8 }} style={{ height: "100%", background: "#27c93f", borderRadius: "2px" }} />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)", marginBottom: "4px" }}>
              <span>Memory Usage</span>
              <span>{ram}%</span>
            </div>
            <div style={{ width: "100%", height: "4px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "2px", overflow: "hidden" }}>
              <motion.div animate={{ width: `${ram}%` }} transition={{ duration: 0.8 }} style={{ height: "100%", background: "#3b82f6", borderRadius: "2px" }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* CSI Events Calendar Widget */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          padding: "20px",
          color: "#F0EBE1",
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          cursor: "default",
          userSelect: "none"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "10px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#3b82f6" }}>CSI Scheduler</span>
          <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)" }}>June 2026</span>
        </div>

        {/* Calendar Grid representation (June 2026 starting on Mon) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px", textAlign: "center", fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.4)" }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i} style={{ fontWeight: 700 }}>{d}</div>)}
          {Array.from({ length: 30 }).map((_, i) => {
            const dayNum = i + 1;
            const isToday = dayNum === 12; // Let's mark June 12 as current date
            const isEvent = dayNum === 14; // Event on June 14
            return (
              <div 
                key={i} 
                style={{ 
                  padding: "4px 0",
                  borderRadius: "50%",
                  color: isToday ? "#0a0a0a" : isEvent ? "#3b82f6" : "#F0EBE1",
                  background: isToday ? "#F0EBE1" : isEvent ? "rgba(59, 130, 246, 0.15)" : "transparent",
                  fontWeight: isToday || isEvent ? "bold" : "normal",
                  border: isEvent ? "1px solid rgba(59, 130, 246, 0.4)" : "none"
                }}
              >
                {dayNum}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", background: "rgba(255, 255, 255, 0.03)", padding: "10px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>Next Event:</div>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#3b82f6" }}>DevSpace Hackathon</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>June 14 • 2 days remaining</div>
        </div>
      </motion.div>
    </div>
  );
}
