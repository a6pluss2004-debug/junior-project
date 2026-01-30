import { getProject } from '@/app/actions/project';
import { getTasks } from '@/app/actions/task';
import { redirect } from 'next/navigation';
import BoardClient from './BoardClient'; 
import connectDB from '@/lib/db';
import Column from '@/models/Column';

export default async function ProjectBoardPage({ params }) {
  const { id } = await params;

  const project = await getProject(id);
  if (!project) {
    redirect('/dashboard');
  }

  // Load tasks as before
  const tasks = await getTasks(id);

  // load columns for this project from DB
  await connectDB();
  const columns = await Column.find({ projectId: id })
    .sort({ order: 1 })
    .lean();

  const initialColumns = columns.map((c) => ({
    id: c._id.toString(),
    key: c.key,
    title: c.title,
    order: c.order,
  }));

  // Convert deadline Date to ISO string
  const tasksWithFormattedDeadline = tasks.map((t) => ({
    ...t,
    deadline: t.deadline ? new Date(t.deadline).toISOString() : null,
  }));

  // Pass columns into BoardClient
  return (
    <BoardClient
      project={project}
      initialTasks={tasksWithFormattedDeadline}
      initialColumns={initialColumns}
    />
  );
}
