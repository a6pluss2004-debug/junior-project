import { getProject } from '@/app/actions/project';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProjectBoardPage({ params }) {
  // Await the params object (Required in Next.js 15)
  const { id } = await params;

  const project = await getProject(id);

  if (!project) {
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen flex-col bg-blue-50">
      {/* Board Header */}
      <header className="flex h-16 shrink-0 items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard"
            className="rounded-full p-2 hover:bg-gray-100 text-gray-500"
          >
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{project.title}</h1>
        </div>
        
        {/* Placeholder for "Invite Member" button */}
        <button className="rounded-md bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200">
          Share
        </button>
      </header>

      {/* Board Canvas (Horizontal Scroll) */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex h-full gap-6">
          
          {/* COLUMN 1: To Do */}
          <div className="flex h-full w-80 shrink-0 flex-col rounded-xl bg-gray-100 shadow-sm">
            <div className="p-4 font-semibold text-gray-700 flex justify-between">
              <h3>To Do</h3>
              <span className="text-gray-400 text-sm">0</span>
            </div>
            <div className="flex-1 p-2 space-y-3 overflow-y-auto">
              {/* Task Cards will go here */}
              <div className="bg-white p-3 rounded shadow-sm border border-gray-200 text-sm text-gray-600">
                This is a placeholder task.
              </div>
            </div>
          </div>

          {/* COLUMN 2: In Progress */}
          <div className="flex h-full w-80 shrink-0 flex-col rounded-xl bg-gray-100 shadow-sm">
             <div className="p-4 font-semibold text-gray-700 flex justify-between">
              <h3>In Progress</h3>
              <span className="text-gray-400 text-sm">0</span>
            </div>
            <div className="flex-1 p-2 space-y-3 overflow-y-auto">
               {/* Empty for now */}
            </div>
          </div>

          {/* COLUMN 3: Done */}
          <div className="flex h-full w-80 shrink-0 flex-col rounded-xl bg-gray-100 shadow-sm">
             <div className="p-4 font-semibold text-gray-700 flex justify-between">
              <h3>Done</h3>
              <span className="text-gray-400 text-sm">0</span>
            </div>
            <div className="flex-1 p-2 space-y-3 overflow-y-auto">
               {/* Empty for now */}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
