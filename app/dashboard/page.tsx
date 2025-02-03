// app/dashboard/page.tsx
'use client';
import { useEffect } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { useProjectStore } from '@/store/useProjectStore';
import { Calendar } from '@/components/Calander';
import { TaskManager } from '@/components/TaskManger';
import { ProjectManager } from '@/components/ProjectManger';
import { Stats } from '@/components/Stats';
// import { Calendar, TaskManager, ProjectManager, Stats } from '@/components';

export default function Dashboard() {
  const { tasks, fetchTasks } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      <div className="lg:col-span-3 space-y-4">
        <TaskManager />
        <Calendar tasks={tasks} />
      </div>
      <div className="lg:col-span-1 space-y-4">
        <ProjectManager />
        <Stats tasks={tasks} />
      </div>
    </div>
  );
}
