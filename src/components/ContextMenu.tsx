"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  items: Array<{ label: string; onClick: () => void; separator?: boolean }>;
}

export default function ContextMenu({ x, y, onClose, items }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 2000,
        width: "220px",
        background: "rgba(30, 30, 30, 0.7)",
        backdropFilter: "blur(25px)",
        WebkitBackdropFilter: "blur(25px)",
        borderRadius: "8px",
        padding: "6px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div
            onClick={() => {
              item.onClick();
              onClose();
            }}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              color: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "background 0.1s",
            }}
            className="context-menu-item"
          >
            {item.label}
          </div>
          {item.separator && (
            <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.1)", margin: "4px 6px" }} />
          )}
        </React.Fragment>
      ))}

      <style jsx>{`
        .context-menu-item:hover {
          background: #3b82f6;
          color: white;
        }
      `}</style>
    </motion.div>
  );
}
