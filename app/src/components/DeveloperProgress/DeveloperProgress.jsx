import { useEffect, useState } from "react";
import { fetchUserHistory } from "../../services/githubApi";

const METRICS = [
  { key: "repositories", label: "Repositories" },
  { key: "stars",        label: "Stars"         },
  { key: "forks",        label: "Forks"         },
  { key: "commits",      label: "Commits"       },
];

function Delta({ value }) {
  if (value === 0) {
    return <span className="text-neutral-500 text-sm font-mono">±0</span>;
  }
  const positive = value > 0;
  return (
    <span
      className={`text-sm font-mono font-semibold ${
        positive ? "text-emerald-400" : "text-rose-400"
      }`}
    >
      {positive ? "+" : ""}
      {value.toLocaleString()}
    </span>
  );
}

function DeveloperProgress({ username }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;

    setLoading(true);
    fetchUserHistory(username)
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [username]);

  if (!username) return null;
  if (loading) return null; // silent load — don't disrupt the page

  // Need at least 2 snapshots to show progress
  if (history.length < 2) {
    return (
      <div className="border-t border-neutral-700 px-4 sm:px-6 lg:px-10 py-8">
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
          Developer Progress
        </p>
        <p className="text-sm text-neutral-500 italic">
          Progress tracking starts with your next analysis.
        </p>
      </div>
    );
  }

  const current  = history[0]; // newest
  const previous = history[1]; // second newest

  return (
    <div className="border-t border-neutral-700 px-4 sm:px-6 lg:px-10 py-8">
      <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">
        Developer Progress
      </p>
      <p className="text-xs text-neutral-600 mb-6">
        Compared to previous analysis on{" "}
        {new Date(previous.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {METRICS.map(({ key, label }) => {
          const curr = current[key] ?? 0;
          const prev = previous[key] ?? 0;
          const delta = curr - prev;

          return (
            <div
              key={key}
              className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-4"
            >
              <p className="text-xs text-neutral-500 mb-1">{label}</p>
              <p className="text-2xl font-semibold text-white mb-1">
                {curr.toLocaleString()}
              </p>
              <Delta value={delta} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DeveloperProgress;
