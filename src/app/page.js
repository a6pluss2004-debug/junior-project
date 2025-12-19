import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Hero */}
      <section className="px-6 py-16 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-[1.4fr,1fr] items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
              Built for students & junior teams
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
              Collaborative project boards
              <span className="block text-emerald-400">
                focused on student success
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm sm:text-base text-slate-300">
              Plan, track, and document your software projects in one place.
              Designed for students who need a simple **workflow** instead of complex enterprise tools.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-slate-300">
              <li>• Drag-and-drop task boards (To Do, In Progress, Done).</li>
              <li>• Rich documentation, file attachments, and revision history.</li>
              <li>• Roles for Admin, Project Owner, Team Member, and Guest.</li>
              <li>• Ready-made templates to reduce planning time by 40%.</li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-300 transition-colors"
              >
                Open your board
              </Link>
              <span className="text-xs text-slate-400">
                Free for students. No team size limit.
              </span>
            </div>
          </div>

          {/* Right-side board preview */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-tr from-emerald-500/30 via-sky-500/30 to-violet-500/20 blur-3xl opacity-70" />
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-300">
                    Student Sprint · CS Project
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    “API & frontend prototype due this week”
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                  Live board
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-[11px]">
                {/* To Do */}
                <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                  <p className="text-xs font-semibold text-slate-200">
                    To Do
                  </p>
                  <div className="mt-2 space-y-2">
                    <div className="rounded-lg bg-slate-800/80 p-2">
                      <p className="font-medium text-[11px]">
                        Design auth screens
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        UX for login & register.
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-800/80 p-2">
                      <p className="font-medium text-[11px]">
                        Setup project template
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Use the sprint starter.
                      </p>
                    </div>
                  </div>
                </div>

                {/* In Progress */}
                <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                  <p className="text-xs font-semibold text-slate-200">
                    In Progress
                  </p>
                  <div className="mt-2 space-y-2">
                    <div className="rounded-lg bg-slate-800/80 p-2 border border-emerald-500/40">
                      <p className="font-medium text-[11px]">
                        Connect API to UI
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Team member: Sara
                      </p>
                    </div>
                  </div>
                </div>

                {/* Done */}
                <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                  <p className="text-xs font-semibold text-slate-200">
                    Done
                  </p>
                  <div className="mt-2 space-y-2">
                    <div className="rounded-lg bg-slate-800/80 p-2">
                      <p className="font-medium text-[11px]">
                        Project setup
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Next.js + Tailwind + ESLint.
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-800/80 p-2">
                      <p className="font-medium text-[11px]">
                        Team roles defined
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Admin, Owner, Member, Guest.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-slate-400">
                Every board keeps tasks and documentation together so student
                teams stay aligned, even under tight deadlines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-t border-slate-800 bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
            Why students pick our board over Trello and Jira
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Built as a free, documentation-first alternative so you can focus on your **project** instead of your tooling.[web:83]
          </p>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900/90">
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-200">
                    Our Student Board
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400">
                    Trello
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400">
                    Jira
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="px-4 py-3 text-xs text-slate-300">
                    Pricing for students
                  </td>
                  <td className="px-4 py-3 text-xs text-emerald-300">
                    100% free for student teams
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    Free tier, advanced features paid[web:76]
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    Primarily paid, built for companies[web:68]
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-xs text-slate-300">
                    Documentation focus
                  </td>
                  <td className="px-4 py-3 text-xs text-emerald-300">
                    Integrated notes, attachments, revision history
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    Cards with descriptions & checklists
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    Strong issue tracking; docs often live elsewhere
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-xs text-slate-300">
                    Setup time
                  </td>
                  <td className="px-4 py-3 text-xs text-emerald-300">
                    Templates tuned for student software projects
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    Generic templates, more manual tweaking
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    Complex configuration for small teams
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-xs text-slate-300">
                    Roles & permissions
                  </td>
                  <td className="px-4 py-3 text-xs text-emerald-300">
                    Admin, Project Owner, Team Member, Guest
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    Members & guests, less student-centric
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    Enterprise-level roles and workflows
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-xs text-slate-300">
                    Learning curve
                  </td>
                  <td className="px-4 py-3 text-xs text-emerald-300">
                    Simple enough for first group project
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    Easy to start, limited guidance for coursework
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    Powerful but heavy for small assignments
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Perfect for semester-long software projects, capstones, and hackathon teams that need structure without enterprise complexity.
          </p>
        </div>
      </section>
    </main>
  );
}
