"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, CheckCircle, Download, AlertCircle, ArrowRight, Clock, Award, BookOpen } from "lucide-react";

interface AgendaItem {
  time: string;
  title: string;
}

interface Speaker {
  name: string;
  role: string;
  company: string;
  image: string;
  bio: string;
}

interface EventData {
  id: string;
  title: string;
  category: "Hackathon" | "Workshop" | "Summit" | "Past Event";
  date: string;
  timeStr: string;
  venue: string;
  status: "Registration Open" | "Few Seats Left!" | "Opening Soon" | "Completed";
  statusColor: string;
  rsvps: number;
  description: string;
  prerequisites: string;
  speaker: Speaker;
  agenda: AgendaItem[];
}

const EVENTS: EventData[] = [
  {
    id: "devspace",
    title: "DevSpace Hackathon 2026",
    category: "Hackathon",
    date: "June 14 - 15, 2026",
    timeStr: "36-Hour Hackathon",
    venue: "Netaji Auditorium & CSE Labs",
    status: "Registration Open",
    statusColor: "#10b981", // green
    rsvps: 1420,
    description: "CSI's flagship national-level hackathon. Over 36 hours, build innovative projects in AI/ML, Cyber Security, Web 3.0, and Open Innovation. Interact with mentors, participate in mini-games, and win prizes worth 2,00,000 INR.",
    prerequisites: "Team of 2-4 members, Laptops, Github account, enthusiasm.",
    speaker: {
      name: "Siddharth Verma",
      role: "Principal Architect",
      company: "Microsoft Azure",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      bio: "Siddharth works on scalable cloud virtualization at Microsoft. He is an alumnus of VIT Chennai and acts as the chief technical judge for DevSpace."
    },
    agenda: [
      { time: "June 14, 08:30 AM", title: "Registrations & Setup" },
      { time: "June 14, 10:00 AM", title: "Keynote & Hacking Begins" },
      { time: "June 14, 04:00 PM", title: "Mentorship Round 1" },
      { time: "June 15, 10:00 AM", title: "Mid-way Progress Evaluation" },
      { time: "June 15, 04:00 PM", title: "Final Pitching Rounds" },
      { time: "June 15, 06:30 PM", title: "Results & Prize Distribution" }
    ]
  },
  {
    id: "cybershield",
    title: "CyberShield CTF & Workshop",
    category: "Workshop",
    date: "June 28, 2026",
    timeStr: "10:00 AM - 05:00 PM",
    venue: "Netaji Auditorium, VITC",
    status: "Few Seats Left!",
    statusColor: "#f59e0b", // yellow
    rsvps: 245,
    description: "A hands-on workshop covering network vulnerability assessment, web exploitation, and active directories, followed by a 3-hour mini Capture-the-Flag (CTF) security tournament.",
    prerequisites: "Familiarity with basic Linux commands. Kali Linux virtual machine installed on laptops.",
    speaker: {
      name: "Aman Malhotra",
      role: "Lead Security Researcher",
      company: "CrowdStrike India",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      bio: "Aman specializes in malware reverse-engineering and active defense. He has reported over 15 high-severity CVEs in public protocols."
    },
    agenda: [
      { time: "10:00 AM", title: "Network Pen-testing Basics" },
      { time: "11:30 AM", title: "Live Exploitation Walkthroughs" },
      { time: "01:00 PM", title: "Networking Break" },
      { time: "02:00 PM", title: "CSI Capture-The-Flag Launch" },
      { time: "05:00 PM", title: "CTF Walkthroughs & Certifications" }
    ]
  },
  {
    id: "ainexus",
    title: "AI Nexus Panel & Exhibition",
    category: "Summit",
    date: "July 12, 2026",
    timeStr: "02:00 PM - 06:00 PM",
    venue: "Ambedkar Auditorium",
    status: "Opening Soon",
    statusColor: "#3b82f6", // blue
    rsvps: 512,
    description: "Bringing together academics and industry leaders to discuss the impact of Generative AI, Spatial Computing, and Robotics on academic research and engineering careers.",
    prerequisites: "Open to students of all branches. No coding background required.",
    speaker: {
      name: "Dr. Ananya Ray",
      role: "Director of AI Ethics",
      company: "OpenAI Research",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
      bio: "Dr. Ray leads AI safety research at OpenAI. She previously worked at Stanford AI Labs and teaches algorithmic fairness."
    },
    agenda: [
      { time: "02:00 PM", title: "Speech: The Age of Spatial Intelligence" },
      { time: "03:15 PM", title: "Panel Discussion: AI and Student Careers" },
      { time: "04:30 PM", title: "Interactive AI Project Showcases" },
      { time: "05:45 PM", title: "Closing Remarks & Networking" }
    ]
  },
  {
    id: "codecraft",
    title: "CodeCraft: Mastering DSA",
    category: "Past Event",
    date: "May 10, 2026",
    timeStr: "03:00 PM - 05:00 PM",
    venue: "Online Webinar",
    status: "Completed",
    statusColor: "#6b7280", // grey
    rsvps: 680,
    description: "An interactive code walkthrough session focusing on core algorithms, dynamic programming strategies, and cracking core tech company placement exams.",
    prerequisites: "Familiarity with Java, C++ or Python arrays and recursion.",
    speaker: {
      name: "Neha Sharma",
      role: "Software Engineer L5",
      company: "Google India",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      bio: "Neha is a competitive programmer and leads development teams inside Google Ads. She regularly mentors students on DSA hacks."
    },
    agenda: [
      { time: "03:00 PM", title: "Algorithmic Complexity Hacks" },
      { time: "04:00 PM", title: "Interactive Graph Problem Solving" },
      { time: "04:45 PM", title: "Q&A on Interview Strategies" }
    ]
  }
];

