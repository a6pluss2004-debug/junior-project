"use client";
import { useState, useEffect, useRef } from "react";

const ROLES = [
  { value: "member", label: "Member", desc: "Create/edit tasks, add comments" },
  { value: "admin",  label: "Admin",  desc: "Manage columns, invite members" },
  { value: "guest",  label: "Guest",  desc: "View only" },
];

const ROLE_COLORS = {
  owner:  "bg-purple-100 text-purple-700",
  admin:  "bg-blue-100 text-blue-700",
  member: "bg-green-100 text-green-700",
  guest:  "bg-gray-100 text-gray-600",
};

export default function ShareProjectModal({ projectId, onClose }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole]             = useState("member");
  const [members, setMembers]       = useState([]);
  const [searching, setSearching]   = useState(false);
  const [adding, setAdding]         = useState(false);
  const [removing, setRemoving]     = useState(null); // userId being removed
  const [feedback, setFeedback]     = useState(null); // { type, text }
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // ── Load current members ───────────────────────────────────────────────────
  const loadMembers = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/members`);
      const data = await res.json();
      setMembers(data.members || []);
    } catch (e) {
      console.error("Failed to load members:", e);
    }
  };

  useEffect(() => {
    loadMembers();
    // Focus input on open
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // ── Username search with debounce ──────────────────────────────────────────
  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/projects/${projectId}/members?search=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data.users || []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSelect = (user) => {
    setSelectedUser(user);
    setQuery(user.name);
    setResults([]);
    setFeedback(null);
  };

  const handleAdd = async () => {
    if (!selectedUser) {
      setFeedback({ type: "error", text: "Please select a user from the list" });
      return;
    }
    setAdding(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser._id, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", text: data.message });
        setSelectedUser(null);
        setQuery("");
        setRole("member");
        loadMembers(); // refresh member list
      } else {
        setFeedback({ type: "error", text: data.error });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error. Try again." });
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (userId, userName) => {
    if (!confirm(`Remove ${userName} from this project?`)) return;
    setRemoving(userId);
    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        loadMembers();
      } else {
        alert(data.error || "Could not remove member");
      }
    } catch {
      alert("Network error. Try again.");
    } finally {
      setRemoving(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    // Optimistic update for UI speed
    setMembers(prev => prev.map(m => m.userId === userId ? { ...m, role: newRole } : m));
    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Could not change role");
        loadMembers(); // Revert on failure
      }
    } catch {
      alert("Network error. Try again.");
      loadMembers();
    }
  };

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Share Project</h2>
            <p className="text-xs text-gray-400 mt-0.5">Add members by searching their username</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full
                       hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">

          {/* Search input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Search by username
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedUser(null); }}
                placeholder="Type a name (e.g. Amjad)..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* Search icon */}
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  Searching...
                </span>
              )}
            </div>

            {/* Autocomplete dropdown */}
            {results.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1
                              bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {results.map((u) => (
                  <button key={u._id} onClick={() => handleSelect(u)}
                    className="w-full flex items-center gap-3 px-3 py-2.5
                               hover:bg-blue-50 text-left transition-colors">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500
                                    text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {query.length >= 2 && results.length === 0 && !searching && !selectedUser && (
              <p className="absolute top-full left-0 mt-1.5 text-xs text-gray-400 px-1">
                No users found matching "{query}"
              </p>
            )}
          </div>

          {/* Role picker — only show when a user is selected */}
          {selectedUser && (
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500
                                text-white text-xs font-bold flex items-center justify-center">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{selectedUser.name}</p>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {ROLES.map((r) => (
                  <button key={r.value} onClick={() => setRole(r.value)}
                    className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium
                               transition-all text-center
                               ${role === r.value
                                 ? "border-blue-500 bg-blue-600 text-white"
                                 : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
                    {r.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {ROLES.find((r) => r.value === role)?.desc}
              </p>
            </div>
          )}

          {/* Feedback message */}
          {feedback && (
            <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
              feedback.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              <span>{feedback.type === "success" ? "✓" : "✕"}</span>
              {feedback.text}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Current Members ({members.length})
            </h3>

            {/* Members list */}
            <div className="space-y-2">
              {members.map((m) => (
                <div key={m.userId}
                  className="flex items-center justify-between py-2 px-3
                             bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-500
                                    text-white text-xs font-bold flex items-center justify-center">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Role Dropdown */}
                    {m.role === "owner" ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS.owner}`}>
                        owner
                      </span>
                    ) : (
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.userId, e.target.value)}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium appearance-none cursor-pointer outline-none border focus:ring-2 focus:ring-blue-500
                                   ${ROLE_COLORS[m.role] || ROLE_COLORS.member}`}
                      >
                        <option value="admin">admin</option>
                        <option value="member">member</option>
                        <option value="guest">guest</option>
                      </select>
                    )}
                    {/* Only show remove for non-owners */}
                    {m.role !== "owner" && (
                      <button
                        onClick={() => handleRemove(m.userId, m.name)}
                        disabled={removing === m.userId}
                        className="text-gray-300 hover:text-red-400 transition-colors text-sm
                                   disabled:opacity-50"
                        title="Remove member"
                      >
                        {removing === m.userId ? "..." : "✕"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm
                       font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Done
          </button>
          <button
            onClick={handleAdd}
            disabled={adding || !selectedUser}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                       text-white rounded-xl text-sm font-semibold transition-colors
                       disabled:cursor-not-allowed">
            {adding ? "Adding..." : `Add${selectedUser ? ` ${selectedUser.name.split(" ")[0]}` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
