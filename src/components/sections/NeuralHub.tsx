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
  dept: string;
  radius: number;
  baseRadius: number;
  targetRadius: number;
  imageElement?: HTMLImageElement;
}

const MEMBERS = [
  { name: "Arjun Selvam", role: "President", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop", dept: "Executive Core" },
  { name: "Karthik Rajan", role: "Vice President", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop", dept: "Executive Core" },
  { name: "Meera Krishnan", role: "Design Lead", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop", dept: "Design & Content" },
  { name: "Vikram Anand", role: "Security Lead", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=100&auto=format&fit=crop", dept: "Executive Core" },
  { name: "Priya Nair", role: "Tech Lead", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop", dept: "Technical" },
  { name: "Rahul Verma", role: "Event Manager", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop", dept: "Management & Marketing" },
  { name: "Sneha Kapoor", role: "Marketing Lead", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop", dept: "Management & Marketing" },
  { name: "Ishaan Singh", role: "Outreach Lead", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop", dept: "Management & Marketing" },
  { name: "Ananya Iyer", role: "Content Head", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop", dept: "Design & Content" },
  { name: "Dev Patel", role: "Fullstack Dev", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop", dept: "Technical" },
];

const getDeptColor = (dept: string, alpha: number = 1) => {
  switch (dept) {
    case "Executive Core":
      return `rgba(245, 158, 11, ${alpha})`; // Amber Gold
    case "Technical":
      return `rgba(59, 130, 246, ${alpha})`; // Electric Blue
    case "Design & Content":
      return `rgba(236, 72, 153, ${alpha})`; // Hot Pink
    case "Management & Marketing":
      return `rgba(16, 185, 129, ${alpha})`; // Emerald Green
    default:
      return `rgba(255, 255, 255, ${alpha})`;
  }
};

const getDeptCenter = (dept: string, w: number, h: number) => {
  const contentHeight = h - 140;
  switch (dept) {
    case "Executive Core":
      return { x: w * 0.5, y: 140 + contentHeight * 0.25 };
    case "Technical":
      return { x: w * 0.22, y: 140 + contentHeight * 0.65 };
    case "Design & Content":
      return { x: w * 0.78, y: 140 + contentHeight * 0.65 };
    case "Management & Marketing":
      return { x: w * 0.5, y: 140 + contentHeight * 0.75 };
    default:
      return { x: w * 0.5, y: 140 + contentHeight * 0.5 };
  }
};

export function NeuralHub() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedMember, setSelectedMember] = useState<typeof MEMBERS[0] | null>(null);
  const nodes = useRef<Node[]>([]);
  const mouse = useRef({ x: 0, y: 0, active: false, down: false });
  const draggedNodeIdRef = useRef<number | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initNodes = (w: number, h: number) => {
      // Create a node for each member
      nodes.current = MEMBERS.map((member, i) => {
        const baseRadius = 24 + Math.random() * 6; // node radii: 24 to 30
        const img = new Image();
        img.src = member.image;
        const center = getDeptCenter(member.dept, w, h);
        
        // Spawn slightly randomized around their department centers
        return {
          id: i,
          x: center.x + (Math.random() - 0.5) * 80,
          y: center.y + (Math.random() - 0.5) * 80,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          name: member.name,
          role: member.role,
          image: member.image,
          dept: member.dept,
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
      } else {
        nodes.current.forEach((node) => {
          node.x = Math.max(node.radius, Math.min(w - node.radius, node.x));
          node.y = Math.max(140 + node.radius, Math.min(h - node.radius, node.y));
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const nodesArr = nodes.current;
      
      // Draw background department labels
      const depts = [
        { label: "EXECUTIVE CORE", x: canvas.width * 0.5, y: 140 + (canvas.height - 140) * 0.22, color: "rgba(245, 158, 11, 0.08)" },
        { label: "TECHNICAL DOMAIN", x: canvas.width * 0.22, y: 140 + (canvas.height - 140) * 0.62, color: "rgba(59, 130, 246, 0.08)" },
        { label: "DESIGN & CONTENT", x: canvas.width * 0.78, y: 140 + (canvas.height - 140) * 0.62, color: "rgba(236, 72, 153, 0.08)" },
        { label: "MANAGEMENT & MARKETING", x: canvas.width * 0.5, y: 140 + (canvas.height - 140) * 0.79, color: "rgba(16, 185, 129, 0.08)" }
      ];
      
      depts.forEach(d => {
        ctx.fillStyle = d.color;
        ctx.font = "800 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(d.label, d.x, d.y);
      });

      // Default cursor
      if (draggedNodeIdRef.current !== null) {
        canvas.style.cursor = "grabbing";
      } else {
        canvas.style.cursor = "crosshair";
      }
      
      // Resolve overlapping node collisions (push away)
      for (let i = 0; i < nodesArr.length; i++) {
        for (let j = i + 1; j < nodesArr.length; j++) {
          const dx = nodesArr[i].x - nodesArr[j].x;
          const dy = nodesArr[i].y - nodesArr[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = nodesArr[i].radius + nodesArr[j].radius + 15; // spacing margin
          
          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            const pushX = nx * overlap * 0.5;
            const pushY = ny * overlap * 0.5;

            if (draggedNodeIdRef.current === nodesArr[i].id) {
              nodesArr[j].x -= pushX * 2;
              nodesArr[j].y -= pushY * 2;
            } else if (draggedNodeIdRef.current === nodesArr[j].id) {
              nodesArr[i].x += pushX * 2;
              nodesArr[i].y += pushY * 2;
            } else {
              nodesArr[i].x += pushX;
              nodesArr[i].y += pushY;
              nodesArr[j].x -= pushX;
              nodesArr[j].y -= pushY;
              
              // Mild bounce energy
              nodesArr[i].vx += pushX * 0.04;
              nodesArr[i].vy += pushY * 0.04;
              nodesArr[j].vx -= pushX * 0.04;
              nodesArr[j].vy -= pushY * 0.04;
            }
          }
        }
      }

      // Draw connections (highlighted within departments)
      for (let i = 0; i < nodesArr.length; i++) {
        for (let j = i + 1; j < nodesArr.length; j++) {
          const dx = nodesArr[i].x - nodesArr[j].x;
          const dy = nodesArr[i].y - nodesArr[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Connect nodes if they are within 180px
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(nodesArr[i].x, nodesArr[i].y);
            ctx.lineTo(nodesArr[j].x, nodesArr[j].y);
            
            const isSameDept = nodesArr[i].dept === nodesArr[j].dept;
            let opacity = (1 - dist / 180) * (isSameDept ? 0.16 : 0.05);
            
            if (mouse.current.active) {
              const mx = mouse.current.x;
              const my = mouse.current.y;
              const d1 = Math.sqrt((nodesArr[i].x - mx) ** 2 + (nodesArr[i].y - my) ** 2);
              const d2 = Math.sqrt((nodesArr[j].x - mx) ** 2 + (nodesArr[j].y - my) ** 2);
              
              if (d1 < 100 || d2 < 100) {
                opacity = (1 - dist / 180) * (isSameDept ? 0.35 : 0.15);
                ctx.strokeStyle = getDeptColor(nodesArr[i].dept, opacity);
              } else {
                ctx.strokeStyle = isSameDept ? getDeptColor(nodesArr[i].dept, opacity) : `rgba(255, 255, 255, ${opacity})`;
              }
            } else {
              ctx.strokeStyle = isSameDept ? getDeptColor(nodesArr[i].dept, opacity) : `rgba(255, 255, 255, ${opacity})`;
            }
            ctx.lineWidth = isSameDept ? 1.0 : 0.6;
            ctx.stroke();
          }
        }
      }

      // Update & Draw Nodes
      nodesArr.forEach((node) => {
        const dxMouse = node.x - mouse.current.x;
        const dyMouse = node.y - mouse.current.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        const isHovered = mouse.current.active && distMouse < node.radius + 10;

        if (isHovered && draggedNodeIdRef.current === null) {
          canvas.style.cursor = "grab";
        }

        if (draggedNodeIdRef.current === node.id) {
          // Follow cursor directly
          const dx = mouse.current.x - node.x;
          const dy = mouse.current.y - node.y;
          node.vx = dx * 0.25;
          node.vy = dy * 0.25;
          node.x += node.vx;
          node.y += node.vy;
        } else {
          // Physics updates
          node.x += node.vx;
          node.y += node.vy;

          // Department Gravity Pull (keeps them clustered by domain)
          const center = getDeptCenter(node.dept, canvas.width, canvas.height);
          const dxCenter = center.x - node.x;
          const dyCenter = center.y - node.y;
          node.vx += dxCenter * 0.0007; // gentle gravity coefficient
          node.vy += dyCenter * 0.0007;

          // Boundaries bounce
          if (node.x - node.radius < 0 || node.x + node.radius > canvas.width) {
            node.vx *= -1;
            node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x));
          }
          if (node.y - node.radius < 140 || node.y + node.radius > canvas.height) {
            node.vy *= -1;
            node.y = Math.max(140 + node.radius, Math.min(canvas.height - node.radius, node.y));
          }

          // Slow down node gently when hovered
          if (isHovered) {
            node.vx *= 0.6;
            node.vy *= 0.6;
          }

          // Friction and ambient drifting
          node.vx *= 0.95;
          node.vy *= 0.95;
          node.vx += (Math.random() - 0.5) * 0.03;
          node.vy += (Math.random() - 0.5) * 0.03;
        }

        // Animate radius scaling on hover
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
          const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius);
          grad.addColorStop(0, "rgba(59, 130, 246, 0.4)");
          grad.addColorStop(1, "rgba(29, 78, 216, 0.1)");
          ctx.fillStyle = grad;
          ctx.fill();
        }
        ctx.restore();

        // Draw outer ring (colored according to department)
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        if (isHovered || draggedNodeIdRef.current === node.id) {
          ctx.strokeStyle = getDeptColor(node.dept, 1);
          ctx.lineWidth = 3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = getDeptColor(node.dept, 0.8);
        } else {
          ctx.strokeStyle = getDeptColor(node.dept, 0.5);
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw label
        if (isHovered || node.radius > 25) {
          ctx.fillStyle = isHovered ? getDeptColor(node.dept, 1) : "rgba(255, 255, 255, 0.75)";
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

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    mouse.current.down = true;

    // Identify if a node was clicked
    const clickedNode = nodes.current.find((n) => {
      const dx = n.x - mx;
      const dy = n.y - my;
      return Math.sqrt(dx * dx + dy * dy) < n.radius + 10;
    });

    if (clickedNode) {
      draggedNodeIdRef.current = clickedNode.id;
      dragStartRef.current = {
        x: mx,
        y: my,
        time: Date.now()
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    mouse.current = {
      x: mx,
      y: my,
      active: true,
      down: mouse.current.down
    };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    mouse.current.down = false;

    if (draggedNodeIdRef.current !== null) {
      const start = dragStartRef.current;
      const dx = mx - start.x;
      const dy = my - start.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const duration = Date.now() - start.time;

      // Quick select triggers if mouse barely moved
      if (dist < 8 && duration < 300) {
        const clickedNode = nodes.current.find(n => n.id === draggedNodeIdRef.current);
        if (clickedNode) {
          setSelectedMember(MEMBERS.find(m => m.name === clickedNode.name) || null);
        }
      }
      
      draggedNodeIdRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    mouse.current.active = false;
    mouse.current.down = false;
    draggedNodeIdRef.current = null;
  };

  return (
    <div 
      style={{ width: "100%", height: "100%", position: "relative", background: "#101012", overflow: "hidden" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />

      <div style={{ position: "absolute", top: "20px", left: "20px", pointerEvents: "none" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "white", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.8 }}>Interactive Neural Hub</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>Nodes are grouped by department • Drag nodes to reposition/throw them • Click a node to inspect details</p>
      </div>

      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "320px",
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
              style={{ position: "absolute", top: "10px", right: "15px", background: "none", border: "none", color: "white", opacity: 0.5, cursor: "pointer", fontSize: "16px" }}
            >×</button>
            <div style={{ 
              width: "80px", 
              height: "80px", 
              borderRadius: "50%", 
              overflow: "hidden", 
              marginBottom: "15px", 
              border: `3px solid ${getDeptColor(selectedMember.dept, 0.8)}`,
              boxShadow: `0 0 10px ${getDeptColor(selectedMember.dept, 0.4)}`
            }}>
              <img src={selectedMember.image} alt={selectedMember.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 5px 0" }}>{selectedMember.name}</h3>
            <p style={{ fontSize: "0.9rem", color: getDeptColor(selectedMember.dept, 1), fontWeight: 700, margin: "0 0 4px 0" }}>{selectedMember.dept}</p>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontWeight: 500, margin: 0 }}>{selectedMember.role}</p>
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
