"use client";

import React from "react";
import Book from "https://framer.com/m/Book-AFRs.js@mxOP9zughWqzCr7yH17p";
import { motion } from "framer-motion";

export function Departments() {
  const depts = [
    {
      leads: "Sudeep & Suyash",
      name: "Management",
      image: "/images/managemeent.jpg"
    },
    {
      leads: "Yeswanth & Syed",
      name: "Technical",
      image: "/images/technical.png"
    },
    {
      leads: "Janet",
      name: "Design",
      image: "/images/design.jpg"
    },
    {
      leads: "Nityasri",
      name: "Social & Content",
      image: "/images/social.jpg"
    }
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "transparent", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 20px", overflowY: "auto" }}>
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "3.5rem", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "50px", color: "#F0EBE1", textAlign: "center" }}
      >
        DEPARTMENTS
      </motion.h2>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "50px", maxWidth: "1100px", width: "100%", paddingBottom: "20px" }}
      >
        {depts.map((d, i) => (
          <motion.div 
            key={i} 
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }
            }}
            whileHover={{ scale: 1.05, y: -8 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
          >
            <div style={{ width: "200px", height: "305px", position: "relative", filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.5))" }}>
              <Book 
                image={d.image}
                title={d.name}
                author={d.leads}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
