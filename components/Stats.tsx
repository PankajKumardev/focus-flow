// components/Stats.tsx
'use client';

export const Stats = ({ tasks }: { tasks: any }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: any) => t.completed).length;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Statistics</h2>
      <div className="space-y-2">
        <div>
          <p className="text-gray-600">Total Tasks: {totalTasks}</p>
          <p className="text-gray-600">Completed: {completedTasks}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 rounded-full h-2"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">Progress: {progress}%</p>
      </div>
    </div>
  );
};
