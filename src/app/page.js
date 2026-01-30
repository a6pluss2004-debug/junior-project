import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#3d348b] via-[#5b4fa3] to-[#1a1640] text-white">
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#78e0dc] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ff8d4c] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5b4fa3] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse-slow"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      {/* Hero */}
      <section className="relative z-10 px-6 py-16 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-[1.4fr,1fr] items-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center rounded-full bg-[#78e0dc]/10 px-3 py-1 text-xs font-bold text-[#78e0dc] ring-1 ring-[#78e0dc]/30 backdrop-blur-md border border-[#78e0dc]/20">
              Built for students & junior teams
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
              Collaborative project boards
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#78e0dc] to-[#ff8d4c] animate-gradient-x">
                focused on student success
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm sm:text-base text-white/70 leading-relaxed">
              Plan, track, and document your software projects in one place.
              Designed for students who need a simple <strong className="text-white">workflow</strong> instead of complex enterprise tools.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff8d4c]"></span> Drag-and-drop task boards (To Do, In Progress, Done).
              </li>
              <li className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#ff8d4c]"></span> Rich documentation, file attachments, and revision history.
              </li>
              <li className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#ff8d4c]"></span> Roles for Admin, Project Owner, Team Member, and Guest.
              </li>
              <li className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#ff8d4c]"></span> Ready-made templates to reduce planning time by 40%.
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#78e0dc] to-[#5bcac6] px-6 py-3 text-sm font-bold text-[#1a1640] shadow-[0_0_20px_rgba(120,224,220,0.3)] hover:shadow-[0_0_30px_rgba(120,224,220,0.5)] hover:scale-105 transition-all duration-300"
              >
                Open your board
              </Link>
              <span className="text-xs text-white/50 font-medium">
                Free for students. No team size limit.
              </span>
            </div>
          </div>

          {/* Right-side board preview */}
          <div className="relative animate-fade-in-up [animation-delay:200ms]">
            {/* Glow behind the board */}
            <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#78e0dc]/30 via-[#ff8d4c]/20 to-[#5b4fa3]/30 blur-2xl opacity-70 animate-pulse-slow" />
            
            {/* Glass Board Container */}
            <div className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold text-[#78e0dc]">
                    Student Sprint · CS Project
                  </p>
                  <p className="mt-1 text-sm text-white/80 font-medium">
                    “API & frontend prototype due this week”
                  </p>
                </div>
                <span className="rounded-full bg-[#78e0dc]/20 px-3 py-1 text-[10px] font-bold text-[#78e0dc] ring-1 ring-[#78e0dc]/30">
                  Live board
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-[11px]">
                {/* To Do */}
                <div className="rounded-xl bg-black/20 p-3 border border-white/5">
                  <p className="text-xs font-bold text-[#ff8d4c] mb-2">
                    To Do
                  </p>
                  <div className="space-y-2">
                    <div className="rounded-lg bg-white/10 p-2 border border-white/5 hover:bg-white/15 transition-colors">
                      <p className="font-semibold text-white">
                        Design auth screens
                      </p>
                      <p className="mt-1 text-[10px] text-white/50">
                        UX for login & register.
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-2 border border-white/5 hover:bg-white/15 transition-colors">
                      <p className="font-semibold text-white">
                        Setup project template
                      </p>
                      <p className="mt-1 text-[10px] text-white/50">
                        Use the sprint starter.
                      </p>
                    </div>
                  </div>
                </div>

                {/* In Progress */}
                <div className="rounded-xl bg-black/20 p-3 border border-white/5">
                  <p className="text-xs font-bold text-[#78e0dc] mb-2">
                    In Progress
                  </p>
                  <div className="space-y-2">
                    <div className="rounded-lg bg-gradient-to-br from-[#78e0dc]/20 to-[#78e0dc]/5 p-2 border border-[#78e0dc]/30">
                      <p className="font-semibold text-white">
                        Connect API to UI
                      </p>
                      <p className="mt-1 text-[10px] text-[#78e0dc]">
                        Team member: Sara
                      </p>
                    </div>
                  </div>
                </div>

                {/* Done */}
                <div className="rounded-xl bg-black/20 p-3 border border-white/5">
                  <p className="text-xs font-bold text-[#5b4fa3] mb-2">
                    Done
                  </p>
                  <div className="space-y-2">
                    <div className="rounded-lg bg-white/5 p-2 opacity-60">
                      <p className="font-semibold text-white">
                        Project setup
                      </p>
                      <p className="mt-1 text-[10px] text-white/40">
                        Next.js + Tailwind + ESLint.
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2 opacity-60">
                      <p className="font-semibold text-white">
                        Team roles defined
                      </p>
                      <p className="mt-1 text-[10px] text-white/40">
                        Admin, Owner, Member, Guest.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-white/50 text-center">
                Every board keeps tasks and documentation together so student
                teams stay aligned, even under tight deadlines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Why students pick our board over Trello and Jira
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Built as a free, documentation-first alternative so you can focus on your <strong className="text-white">project</strong> instead of your tooling.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/5">
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-[#78e0dc] uppercase tracking-wider bg-[#78e0dc]/5">
                      Our Student Board
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                      Trello
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                      Jira
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-white">
                      Pricing for students
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-[#78e0dc] bg-[#78e0dc]/5">
                      100% free for student teams
                    </td>
                    <td className="px-6 py-4 text-xs text-white/60">
                      Free tier, advanced features paid
                    </td>
                    <td className="px-6 py-4 text-xs text-white/60">
                      Primarily paid, built for companies
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-white">
                      Documentation focus
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-[#78e0dc] bg-[#78e0dc]/5">
                      Integrated notes, attachments, revision history
                    </td>
                    <td className="px-6 py-4 text-xs text-white/60">
                      Cards with descriptions & checklists
                    </td>
                    <td className="px-6 py-4 text-xs text-white/60">
                      Strong issue tracking; docs often live elsewhere
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-white">
                      Setup time
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-[#78e0dc] bg-[#78e0dc]/5">
                      Templates tuned for student software projects
                    </td>
                    <td className="px-6 py-4 text-xs text-white/60">
                      Generic templates, more manual tweaking
                    </td>
                    <td className="px-6 py-4 text-xs text-white/60">
                      Complex configuration for small teams
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-white">
                      Roles & permissions
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-[#78e0dc] bg-[#78e0dc]/5">
                      Admin, Project Owner, Team Member, Guest
                    </td>
                    <td className="px-6 py-4 text-xs text-white/60">
                      Members & guests, less student-centric
                    </td>
                    <td className="px-6 py-4 text-xs text-white/60">
                      Enterprise-level roles and workflows
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-white">
                      Learning curve
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-[#78e0dc] bg-[#78e0dc]/5">
                      Simple enough for first group project
                    </td>
                    <td className="px-6 py-4 text-xs text-white/60">
                      Easy to start, limited guidance for coursework
                    </td>
                    <td className="px-6 py-4 text-xs text-white/60">
                      Powerful but heavy for small assignments
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-6 text-xs text-white/40 text-center">
            Perfect for semester-long software projects, capstones, and hackathon teams that need structure without enterprise complexity.
          </p>
        </div>
      </section>
    </main>
  );
}
