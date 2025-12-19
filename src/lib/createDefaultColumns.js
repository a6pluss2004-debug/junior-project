// src/lib/createDefaultColumns.js
import Column from '@/models/Column';
import dbConnect from '@/lib/dbConnect'; // same helper you use for other models

export async function createDefaultColumns(projectId) {
  await dbConnect();

  const base = [
    { title: 'To Do', key: 'todo', order: 0 },
    { title: 'In Progress', key: 'inprogress', order: 1 },
    { title: 'Done', key: 'done', order: 2 },
  ];

  await Column.insertMany(
    base.map((col) => ({
      ...col,
      projectId,
    }))
  );
}
