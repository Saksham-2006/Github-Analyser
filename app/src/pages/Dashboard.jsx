import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Nav from "../components/Nav/Nav";
import Loader from "../components/Loader/Loader";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import StatCard from "../components/StatCard/StatCard";
import LanguageChart from "../components/LanguageChart/LanguageChart";
import RecentActivity from "../components/RecentActivity/RecentActivity";
import ContributionGrid from "../components/ContributionGrid/ContributionGrid";
import DeveloperProgress from "../components/DeveloperProgress/DeveloperProgress";
import { fetchUserDashboard } from "../services/githubApi";

function Dashboard() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  const [realDashboard, setRealDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) {
      setRealDashboard(null);
      setError("");
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchUserDashboard(username);
        setRealDashboard(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Unable to fetch GitHub profile.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [username]);

  // Demo Fallback Data
  const demoUser = {
    login: "octocat",
    name: "The Octocat",
    avatar_url: "https://github.com/octocat.png",
    bio: "GitHub's mascot and professional developer.",
    public_repos: 8,
    followers: 100,
    following: 20,
    html_url: "https://github.com/octocat",
  };

  const demoStats = {
    repositories: 42,
    totalCommits: "1,284",
    currentStreak: "18 days",
    longestStreak: "63 days",
  };

  const demoLanguages = [
    { language: "JavaScript", percentage: 48 },
    { language: "Python", percentage: 27 },
    { language: "TypeScript", percentage: 15 },
    { language: "Go", percentage: 7 },
    { language: "CSS", percentage: 3 },
  ];

  const demoActivity = [
    { day: "Mon", commits: 8 },
    { day: "Tue", commits: 12 },
    { day: "Wed", commits: 5 },
    { day: "Thu", commits: 15 },
    { day: "Fri", commits: 9 },
    { day: "Sat", commits: 3 },
    { day: "Sun", commits: 7 },
  ];

  const demoContributions = Array.from({ length: 140 }, (_, index) => ({
    date: `2026-08-${(index % 28) + 1}`,
    count: ((index * 3 + 1) % 15),
  }));

  // Resolve Real vs Demo data
  const isReal = !!username && !!realDashboard;
  const user = isReal ? realDashboard.profile : demoUser;
  const stats = isReal
    ? {
        repositories: realDashboard.stats.repositories,
        totalCommits: realDashboard.stats.totalCommits.toLocaleString(),
        currentStreak: `${realDashboard.stats.currentStreak} day${
          realDashboard.stats.currentStreak === 1 ? "" : "s"
        }`,
        longestStreak: `${realDashboard.stats.longestStreak} day${
          realDashboard.stats.longestStreak === 1 ? "" : "s"
        }`,
      }
    : demoStats;

  const languages = isReal ? realDashboard.languages : demoLanguages;
  const activity = isReal ? realDashboard.recentActivity : demoActivity;
  const contributions = isReal ? realDashboard.contributions : demoContributions;

  if (username && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-sm text-neutral-500">
            Analyzing @{username}...
          </p>
        </div>
      </div>
    );
  }

  if (username && error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-medium text-white">
            Unable to analyze profile
          </h2>
          <p className="mt-3 text-sm text-neutral-500">
            {error}
          </p>
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

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="mx-20 border-l border-r border-neutral-700 pt-5">
          <section className="mx-10 mb-5">
            <Nav user={isReal ? user : null} />
          </section>
          <section className="border-t border-neutral-700">
            <div className="flex">
              <div className="w-[50%] border-r border-neutral-700 py-10 px-10">
                <h1 className="text-6xl font-medium text-white pb-10">
                  Understand your GitHub activity at a glance.
                </h1>
                <p className="text-neutral-400">
                  Turn your GitHub activity into meaningful insights. Explore
                  your commits, contribution patterns, coding streaks,
                  repositories, and top languages — all in one clean dashboard.
                </p>
              </div>

              <div className="flex justify-center items-center w-[50%] py-10">
                <Loader />
              </div>
            </div>
          </section>
          <section className="border-t border-neutral-700">
            <ProfileCard user={user} />
          </section>
          <section className="border-t border-neutral-700">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Repositories"
                value={stats.repositories}
                description="Public repositories"
              />

              <StatCard
                title="Total Commits"
                value={stats.totalCommits}
                description="Across all repositories"
              />

              <StatCard
                title="Current Streak"
                value={stats.currentStreak}
                description="Keep it going!"
              />

              <StatCard
                title="Longest Streak"
                value={stats.longestStreak}
                description="Your best streak"
              />
            </div>
          </section>

          {/* Developer Progress — only visible when real data is loaded */}
          {isReal && <DeveloperProgress username={username} />}
          <section className="border-t border-b border-neutral-700 flex">
            <div className="w-[50%] border-r border-neutral-700">
              <LanguageChart data={languages} />
            </div>
            <div className="w-[50%]">
              <RecentActivity data={activity} />
            </div>
          </section>
        </div>
        <section className="w-[50%] border-l border-b border-r border-neutral-700 flex">
          <ContributionGrid data={contributions} />
        </section>
      </div>
    </>
  );
}

export default Dashboard;