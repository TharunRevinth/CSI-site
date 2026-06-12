"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  name: string;
  role: string;
  image: string;
  radius: number;
  baseRadius: number;
  targetRadius: number;
  imageElement?: HTMLImageElement;
}

const MEMBERS = [
  { name: "Arjun Selvam", role: "President", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop" },
  { name: "Karthik Rajan", role: "Vice President", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" },
  { name: "Meera Krishnan", role: "Design Lead", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" },
  { name: "Vikram Anand", role: "Security Lead", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=100&auto=format&fit=crop" },
  { name: "Priya Nair", role: "Tech Lead", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop" },
  { name: "Rahul Verma", role: "Event Manager", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" },
  { name: "Sneha Kapoor", role: "Marketing Lead", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" },
  { name: "Ishaan Singh", role: "Outreach Lead", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" },
  { name: "Ananya Iyer", role: "Content Head", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" },
  { name: "Dev Patel", role: "Fullstack Dev", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" },
];

export function NeuralHub() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedMember, setSelectedMember] = useState<typeof MEMBERS[0] | null>(null);
  const nodes = useRef<Node[]>([]);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initNodes = (w: number, h: number) => {
      nodes.current = Array.from({ length: 35 }).map((_, i) => {
        const baseRadius = Math.random() * 15 + 20; // radius 20 to 35
        const img = new Image();
        img.src = MEMBERS[i % MEMBERS.length].image;
        return {
          id: i,
          x: Math.random() * w,
          y: 120 + Math.random() * Math.max(100, h - 120 - baseRadius * 2),
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          name: MEMBERS[i % MEMBERS.length].name,
          role: MEMBERS[i % MEMBERS.length].role,
          image: MEMBERS[i % MEMBERS.length].image,
          radius: baseRadius,
          baseRadius,
          targetRadius: baseRadius,
          imageElement: img,
        };
      });
    };

    const resize = () => {
      const parentW = canvas.parentElement?.clientWidth;
      const parentH = canvas.parentElement?.clientHeight;
      
      const w = parentW && parentW > 0 ? parentW : (typeof window !== "undefined" ? Math.min(1200, window.innerWidth - 100) : 800);
      const h = parentH && parentH > 0 ? parentH : (typeof window !== "undefined" ? Math.min(800, window.innerHeight - 150) : 600);
      
      canvas.width = w;
      canvas.height = h;
      
      if (nodes.current.length === 0) {
        initNodes(w, h);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const nodesArr = nodes.current;
      
      // Default cursor
      canvas.style.cursor = "crosshair";
      
      // Update & Draw Connections with Neon Blue Glow on hover
      for (let i = 0; i < nodesArr.length; i++) {
        for (let j = i + 1; j < nodesArr.length; j++) {
          const dx = nodesArr[i].x - nodesArr[j].x;
          const dy = nodesArr[i].y - nodesArr[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(nodesArr[i].x, nodesArr[i].y);
            ctx.lineTo(nodesArr[j].x, nodesArr[j].y);
            
            let opacity = (1 - dist / 160) * 0.12;
            
            // Highlight connections close to mouse/hovered nodes
            if (mouse.current.active) {
              const mx = mouse.current.x;
              const my = mouse.current.y;
              const d1 = Math.sqrt((nodesArr[i].x - mx) ** 2 + (nodesArr[i].y - my) ** 2);
              const d2 = Math.sqrt((nodesArr[j].x - mx) ** 2 + (nodesArr[j].y - my) ** 2);
              if (d1 < 120 || d2 < 120) {
                opacity = (1 - dist / 160) * 0.25;
                ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
              } else {
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
              }
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            }
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Update & Draw Nodes
      nodesArr.forEach((node) => {
        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce from boundaries
        if (node.x - node.radius < 0 || node.x + node.radius > canvas.width) node.vx *= -1;
        if (node.y - node.radius < 120 || node.y + node.radius > canvas.height) node.vy *= -1;

        // Keep inside boundaries
        node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x));
        node.y = Math.max(120 + node.radius, Math.min(canvas.height - node.radius, node.y));

        // Hover detection
        const dxMouse = node.x - mouse.current.x;
        const dyMouse = node.y - mouse.current.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        let isHovered = false;
        if (mouse.current.active && distMouse < node.radius + 10) {
          isHovered = true;
          canvas.style.cursor = "pointer";
        }

        // Mouse interaction (Gentle magnetic attraction and dampening for easy clicking)
        if (mouse.current.active && distMouse < 160) {
          const force = (160 - distMouse) / 160;
          if (isHovered) {
            // Almost stop the node when hovered so it's super easy to click
            node.vx *= 0.5;
            node.vy *= 0.5;
          } else {
            // Magnetically pull the node gently towards the cursor
            node.vx -= dxMouse * force * 0.003;
            node.vy -= dyMouse * force * 0.003;
            // Dampen its velocity so it remains steady near the cursor
            node.vx *= 0.90;
            node.vy *= 0.90;
          }
        }

        // Friction and soft natural movement
        node.vx *= 0.97;
        node.vy *= 0.97;
        node.vx += (Math.random() - 0.5) * 0.05;
        node.vy += (Math.random() - 0.5) * 0.05;

        // Animate radius size
        node.targetRadius = isHovered ? node.baseRadius * 1.35 : node.baseRadius;
        node.radius += (node.targetRadius - node.radius) * 0.15;

        // Draw profile image clipping mask
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.clip();

        if (node.imageElement && node.imageElement.complete && node.imageElement.naturalWidth !== 0) {
          ctx.drawImage(
            node.imageElement,
            node.x - node.radius,
            node.y - node.radius,
            node.radius * 2,
            node.radius * 2
          );
        } else {
          // Fallback background gradient
          const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius);
          grad.addColorStop(0, "rgba(59, 130, 246, 0.4)");
          grad.addColorStop(1, "rgba(29, 78, 216, 0.1)");
          ctx.fillStyle = grad;
          ctx.fill();
        }
        ctx.restore();

        // Draw profile ring outline
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        if (isHovered) {
          ctx.strokeStyle = "rgba(59, 130, 246, 0.95)";
          ctx.lineWidth = 3;
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#3b82f6";
        } else {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Label rendering
        if (isHovered || node.radius > 25) {
          ctx.fillStyle = isHovered ? "#3b82f6" : "rgba(255, 255, 255, 0.75)";
          ctx.font = isHovered ? "bold 11px Inter" : "500 10px Inter";
          ctx.textAlign = "center";
          ctx.fillText(node.name.split(" ")[0], node.x, node.y + node.radius + 15);
          
          if (isHovered) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
            ctx.font = "9px Inter";
            ctx.fillText(node.role, node.x, node.y + node.radius + 26);
          }
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouse.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    };
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const clickedNode = nodes.current.find(n => {
      const dx = n.x - mx;
      const dy = n.y - my;
      return Math.sqrt(dx * dx + dy * dy) < n.radius + 10;
    });

    if (clickedNode) {
      setSelectedMember(MEMBERS.find(m => m.name === clickedNode.name) || null);
    }
  };

  return (
    <div 
      style={{ width: "100%", height: "100%", position: "relative", background: "#101012", overflow: "hidden", cursor: "crosshair" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => mouse.current.active = false}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />

      <div style={{ position: "absolute", top: "20px", left: "20px", pointerEvents: "none" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "white", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.8 }}>Interactive Neural Hub</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>Click a node to view member details • Move mouse to interact</p>
      </div>

      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "300px",
              background: "rgba(30, 30, 30, 0.8)",
              backdropFilter: "blur(20px)",
              padding: "20px",
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              zIndex: 100,
            }}
          >
            <button 
              onClick={() => setSelectedMember(null)}
              style={{ position: "absolute", top: "10px", right: "15px", background: "none", border: "none", color: "white", opacity: 0.5, cursor: "pointer" }}
            >×</button>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", marginBottom: "15px", border: "2px solid rgba(255,255,255,0.2)" }}>
              <img src={selectedMember.image} alt={selectedMember.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 5px 0" }}>{selectedMember.name}</h3>
            <p style={{ fontSize: "0.9rem", color: "#3b82f6", fontWeight: 600, margin: 0 }}>{selectedMember.role}</p>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
              style={{ marginTop: "20px", background: "white", color: "black", border: "none", padding: "8px 20px", borderRadius: "99px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", transition: "background-color 0.2s" }}
            >
              View Projects
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        canvas {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: pixelated;
          image-rendering: optimize-contrast;
        }
      `}</style>
    </div>
  );
}
