import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserProjects } from '@/app/actions/project';
import LogoutButton from '@/components/LogoutButton';
import NewProjectForm from '@/components/NewProjectForm';
import Link from 'next/link';
import DeleteProjectButton from '@/components/DeleteProjectButton';

export default async function DashboardPage() {
  // 1. Auth Check
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect('/login');
  }

  // 2. Fetch Data
  const projects = await getUserProjects();

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#3d348b] via-[#5b4fa3] to-[#1a1640]">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#78e0dc] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff8d4c] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#78e0dc] rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse-slow"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

      {/* Premium Header */}
      <header className="relative z-20 border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#78e0dc] to-[#ff8d4c] animate-spin-slow opacity-80"></div>
              <div className="absolute inset-[2px] rounded-xl bg-gradient-to-br from-[#3d348b] to-[#1a1640] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#78e0dc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Project Dashboard</h2>
              <p className="text-xs text-white/60 font-medium">Manage your projects</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff8d4c] to-[#ff6b35] flex items-center justify-center shadow-lg shadow-[#ff8d4c]/20">
                <span className="text-sm font-bold text-white">{session.name?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm font-semibold text-white">{session.name}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* LEFT COLUMN: Project List */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-2">Your Projects</h1>
                <p className="text-white/70 font-medium">Create and manage your amazing projects</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#78e0dc]/20 to-[#78e0dc]/10 border border-[#78e0dc]/30 backdrop-blur-sm">
                <svg className="w-5 h-5 text-[#78e0dc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-lg font-black text-[#78e0dc]">{projects.length}</span>
                <span className="text-sm font-semibold text-white/80">Total</span>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="relative group">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-white/20 to-white/5 rounded-3xl blur-sm"></div>
                <div className="relative rounded-3xl border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-xl p-16 text-center">
                  <div className="mx-auto w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-white/70">No projects yet</p>
                  <p className="text-sm text-white/50 mt-2">Create your first project to get started</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {projects.map((project, index) => (
                  <div 
                    key={project.id} 
                    className="group animate-fade-in-up relative"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-full">
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#78e0dc]/50 via-[#ff8d4c]/50 to-[#3d348b]/50 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500"></div>
                      <div className="relative h-full rounded-2xl bg-gradient-to-br from-white/[0.15] to-white/[0.05] backdrop-blur-xl border border-white/20 p-6 shadow-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        
                        {/* Delete button - bottom-right */}
                        <div className="absolute bottom-4 right-4 z-20">
                          <DeleteProjectButton projectId={project.id} />
                        </div>

                        <Link href={`/dashboard/project/${project.id}`} className="block relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff8d4c] to-[#ff6b35] flex items-center justify-center shadow-lg shadow-[#ff8d4c]/30 group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <svg className="w-5 h-5 text-white/40 group-hover:text-[#78e0dc] group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#78e0dc] transition-colors duration-300">
                            {project.title}
                          </h3>
                          {project.description && (
                            <p className="text-sm text-white/70 line-clamp-2 mb-4 leading-relaxed">
                              {project.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-white/50 font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Created {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Create Form */}
          <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="sticky top-28">
              <NewProjectForm />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}