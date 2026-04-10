// src/components/RiskBadge.js
"use client";
import { useState, useRef, useEffect } from "react";

const CONFIG = {
  HIGH: {
    label: "High Risk",
    badge: "bg-red-100 text-red-700 border border-red-300",
    dot: "bg-red-500 animate-pulse",
    tooltip: "border-red-200",
  },
  MEDIUM: {
    label: "Medium Risk",
    badge: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    dot: "bg-yellow-500",
    tooltip: "border-yellow-200",
  },
  LOW: {
    label: "Low Risk",
    badge: "bg-green-100 text-green-700 border border-green-300",
    dot: "bg-green-500",
    tooltip: "border-green-200",
  },
};

export default function RiskBadge({ riskLevel, reason, suggestions = [], score }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!riskLevel || riskLevel === "LOW") {
    // For LOW risk, show a small subtle badge — no tooltip needed
    if (riskLevel === "LOW") {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full
                         bg-green-100 text-green-600 border border-green-200 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Low Risk
        </span>
      );
    }
    return null;
  }

  const c = CONFIG[riskLevel] || CONFIG.LOW;

  return (
    <div ref={ref} className="relative inline-block">
      {/* Badge button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((p) => !p); }}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
                    text-xs font-semibold cursor-pointer select-none
                    transition-all hover:opacity-80 active:scale-95
                    ${c.badge}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
        {c.label}
      </button>

      {/* Tooltip panel */}
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute z-50 bottom-full mb-2 left-0 w-64
                      bg-white/95 backdrop-blur-sm border rounded-xl shadow-xl
                      p-3.5 text-xs text-gray-700 animate-in fade-in slide-in-from-bottom-1
                      ${c.tooltip}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${c.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
              {c.label} {score !== undefined && `(${score}/100)`}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 ml-1 leading-none text-sm"
            >
              ✕
            </button>
          </div>

          {/* Reason */}
          {reason && (
            <p className="text-gray-600 leading-relaxed mb-2.5">{reason}</p>
          )}

          {/* Suggestions */}
          {suggestions?.length > 0 && (
            <div>
              <p className="font-semibold text-gray-700 mb-1.5">Suggested actions:</p>
              <ul className="space-y-1.5">
                {suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2 text-gray-600">
                    <span className="text-blue-500 font-bold mt-px flex-shrink-0">→</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tooltip arrow */}
          <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white border-b border-r
                          border-gray-200 rotate-45" />
        </div>
      )}
    </div>
  );
}
