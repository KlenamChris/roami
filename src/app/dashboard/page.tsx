"use client";

import { useEffect, useState, type FormEvent } from "react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const STORAGE_KEY = "roami-dashboard-tasks";

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Task[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t) =>
        typeof t?.id === "string" &&
        typeof t?.title === "string" &&
        typeof t?.completed === "boolean"
    );
  } catch {
    return [];
  }
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Hydrate from localStorage on mount. The set-state-in-effect here is
  // intentional: it avoids a server/client hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks(loadTasks());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // storage unavailable (private mode, quota) — tasks still work in memory
    }
  }, [tasks, loaded]);

  function addTask(e: FormEvent) {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setTasks((prev) => [...prev, { id, title, completed: false }]);
    setInput("");
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }

  const total = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const remaining = total - completedCount;
  const progress = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const visibleTasks = tasks.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed
  );

  return (
    <div className="flex justify-center items-start min-h-screen w-full px-4 py-10 sm:py-14">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/60 backdrop-blur sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              Roami
            </p>
            <h1 className="mt-1 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {total === 0
                ? "Add your first task below."
                : `${remaining} remaining · ${completedCount} completed`}
            </p>
          </div>
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-800 text-lg font-black text-white shadow-lg shadow-blue-800/30"
            aria-hidden="true"
          >
            ✈
          </div>
        </div>

        <form onSubmit={addTask} className="mt-6 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
            maxLength={200}
            aria-label="New task title"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="shrink-0 rounded-xl bg-blue-800 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-800/25 transition hover:-translate-y-px hover:bg-blue-900 disabled:translate-none disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed active:translate-y-0"
          >
            Add
          </button>
        </form>

        {total > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Task completion progress"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-700 to-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {total > 0 && (
          <div
            className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-bold"
            role="tablist"
            aria-label="Filter tasks"
          >
            {(
              [
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "completed", label: "Done" },
              ] as const
            ).map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3 py-1.5 transition ${
                  filter === f.key
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
            <p className="text-3xl" aria-hidden="true">
              🧳
            </p>
            <p className="mt-3 text-sm font-bold text-slate-700">
              No tasks yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Plan together, go together. ✈️
            </p>
          </div>
        ) : visibleTasks.length === 0 ? (
          <p className="mt-8 text-center text-sm text-slate-500">
            Nothing in this view — try another filter.
          </p>
        ) : (
          <>
            <ul className="mt-4 flex flex-col gap-2">
              {visibleTasks.map((task) => (
                <li
                  key={task.id}
                  className={`group flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm transition hover:shadow-md ${
                    task.completed
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-slate-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    role="checkbox"
                    aria-checked={task.completed}
                    aria-label={`Mark "${task.title}" as ${
                      task.completed ? "not completed" : "completed"
                    }`}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black transition ${
                      task.completed
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 bg-white text-transparent hover:border-blue-600"
                    }`}
                  >
                    ✓
                  </button>
                  <span
                    className={`flex-1 text-sm text-left break-words ${
                      task.completed
                        ? "text-slate-400 line-through"
                        : "font-medium text-slate-800"
                    }`}
                  >
                    {task.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTask(task.id)}
                    aria-label={`Remove "${task.title}"`}
                    className="shrink-0 rounded-lg px-2 py-1 text-sm font-bold text-slate-300 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            {completedCount > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400">
                  {remaining} left to go
                </p>
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="text-xs font-bold text-slate-500 transition hover:text-red-600 hover:underline"
                >
                  Clear completed ({completedCount})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
