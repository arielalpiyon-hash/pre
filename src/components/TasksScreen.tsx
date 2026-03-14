import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getCopy, type Persona } from '../utils/personaCopy';

interface Task {
  key: string;
  titlePath: string;
}

const TASKS: Task[] = [
  { key: 'importance', titlePath: 'tasks.taskTitles.importance' },
  { key: 'contribution', titlePath: 'tasks.taskTitles.contribution' },
  { key: 'difficulty', titlePath: 'tasks.taskTitles.difficulty' },
  { key: 'fear', titlePath: 'tasks.taskTitles.fear' },
  { key: 'prove', titlePath: 'tasks.taskTitles.prove' }
];

interface TasksScreenProps {
  persona: Persona;
  completedTasks: string[];
  onTaskComplete: (taskKey: string, response: string) => void;
}

export default function TasksScreen({ persona, completedTasks, onTaskComplete }: TasksScreenProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [response, setResponse] = useState('');

  const handleSubmit = () => {
    if (response.trim() && selectedTask) {
      onTaskComplete(selectedTask.key, response);
      setSelectedTask(null);
      setResponse('');
    }
  };

  if (selectedTask) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 pb-10">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setSelectedTask(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors py-2"
          >
            <ArrowRight size={22} />
            <span className="font-medium">חזרה</span>
          </button>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {getCopy(selectedTask.titlePath, persona)}
          </h2>

          <div className="bg-olive-50 border border-olive-200 rounded-xl p-4 mb-6">
            <p className="text-olive-900 text-sm leading-relaxed">
              {getCopy('tasks.instructionText', persona)}
            </p>
          </div>

          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder={getCopy('tasks.placeholder', persona)}
            className="w-full h-72 p-5 border-2 border-gray-200 rounded-2xl focus:border-olive-500 focus:outline-none focus:ring-2 focus:ring-olive-100 text-lg resize-none bg-white shadow-sm"
            dir="rtl"
            autoFocus
          />

          <button
            onClick={handleSubmit}
            disabled={!response.trim()}
            className="w-full bg-olive-700 hover:bg-olive-800 active:bg-olive-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-lg font-semibold py-5 px-6 rounded-2xl transition-all mt-6 shadow-lg disabled:shadow-none"
          >
            שלח תשובה
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 pb-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-10 pt-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-5">
            {getCopy('tasks.listTitle', persona)}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            {getCopy('tasks.listSubtitle', persona)}
          </p>
        </div>

        <div className="space-y-4">
          {TASKS.map((task) => {
            const isCompleted = completedTasks.includes(task.key);
            return (
              <button
                key={task.key}
                onClick={() => setSelectedTask(task)}
                className="w-full bg-white hover:bg-olive-50 active:bg-olive-100 rounded-2xl shadow-md p-5 transition-all block"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="text-right flex-1">
                    <span className="text-lg font-medium text-gray-900 leading-relaxed">
                      {getCopy(task.titlePath, persona)}
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    {isCompleted && (
                      <CheckCircle2 className="text-olive-700" size={20} />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