export function Events() {
  const [selectedEventId, setSelectedEventId] = useState<string>("devspace");
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [showTicket, setShowTicket] = useState<string | null>(null);

  const selectedEvent = EVENTS.find(e => e.id === selectedEventId) || EVENTS[0];
  const isRegistered = registeredEvents.includes(selectedEvent.id);

  const handleRSVP = (id: string) => {
    if (registeredEvents.includes(id)) {
      setShowTicket(id);
      return;
    }
    setRegisteredEvents([...registeredEvents, id]);
    setShowTicket(id);
  };

  const generateCalendarFile = (event: EventData) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.venue);
    // Simple mock Google Calendar link
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&sf=true&output=xml`;
    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a0c", color: "white", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      
      {/* Left Pane: Scrolling Event Directory */}
      <div 
        style={{ 
          width: "35%", 
          borderRight: "1px solid rgba(255, 255, 255, 0.08)", 
          padding: "20px", 
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          height: "100%",
          boxSizing: "border-box"
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>Events Hub</h2>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", margin: "4px 0 0 0" }}>Register & view agendas</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {EVENTS.map((event) => {
            const active = event.id === selectedEventId;
            const userRegistered = registeredEvents.includes(event.id);
            return (
              <motion.div
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                whileHover={{ scale: active ? 1 : 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  background: active ? "rgba(59, 130, 246, 0.15)" : "rgba(255, 255, 255, 0.03)",
                  border: "1px solid " + (active ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.06)"),
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: event.category === "Hackathon" ? "#60a5fa" : event.category === "Workshop" ? "#f59e0b" : "#ec4899" }}>
                    {event.category}
                  </span>
                  <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)", color: event.statusColor, fontWeight: 700 }}>
                    {event.status}
                  </span>
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "2px 0", lineHeight: 1.2 }}>
                  {event.title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>
                  <Calendar size={12} />
                  <span>{event.date}</span>
                </div>
                {userRegistered && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#10b981", fontWeight: 700, marginTop: "4px" }}>
                    <CheckCircle size={10} /> Registered
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Detailed Viewer */}
      <div 
        style={{ 
          width: "65%", 
          padding: "24px", 
          overflowY: "auto",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}
      >
        {/* Header Block */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "70%" }}>
            <span style={{ padding: "4px 12px", borderRadius: "99px", background: getDeptColor(selectedEvent.category, 0.15), border: `1px solid ${getDeptColor(selectedEvent.category, 0.3)}`, color: getDeptColor(selectedEvent.category, 1), fontSize: "11px", fontWeight: 700, width: "fit-content" }}>
              {selectedEvent.category}
            </span>
            <h1 style={{ fontSize: "1.7rem", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{selectedEvent.title}</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
                <Calendar size={14} color="#3b82f6" />
                <span>{selectedEvent.date} ({selectedEvent.timeStr})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
                <MapPin size={14} color="#ec4899" />
                <span>{selectedEvent.venue}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
              <Users size={14} />
              <span>{selectedEvent.rsvps + (isRegistered ? 1 : 0)} RSVPs</span>
            </div>
            {selectedEvent.category !== "Past Event" ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRSVP(selectedEvent.id)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "12px",
                  background: isRegistered ? "rgba(16, 185, 129, 0.2)" : "#3b82f6",
                  border: isRegistered ? "1px solid #10b981" : "none",
                  color: isRegistered ? "#10b981" : "white",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {isRegistered ? (
                  <>
                    <CheckCircle size={14} /> View Pass
                  </>
                ) : (
                  "Register / RSVP"
                )}
              </motion.button>
            ) : (
              <span style={{ padding: "8px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                Event Completed
              </span>
            )}
          </div>
        </div>

        {/* Description & Prerequisites */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                <Award size={16} color="#3b82f6" /> About Event
              </h3>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.5, margin: 0 }}>
                {selectedEvent.description}
              </p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.04)" }}>
              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "6px", color: "#f59e0b" }}>
                <AlertCircle size={14} /> Prerequisites
              </h4>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.4 }}>
                {selectedEvent.prerequisites}
              </p>
            </div>
          </div>

          {/* Speaker Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "6px" }}>
              <BookOpen size={16} color="#ec4899" /> Guest Speaker
            </h3>
            <div 
              style={{ 
                background: "rgba(255,255,255,0.03)", 
                border: "1px solid rgba(255,255,255,0.06)", 
                borderRadius: "20px", 
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              <div style={{ width: "70px", height: "70px", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,0.15)", marginBottom: "10px" }}>
                <img src={selectedEvent.speaker.image} alt={selectedEvent.speaker.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 2px 0" }}>{selectedEvent.speaker.name}</h4>
              <p style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: 600, margin: "0 0 8px 0" }}>
                {selectedEvent.speaker.role} at {selectedEvent.speaker.company}
              </p>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.4 }}>
                {selectedEvent.speaker.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Agenda Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
            <Clock size={16} color="#10b981" /> Event Agenda
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "20px", padding: "16px" }}>
            {selectedEvent.agenda.map((slot, index) => (
              <div key={index} style={{ display: "flex", gap: "16px", alignItems: "center", borderBottom: index === selectedEvent.agenda.length - 1 ? "none" : "1px solid rgba(255,255,255,0.04)", paddingBottom: "10px", paddingTop: index === 0 ? "0" : "8px" }}>
                <div style={{ width: "130px", fontSize: "0.8rem", color: "#10b981", fontWeight: 700 }}>
                  {slot.time}
                </div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
                  {slot.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holographic Ticket Modal Overlay */}
      <AnimatePresence>
        {showTicket && (
          <div 
            onClick={() => setShowTicket(null)}
            style={{ 
              position: "absolute", 
              inset: 0, 
              background: "rgba(0,0,0,0.65)", 
              backdropFilter: "blur(8px)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              zIndex: 9999
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "350px",
                borderRadius: "28px",
                background: "linear-gradient(135deg, rgba(30,30,35,0.9), rgba(10,10,12,0.95))",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 25px 60px -15px rgba(0,0,0,0.9), inset 0 0 40px rgba(59, 130, 246, 0.15)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                position: "relative"
              }}
            >
              {/* Ticket cut-outs (classic styling detail) */}
              <div style={{ position: "absolute", left: "-10px", top: "50%", transform: "translateY(-50%)", width: "20px", height: "20px", borderRadius: "50%", background: "#0c0c0e", borderRight: "1px solid rgba(255,255,255,0.15)" }} />
              <div style={{ position: "absolute", right: "-10px", top: "50%", transform: "translateY(-50%)", width: "20px", height: "20px", borderRadius: "50%", background: "#0c0c0e", borderLeft: "1px solid rgba(255,255,255,0.15)" }} />
              
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>
                CSI Official Pass
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 16px 0", lineHeight: 1.2 }}>
                {selectedEvent.title}
              </h3>

              {/* Holographic QR Area */}
              <div 
                style={{ 
                  width: "150px", 
                  height: "150px", 
                  borderRadius: "16px", 
                  background: "white", 
                  padding: "10px", 
                  boxSizing: "border-box",
                  boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  position: "relative"
                }}
              >
                {/* SVG representing a mock futuristic QR Code */}
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="#09090b">
                  <path d="M5,5 h30 v30 h-30 z M15,15 h10 v10 h-10 z M65,5 h30 v30 h-30 z M75,15 h10 v10 h-10 z M5,65 h30 v30 h-30 z M15,75 h10 v10 h-10 z" />
                  <path d="M45,5 h10 v10 h-10 z M45,25 h10 v15 h-10 z M55,45 h15 v10 h-15 z M35,45 h10 v20 h-10 z M45,65 h20 v10 h-20 z M75,45 h20 v10 h-20 z M65,75 h30 v20 h-30 z" />
                  <rect x="42" y="42" width="16" height="16" fill="#3b82f6" opacity="0.3" rx="2" />
                  <rect x="47" y="47" width="6" height="6" fill="#3b82f6" />
                </svg>
              </div>

              <div style={{ borderTop: "1px dashed rgba(255,255,255,0.15)", width: "100%", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
                  Venue: <strong style={{ color: "white" }}>{selectedEvent.venue}</strong>
                </div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
                  Date: <strong style={{ color: "white" }}>{selectedEvent.date}</strong>
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
                  TICKET ID: CSI-2026-{selectedEvent.id.toUpperCase()}-{(selectedEvent.rsvps + 1).toString().padStart(4, "0")}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", width: "100%", marginTop: "24px" }}>
                <button
                  onClick={() => generateCalendarFile(selectedEvent)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <Download size={12} /> Add Calendar
                </button>
                <button
                  onClick={() => setShowTicket(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background: "#3b82f6",
                    border: "none",
                    color: "white",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

const getDeptColor = (category: string, alpha: number = 1) => {
  switch (category) {
    case "Hackathon":
      return `rgba(59, 130, 246, ${alpha})`; // Blue
    case "Workshop":
      return `rgba(245, 158, 11, ${alpha})`; // Amber
    case "Summit":
      return `rgba(236, 72, 153, ${alpha})`; // Pink
    default:
      return `rgba(107, 114, 128, ${alpha})`; // Grey
  }
};
