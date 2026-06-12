"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Menubar({ 
  activeApp, 
  onControlCenterToggle, 
  onSearchToggle 
}: { 
  activeApp: string; 
  onControlCenterToggle?: () => void; 
  onSearchToggle?: () => void;
}) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "8px",
        left: "12px",
        right: "12px",
        height: "32px",
        background: "rgba(25, 25, 25, 0.45)",
        backdropFilter: "blur(32px) saturate(200%) brightness(105%)",
        WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(105%)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        justifyContent: "space-between",
        zIndex: 1000,
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        fontSize: "13px",
        fontWeight: 500,
        color: "rgba(255, 255, 255, 0.95)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Noise texture for menubar */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.02,
        pointerEvents: "none",
        borderRadius: "inherit",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ fontWeight: 800, fontSize: "15px", cursor: "pointer" }}></div>
        <div style={{ fontWeight: 700, cursor: "pointer" }}>{activeApp}</div>
        <div className="menu-item">File</div>
        <div className="menu-item">Edit</div>
        <div className="menu-item">View</div>
        <div className="menu-item">Go</div>
        <div className="menu-item">Window</div>
        <div className="menu-item">Help</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div className="menu-icon" onClick={onControlCenterToggle}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </div>
        <div className="menu-icon" onClick={onSearchToggle}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <div className="menu-icon" onClick={onControlCenterToggle}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
        </div>
        <div style={{ cursor: "pointer", display: "flex", gap: "8px" }}>
          {time && (
            <>
              <span>{formatDate(time)}</span>
              <span>{formatTime(time)}</span>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .menu-item {
          cursor: pointer;
          padding: 2px 8px;
          border-radius: 4px;
          transition: background 0.1s;
        }
        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .menu-icon {
          cursor: pointer;
          display: flex;
          align-items: center;
          opacity: 0.8;
        }
        .menu-icon:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
