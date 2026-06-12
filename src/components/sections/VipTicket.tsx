"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Award, QrCode } from "lucide-react";

export function VipTicket() {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const ticket = ticketRef.current;
    if (!ticket) return;
    const rect = ticket.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Rotate relative to mouse position
    setRotate({
      x: -y / 12,
      y: x / 12
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div 
      style={{
        width: "100%",
        height: "100%",
        background: "#08080a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        overflowY: "auto",
        boxSizing: "border-box"
      }}
    >
      <motion.div
        ref={ticketRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
          transformPerspective: 800
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          width: "500px",
          height: "260px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(57, 255, 20, 0.15)",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          userSelect: "none"
        }}
      >
        {/* Holographic Shine Overlay */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at ${rotate.y * 30 + 50}% ${-rotate.x * 30 + 50}%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)`,
            pointerEvents: "none",
            zIndex: 2
          }}
        />

        {/* Left Side: Badge and Info */}
        <div style={{ flex: 1.3, padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
          <div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Award size={20} color="#39ff14" style={{ filter: "drop-shadow(0 0 5px #39ff14)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#39ff14" }}>
                CSI VIP Access Pass
              </span>
            </div>
            
            {/* Title */}
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0, color: "#fff", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-anton), sans-serif" }}>
              DEVSPACE HACKATHON
            </h2>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", margin: "4px 0 0 0" }}>
              CSI VITC Flagship Hackathon 2026
            </p>
          </div>

          {/* Details footer */}
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
            <div>
              <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>DATE</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginTop: "2px" }}>June 14 - 15</div>
            </div>
            <div>
              <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>VENUE</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginTop: "2px" }}>Netaji Aud. VITC</div>
            </div>
            <div>
              <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>PASSCODE</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#39ff14", marginTop: "2px", letterSpacing: "0.5px" }}>CSICRAFT2026</div>
            </div>
          </div>
        </div>

        {/* Dashed Separator */}
        <div 
          style={{
            width: "1px",
            borderLeft: "2px dashed rgba(255, 255, 255, 0.2)",
            height: "100%",
            position: "relative"
          }}
        >
          {/* Half circle punch outs */}
          <div style={{ position: "absolute", width: "16px", height: "16px", background: "#08080a", borderRadius: "50%", left: "-9px", top: "-8px", borderBottom: "2px solid rgba(255,255,255,0.2)" }} />
          <div style={{ position: "absolute", width: "16px", height: "16px", background: "#08080a", borderRadius: "50%", left: "-9px", bottom: "-8px", borderTop: "2px solid rgba(255,255,255,0.2)" }} />
        </div>

        {/* Right Side: QR & Barcode stub */}
        <div 
          style={{
            flex: 0.7,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(0,0,0,0.2)"
          }}
        >
          {/* QR Code */}
          <div style={{ padding: "8px", background: "white", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>
            <QrCode size={75} color="#000" />
          </div>

          {/* Barcode lines */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", width: "100%" }}>
            <div style={{ display: "flex", gap: "2px", width: "90%", height: "20px", background: "transparent" }}>
              {[1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1].map((w, i) => (
                <div key={i} style={{ flexGrow: w, height: "100%", background: "rgba(255,255,255,0.6)" }} />
              ))}
            </div>
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>VIP-982460-CSI</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
