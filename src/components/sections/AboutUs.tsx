"use client";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export function AboutUs() {
  const [activeTab, setActiveTab] = useState("About Us");

  const renderContent = () => {
    switch (activeTab) {
      case "About Us":
        return (
          <motion.div initial="hidden" animate="visible" variants={stagger} key="about">
            <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", marginBottom: "60px" }}>
              <h1 style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "15vw", lineHeight: 0.8, margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
                BUILD.
              </h1>
              <p style={{ fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginTop: "20px", borderTop: "1px solid rgba(240, 235, 225, 0.2)", paddingTop: "20px" }}>
                CSI Student Chapter • VIT Chennai
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp} style={{ fontSize: "1rem", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(240, 235, 225, 0.5)", marginBottom: "40px" }}>
              150 members. One belief.
            </motion.div>

            <motion.p variants={fadeUp} style={{ fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "700px", marginBottom: "20px", color: "rgba(240, 235, 225, 0.7)" }}>
              We exist to turn curious students into builders. CSI - VITC bridges the gap between classroom theory and industry reality — through hands-on projects, real mentorship, and a community that pushes each other to ship.
            </motion.p>
            
            <motion.p variants={fadeUp} style={{ fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "700px", marginBottom: "60px", color: "rgba(240, 235, 225, 0.7)" }}>
              We're a 150-member strong collective of developers, designers, researchers, and dreamers. From late-night hackathons to open-source contributions, everything we do is driven by one belief: the best way to learn is to build something real.
            </motion.p>
          </motion.div>
        );
      case "Core Values":
        return (
          <motion.div initial="hidden" animate="visible" variants={stagger} key="values">
            <motion.div variants={fadeUp} style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-anton), sans-serif", margin: 0, letterSpacing: "1px" }}>CORE VALUES</h2>
              <p style={{ color: "rgba(240, 235, 225, 0.5)", fontSize: "1rem", marginTop: "10px" }}>The principles that guide our work.</p>
            </motion.div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "80px" }}>
              {[
                { num: "01", title: "Craft over credentials", desc: "What you build matters more than your GPA." },
                { num: "02", title: "Open by default", desc: "Knowledge shared is knowledge multiplied." },
                { num: "03", title: "Ship early, learn fast", desc: "Progress over perfection, always." }
              ].map((val, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeUp}
                  whileHover={{ x: 10, backgroundColor: "rgba(255, 255, 255, 0.04)", borderColor: "rgba(255, 255, 255, 0.15)" }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  style={{ 
                    padding: "24px", 
                    display: "flex", 
                    gap: "24px", 
                    alignItems: "flex-start",
                    background: "rgba(255, 255, 255, 0.01)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "16px",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#3b82f6", fontFamily: "var(--font-anton), sans-serif", marginTop: "-2px" }}>{val.num}</span>
                  <div>
                    <h4 style={{ fontSize: "1.25rem", margin: "0 0 6px 0", fontWeight: 600, letterSpacing: "-0.01em", color: "#F0EBE1" }}>{val.title}</h4>
                    <p style={{ fontSize: "0.95rem", lineHeight: 1.5, margin: 0, color: "rgba(240, 235, 225, 0.6)" }}>{val.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case "Statistics":
        return (
          <motion.div initial="hidden" animate="visible" variants={stagger} key="stats">
            <motion.div variants={fadeUp} style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-anton), sans-serif", margin: 0, letterSpacing: "1px" }}>BY THE NUMBERS</h2>
              <p style={{ color: "rgba(240, 235, 225, 0.5)", fontSize: "1rem", marginTop: "10px" }}>A snapshot of our community impact.</p>
            </motion.div>
            <motion.div variants={fadeUp} style={{ display: "flex", justifyItems: "center", flexWrap: "wrap", gap: "20px", paddingTop: "20px" }}>
              {[
                { num: "150+", lbl: "Members" },
                { num: "40+", lbl: "Events" },
                { num: "25+", lbl: "Projects" },
                { num: "6", lbl: "Years Strong" }
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -8, scale: 1.02, borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.05)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ 
                    flex: "1 1 200px", 
                    padding: "30px", 
                    background: "rgba(255, 255, 255, 0.02)", 
                    backdropFilter: "blur(12px)", 
                    border: "1px solid rgba(255, 255, 255, 0.06)", 
                    borderRadius: "20px", 
                    textAlign: "center",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "4.5rem", lineHeight: 1, color: "#fff", textShadow: "0 4px 20px rgba(255,255,255,0.1)" }}>{stat.num}</div>
                  <div style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "2px", marginTop: "15px", color: "rgba(240, 235, 225, 0.5)" }}>{stat.lbl}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: "transparent", color: "#F0EBE1", fontFamily: "var(--font-inter), sans-serif", overflow: "hidden" }}>
      
      {/* Finder Sidebar */}
      <div style={{ width: "220px", background: "rgba(255, 255, 255, 0.01)", borderRight: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", flexDirection: "column", padding: "20px 10px", flexShrink: 0 }}>
        <div style={{ fontSize: "0.7rem", color: "rgba(240, 235, 225, 0.4)", fontWeight: 600, padding: "0 10px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Favorites</div>
        
        <motion.div 
          onClick={() => setActiveTab("About Us")}
          whileHover={{ scale: 1.02, x: 4, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          style={{ padding: "8px 12px", borderRadius: "8px", background: activeTab === "About Us" ? "rgba(255, 255, 255, 0.1)" : "transparent", color: activeTab === "About Us" ? "#F0EBE1" : "rgba(240, 235, 225, 0.6)", fontSize: "0.85rem", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          About Us
        </motion.div>
        
        <motion.div 
          onClick={() => setActiveTab("Core Values")}
          whileHover={{ scale: 1.02, x: 4, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          style={{ padding: "8px 12px", borderRadius: "8px", background: activeTab === "Core Values" ? "rgba(255, 255, 255, 0.1)" : "transparent", color: activeTab === "Core Values" ? "#F0EBE1" : "rgba(240, 235, 225, 0.6)", fontSize: "0.85rem", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          Core Values
        </motion.div>
        
        <motion.div 
          onClick={() => setActiveTab("Statistics")}
          whileHover={{ scale: 1.02, x: 4, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          style={{ padding: "8px 12px", borderRadius: "8px", background: activeTab === "Statistics" ? "rgba(255, 255, 255, 0.1)" : "transparent", color: activeTab === "Statistics" ? "#F0EBE1" : "rgba(240, 235, 225, 0.6)", fontSize: "0.85rem", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          Statistics
        </motion.div>
      </div>

      {/* Main Finder Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* Finder Toolbar */}
        <div style={{ height: "52px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", padding: "0 16px", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", gap: "8px", color: "rgba(240, 235, 225, 0.4)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: "pointer" }}><polyline points="15 18 9 12 15 6"></polyline></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: "pointer" }}><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "#F0EBE1" }}>CSI Student Chapter / {activeTab}</div>
          </div>
          
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "8px", color: "rgba(240, 235, 225, 0.6)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </div>
            <div style={{ width: "160px", height: "28px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", alignItems: "center", padding: "0 10px", color: "rgba(240, 235, 225, 0.4)", fontSize: "0.8rem", gap: "6px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Search
            </div>
          </div>
        </div>

        {/* Content Scroll Area */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "40px 8%" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
