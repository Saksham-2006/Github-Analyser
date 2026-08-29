import {
  FolderGit2,
  Star,
  GitFork,
  Code2,
} from "lucide-react";

import StatCard from "../StatCard/StatCard";

function RepoStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Repositories"
        value={stats.repositories}
        description="Public repositories"
        icon={<FolderGit2 size={18} />}
      />

      <StatCard
        title="Total Stars"
        value={stats.stars}
        description="Across all repositories"
        icon={<Star size={18} />}
      />

      <StatCard
        title="Total Forks"
        value={stats.forks}
        description="Across all repositories"
        icon={<GitFork size={18} />}
      />

      <StatCard
        title="Languages"
        value={stats.languages}
        description="Languages used"
        icon={<Code2 size={18} />}
      />

    </div>
  );
}

export default RepoStats;