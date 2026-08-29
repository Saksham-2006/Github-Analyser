import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Nav from "../components/Nav/Nav";
import RepoStats from "../components/RepoStats/RepoStats";
import RepositorySearch from "../components/RepositorySearch/RepositorySearch";
import RepositoryCard from "../components/RepositoryCard/RepositoryCard";
import Pattern from "../components/Pattern/Pattern";
import Loader from "../components/Loader/Loader";
import { fetchUserProfile, fetchUserRepositories } from "../services/githubApi";

function Repos() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  // Fetched real repository list and pre-computed stats from backend
  const [repositories, setRepositories] = useState([]);
  const [repoStats, setRepoStats] = useState(null);
  const [repoUser, setRepoUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Client-side filter / sort state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("stars");
  const [language, setLanguage] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  // Reset filters when username changes
  useEffect(() => {
    setSearch("");
    setLanguage("All");
    setVisibleCount(6);
  }, [username]);

  useEffect(() => {
    if (!username) {
      setRepositories([]);
      setRepoStats(null);
      setRepoUser(null);
      setError("");
      setLoading(false);
      return;
    }

    const loadRepos = async () => {
      try {
        setLoading(true);
        setError("");
        // Fetch profile and repos concurrently so Nav shows the username
        const [reposData, profileData] = await Promise.all([
          fetchUserRepositories(username),
          fetchUserProfile(username).catch(() => null),
        ]);
        setRepositories(reposData.repositories || []);
        setRepoStats(reposData.stats || null);
        setRepoUser(profileData);
      } catch (err) {
        console.error("Repos fetch error:", err);
        setError(err.message || "Unable to fetch repositories.");
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, [username]);

  // Demo Fallback Repositories (shown when no username in URL)
  const demoRepositories = [
    {
      id: 1,
      name: "github-analyzer",
      description:
        "A tool for analyzing GitHub profiles and visualizing developer activity.",
      language: "JavaScript",
      stargazers_count: 1284,
      forks_count: 124,
      updated_at: "2026-08-27",
      updated: "2 days ago",
      created_at: "2026-01-15",
      html_url: "https://github.com/",
      topics: ["github", "analytics", "react"],
    },
    {
      id: 2,
      name: "portfolio",
      description:
        "Personal portfolio website built with React and modern web technologies.",
      language: "TypeScript",
      stargazers_count: 842,
      forks_count: 72,
      updated_at: "2026-08-26",
      updated: "3 days ago",
      created_at: "2026-02-10",
      html_url: "https://github.com/",
      topics: ["portfolio", "react", "typescript"],
    },
    {
      id: 3,
      name: "api-server",
      description:
        "REST API server providing authentication and user management.",
      language: "Python",
      stargazers_count: 634,
      forks_count: 48,
      updated_at: "2026-08-22",
      updated: "1 week ago",
      created_at: "2025-12-01",
      html_url: "https://github.com/",
      topics: ["api", "python", "backend"],
    },
    {
      id: 4,
      name: "weather-app",
      description:
        "A responsive weather application using a public weather API.",
      language: "JavaScript",
      stargazers_count: 421,
      forks_count: 35,
      updated_at: "2026-08-18",
      updated: "11 days ago",
      created_at: "2025-10-12",
      html_url: "https://github.com/",
      topics: ["weather", "api", "javascript"],
    },
    {
      id: 5,
      name: "task-manager",
      description:
        "A simple productivity application for managing daily tasks.",
      language: "TypeScript",
      stargazers_count: 318,
      forks_count: 26,
      updated_at: "2026-08-15",
      updated: "2 weeks ago",
      created_at: "2025-08-21",
      html_url: "https://github.com/",
      topics: ["productivity", "typescript"],
    },
    {
      id: 6,
      name: "machine-learning-lab",
      description:
        "Experiments and notebooks exploring machine learning concepts.",
      language: "Python",
      stargazers_count: 276,
      forks_count: 31,
      updated_at: "2026-08-10",
      updated: "2 weeks ago",
      created_at: "2025-07-03",
      html_url: "https://github.com/",
      topics: ["machine-learning", "python", "ai"],
    },
    {
      id: 7,
      name: "cli-tools",
      description:
        "Collection of useful command-line utilities for developers.",
      language: "Go",
      stargazers_count: 194,
      forks_count: 18,
      updated_at: "2026-08-05",
      updated: "3 weeks ago",
      created_at: "2025-05-18",
      html_url: "https://github.com/",
      topics: ["cli", "go", "developer-tools"],
    },
    {
      id: 8,
      name: "landing-page",
      description:
        "Modern responsive landing page with animations and interactions.",
      language: "CSS",
      stargazers_count: 121,
      forks_count: 14,
      updated_at: "2026-07-29",
      updated: "1 month ago",
      created_at: "2025-04-11",
      html_url: "https://github.com/",
      topics: ["css", "landing-page", "design"],
    },
  ];

  // Use real or demo data
  const isReal = !!username;
  const activeRepos = isReal ? repositories : demoRepositories;

  // Stats: use backend-computed stats when real, calculate from demo when not
  const activeStats = isReal && repoStats
    ? repoStats
    : {
        repositories: activeRepos.length,
        stars: activeRepos.reduce((t, r) => t + (r.stargazers_count || 0), 0),
        forks: activeRepos.reduce((t, r) => t + (r.forks_count || 0), 0),
        languages: new Set(activeRepos.map((r) => r.language).filter(Boolean)).size,
      };

  // Dynamically derive language list from current repo set
  const languages = useMemo(() => {
    const unique = activeRepos.map((r) => r.language).filter(Boolean);
    return ["All", ...new Set(unique)];
  }, [activeRepos]);

  // Client-side search → language filter → sort
  const filteredRepositories = useMemo(() => {
    const query = search.toLowerCase().trim();

    const filtered = activeRepos.filter((repo) => {
      const matchesSearch =
        !query ||
        repo.name.toLowerCase().includes(query) ||
        (repo.description || "").toLowerCase().includes(query) ||
        (repo.language || "").toLowerCase().includes(query);

      const matchesLanguage =
        language === "All" || repo.language === language;

      return matchesSearch && matchesLanguage;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        case "forks":
          return (b.forks_count || 0) - (a.forks_count || 0);
        case "updated":
          return new Date(b.updated_at) - new Date(a.updated_at);
        case "created":
          return new Date(b.created_at) - new Date(a.created_at);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [activeRepos, search, language, sortBy]);

  const visibleRepositories = filteredRepositories.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRepositories.length;

  // ── Loading state ──────────────────────────────────────────────────────────
  if (username && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-sm text-neutral-500">
            Loading repositories for @{username}...
          </p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (username && error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-medium text-white">
            Unable to load repositories
          </h2>
          <p className="mt-3 text-sm text-neutral-500">{error}</p>
          <a
            href="/analyze"
            className="mt-6 inline-block rounded-lg bg-[#5227FF] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#6339ff]"
          >
            Try Another Username
          </a>
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="mx-20 border-l border-r border-neutral-700 pt-5">
      <section className="mx-10 mb-5">
        <Nav user={repoUser} />
      </section>

      {/* Hero */}
      <section className="border-t border-neutral-700 flex">
        <div className="border-r border-neutral-700 py-10 px-10 w-[50%] flex flex-col justify-center">
          <h1 className="text-6xl font-medium text-white pb-10">
            Repositories
          </h1>
          <p className="text-neutral-400">
            Explore the projects behind{" "}
            {isReal ? `@${username}'s` : "this developer's"} activity.
          </p>
        </div>
        <div className="w-[50%]">
          <Pattern />
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-neutral-700 border-b">
        <RepoStats stats={activeStats} />
      </section>

      {/* Search + Sort */}
      <RepositorySearch
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Language filters + cards */}
      <section className="px-10 border-b border-neutral-700 pb-10">

        {/* Language filter pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {languages.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setLanguage(item);
                setVisibleCount(6);
              }}
              className={`px-4 py-2 text-sm transition ${
                language === item
                  ? "bg-[#5227FF] text-white"
                  : "border border-white/10 bg-white/2 text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Result count */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="text-gray-300">{visibleRepositories.length}</span>{" "}
            of{" "}
            <span className="text-gray-300">{filteredRepositories.length}</span>{" "}
            repositories
          </p>
        </div>

        {/* Repository grid */}
        {visibleRepositories.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {visibleRepositories.map((repo) => (
              <RepositoryCard key={repo.id || repo.name} repo={repo} />
            ))}
          </div>
        ) : (
          /* Empty state — only shown when filters yield no results */
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#120F17]/80 px-6 py-20 text-center">
            <h3 className="text-lg font-medium text-white">
              No repositories found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try a different search term or language filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setLanguage("All");
                setVisibleCount(6);
              }}
              className="mt-5 rounded-lg bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 6)}
              className="border border-white/10 px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              Load More
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Repos;