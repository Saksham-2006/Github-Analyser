import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Nav from "../components/Nav/Nav";
import StatCard from "../components/StatCard/StatCard";
import ContributionGrid from "../components/ContributionGrid/ContributionGrid";
import CommitActivityChart from "../components/CommitActivityChart/CommitActivityChart";
import MostActiveDays from "../components/MostActiveDays/MostActiveDays";
import ActivityByWeek from "../components/ActivityByWeek/ActivityByWeek";
import Loader2 from "../components/Loader2/Loader2";
import Loader1 from "../components/Loader1/Loader1";
import { fetchUserDashboard } from "../services/githubApi";

function Activity() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  const [realData, setRealData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) {
      setRealData(null);
      setError("");
      setLoading(false);
      return;
    }

    const loadActivity = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchUserDashboard(username);
        setRealData(data);
      } catch (err) {
        console.error("Activity fetch error:", err);
        setError(err.message || "Unable to fetch GitHub activity.");
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [username]);

  // Demo Fallback Data
  const demoStats = {
    repositories: 42,
    totalCommits: "1,284",
    currentStreak: "18 days",
    longestStreak: "63 days",
  };

  const demoContributions = Array.from({ length: 140 }, (_, index) => ({
    date: `2026-08-${(index % 28) + 1}`,
    count: ((index * 3 + 1) % 15),
  }));

  const demoCommitData = [
    { month: "Jan", commits: 82 },
    { month: "Feb", commits: 104 },
    { month: "Mar", commits: 76 },
    { month: "Apr", commits: 143 },
    { month: "May", commits: 121 },
    { month: "Jun", commits: 168 },
    { month: "Jul", commits: 152 },
    { month: "Aug", commits: 190 },
  ];

  const demoActiveDays = [
    { day: "Monday", commits: 82 },
    { day: "Tuesday", commits: 64 },
    { day: "Wednesday", commits: 91 },
    { day: "Thursday", commits: 73 },
    { day: "Friday", commits: 108 },
    { day: "Saturday", commits: 31 },
    { day: "Sunday", commits: 45 },
  ];

  const demoWeeklyActivity = [
    { week: "W1", commits: 32 },
    { week: "W2", commits: 41 },
    { week: "W3", commits: 27 },
    { week: "W4", commits: 38 },
    { week: "W5", commits: 52 },
    { week: "W6", commits: 44 },
    { week: "W7", commits: 61 },
    { week: "W8", commits: 35 },
  ];

  const isReal = !!username && !!realData;
  const user = isReal ? realData.profile : null;

  const stats = isReal
    ? {
      repositories: realData.stats.repositories,
      totalCommits: realData.stats.totalCommits.toLocaleString(),
      currentStreak: `${realData.stats.currentStreak} day${realData.stats.currentStreak === 1 ? "" : "s"
        }`,
      longestStreak: `${realData.stats.longestStreak} day${realData.stats.longestStreak === 1 ? "" : "s"
        }`,
    }
    : demoStats;

  const contributions = isReal ? realData.contributions : demoContributions;
  const commitData = isReal ? realData.activity.commitActivity : demoCommitData;
  const activeDays = isReal ? realData.activity.mostActiveDays : demoActiveDays;
  const weeklyActivity = isReal
    ? realData.activity.activityByWeek
    : demoWeeklyActivity;

  if (username && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader1 />
          <p className="mt-4 text-sm text-neutral-500">
            Analyzing activity for @{username}...
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
            Unable to analyze activity
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

  return (
    <div className="mx-20 border-l border-r border-neutral-700 pt-5">
      <section className="mx-10 mb-5">
        <Nav user={user} />
      </section>
      <section className="border-t border-neutral-700">
        <div className="flex">
          <div className="w-[50%] border-r border-neutral-700 py-10 px-10">
            <h1 className="text-6xl font-medium text-white pb-10">
              Activity
            </h1>
            <p className="text-neutral-400">
              A detailed look at {isReal ? `@${username}'s` : "your"} GitHub
              contribution patterns
            </p>
          </div>
          <div className="w-[50%] p-10 flex justify-center items-center">
            <Loader2 />
          </div>
        </div>
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
      <section className="border-neutral-700 border-t">
        <ContributionGrid data={contributions} />
      </section>
      <section className="border-neutral-700 flex border-t">
        <CommitActivityChart data={commitData} />
      </section>
      <section className="border-neutral-700 flex border-t border-b">
        <div className="w-[50%] border-r border-neutral-700">
          <MostActiveDays data={activeDays} />
        </div>
        <div className="w-[50%]">
          <ActivityByWeek data={weeklyActivity} />
        </div>
      </section>
    </div>
  );
}

export default Activity;