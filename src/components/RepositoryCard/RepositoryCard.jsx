import {
  Star,
  GitFork,
  ExternalLink,
  CircleDot,
} from "lucide-react";

function RepositoryCard({ repo }) {
  return (
    <div className="group flex h-full flex-col border border-neutral-700 p-10 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-white/20">

      {/* Top */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-white">
            {repo.name}
          </h3>

          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-400">
            {repo.description || "No description available."}
          </p>
        </div>

        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/10 hover:text-white"
          aria-label={`Open ${repo.name} on GitHub`}
        >
          <ExternalLink size={17} />
        </a>
      </div>

      {/* Topics */}
      {repo.topics?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {repo.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Bottom metadata */}
      <div className="mt-auto flex flex-wrap items-center gap-4 pt-6 text-sm text-gray-500">

        {repo.language && (
          <span className="flex items-center gap-2">
            <CircleDot
              size={12}
              className="text-[#5227FF]"
            />
            {repo.language}
          </span>
        )}

        <span className="flex items-center gap-1.5">
          <Star size={15} />
          {repo.stargazers_count}
        </span>

        <span className="flex items-center gap-1.5">
          <GitFork size={15} />
          {repo.forks_count}
        </span>

        <span className="ml-auto text-xs text-gray-600">
          Updated {repo.updated}
        </span>

      </div>
    </div>
  );
}

export default RepositoryCard;