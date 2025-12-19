'use client';


import { useState, useEffect } from 'react';
import { addMember, getMembers, removeMember, updateMemberRole } from '@/app/actions/member';


export default function ShareModal({ projectId, projectTitle, userRole, onClose }) {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);


  useEffect(() => {
    async function loadMembers() {
      const data = await getMembers(projectId);
      setMembers(data);
      setIsLoading(false);
    }
    loadMembers();
  }, [projectId]);


  async function handleInvite(e) {
    e.preventDefault();
    if (!email.trim()) return;


    setIsInviting(true);


    const result = await addMember({
      projectId,
      userEmail: email.trim(),
      role,
    });


    if (result?.error) {
      alert(result.error);
      setIsInviting(false);
      return;
    }


    if (result?.member) {
      setMembers((prev) => [...prev, result.member]);
    }


    setEmail('');
    setIsInviting(false);
  }


  async function handleRemove(memberId) {
    if (!confirm('Remove this member?')) return;


    setMembers((prev) => prev.filter((m) => m.id !== memberId));


    const result = await removeMember(memberId, projectId);


    if (result?.error) {
      alert(result.error);
      const data = await getMembers(projectId);
      setMembers(data);
    }
  }


  async function handleRoleChange(memberId, newRole) {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );


    const result = await updateMemberRole(memberId, projectId, newRole);


    if (result?.error) {
      alert(result.error);
      const data = await getMembers(projectId);
      setMembers(data);
    }
  }


  const canInvite = userRole === 'owner' || userRole === 'admin';
  const canManageRoles = userRole === 'owner';


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium Glass Modal */}
        <div className="relative group">
          {/* Animated border gradient */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-[#78e0dc]/50 via-[#ff8d4c]/50 to-[#3d348b]/50 rounded-[28px] blur-sm"></div>
         
          {/* Main glass card */}
          <div className="relative bg-gradient-to-br from-[#3d348b]/95 to-[#1a1640]/95 backdrop-blur-2xl rounded-[26px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>


            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-gradient-to-r from-[#3d348b] to-[#5b4fa3] p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#78e0dc] to-[#5bcac6] flex items-center justify-center shadow-lg shadow-[#78e0dc]/30">
                    <svg className="w-6 h-6 text-[#3d348b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Share Project</h2>
                    <p className="text-sm text-white/70 font-medium mt-0.5">{projectTitle}</p>
                  </div>
                </div>


                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>


            {/* Body */}
            <div className="relative z-10 p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Invite Form */}
              {canInvite && (
                <form onSubmit={handleInvite} className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-bold text-white/80 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#78e0dc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Invite Team Member
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative group/input">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="colleague@example.com"
                          disabled={isInviting}
                          className="w-full rounded-xl bg-white/5 border-2 border-white/10 py-3 px-4 text-white text-sm font-medium placeholder-white/40 focus:bg-white/10 focus:border-[#78e0dc] focus:ring-4 focus:ring-[#78e0dc]/20 transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
                        />
                      </div>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={isInviting}
                        className="rounded-xl bg-white/5 border-2 border-white/10 px-4 py-3 text-sm text-white font-bold focus:bg-white/10 focus:border-[#78e0dc] focus:ring-4 focus:ring-[#78e0dc]/20 transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
                      >
                        <option value="member" className="bg-[#3d348b] text-white">Member</option>
                        <option value="admin" className="bg-[#3d348b] text-white">Admin</option>
                        <option value="guest" className="bg-[#3d348b] text-white">Guest</option>
                      </select>
                      <button
                        type="submit"
                        disabled={isInviting || !email.trim()}
                        className="group/button relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#78e0dc] to-[#5bcac6]"></div>
                        <div className="relative px-6 py-3 flex items-center gap-2">
                          {isInviting ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-[#3d348b]" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="text-sm font-black text-[#3d348b]">Sending...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 text-[#3d348b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              <span className="text-sm font-black text-[#3d348b]">Invite</span>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </form>
              )}


              {/* Members List */}
              <div>
                <h3 className="text-sm font-bold text-white/80 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#ff8d4c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Team Members ({members.length})
                </h3>


                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="relative">
                      <div className="animate-spin h-12 w-12 border-4 border-[#78e0dc]/30 border-t-[#78e0dc] rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="group/member relative"
                      >
                        {/* Member card glow */}
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#78e0dc]/30 to-[#ff8d4c]/30 rounded-xl opacity-0 group-hover/member:opacity-100 blur transition-opacity duration-300"></div>
                       
                        <div className="relative flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300 group-hover/member:bg-white/10">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#78e0dc] to-[#5bcac6] flex items-center justify-center font-black text-[#3d348b] shadow-lg">
                              {member.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white flex items-center gap-2">
                                {member.userName}
                                {member.role === 'owner' && (
                                  <span className="inline-flex items-center rounded-full bg-[#ff8d4c]/20 px-2 py-0.5 text-xs font-bold text-[#ff8d4c] border border-[#ff8d4c]/30">
                                    You
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-white/60 font-medium">{member.userEmail}</p>
                            </div>
                          </div>


                          <div className="flex items-center gap-3">
                            {/* Role Selector */}
                            {canManageRoles && member.role !== 'owner' ? (
                              <select
                                value={member.role}
                                onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                className="rounded-lg bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm focus:bg-white/20 focus:border-[#78e0dc] transition-all duration-300"
                              >
                                <option value="admin" className="bg-[#3d348b] text-white">Admin</option>
                                <option value="member" className="bg-[#3d348b] text-white">Member</option>
                                <option value="guest" className="bg-[#3d348b] text-white">Guest</option>
                              </select>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-[#78e0dc]/20 px-3 py-1.5 text-xs font-bold text-[#78e0dc] capitalize border border-[#78e0dc]/30">
                                {member.role}
                              </span>
                            )}


                            {/* Remove Button */}
                            {canManageRoles && member.role !== 'owner' && (
                              <button
                                onClick={() => handleRemove(member.id)}
                                className="text-red-300 hover:bg-red-500/20 rounded-lg p-2 transition-all duration-300 hover:text-red-200"
                                title="Remove member"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>


              {/* Role Descriptions */}
              <div className="border-t border-white/10 pt-5">
                <h4 className="text-xs font-black text-white/60 mb-3 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ROLE PERMISSIONS
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-3">
                    <p className="text-xs font-bold text-[#78e0dc] mb-1">👑 Owner</p>
                    <p className="text-xs text-white/60">Full control - manage members, delete project</p>
                  </div>
                  <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-3">
                    <p className="text-xs font-bold text-[#ff8d4c] mb-1">⚡ Admin</p>
                    <p className="text-xs text-white/60">Edit tasks, manage columns, invite members</p>
                  </div>
                  <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-3">
                    <p className="text-xs font-bold text-[#78e0dc] mb-1">✏️ Member</p>
                    <p className="text-xs text-white/60">Create/edit tasks, add comments</p>
                  </div>
                  <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-3">
                    <p className="text-xs font-bold text-white/70 mb-1">👁️ Guest</p>
                    <p className="text-xs text-white/60">View-only access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}