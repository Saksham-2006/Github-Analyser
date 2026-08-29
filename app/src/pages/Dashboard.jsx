import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Nav from "../components/Nav/Nav";
import Loader from "../components/Loader/Loader"
import ProfileCard from "../components/ProfileCard/ProfileCard";
import StatCard from "../components/StatCard/StatCard";
import LanguageChart from "../components/LanguageChart/LanguageChart";
import RecentActivity from "../components/RecentActivity/RecentActivity";
import ContributionGrid from "../components/ContributionGrid/ContributionGrid";

function Dashboard() {
  const [searchParams] = useSearchParams();

  const username = searchParams.get("username");

  const [realUser, setRealUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) {
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/github/${encodeURIComponent(
            username
          )}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to fetch profile."
          );
        }

        setRealUser(result.data);
      } catch (error) {
        setError(
          error.message ||
          "Unable to fetch GitHub profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

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
  const user = realUser || demoUser;
  const languages = [
    {
      language: "JavaScript",
      percentage: 48,
    },
    {
      language: "Python",
      percentage: 27,
    },
    {
      language: "TypeScript",
      percentage: 15,
    },
    {
      language: "Go",
      percentage: 7,
    },
    {
      language: "CSS",
      percentage: 3,
    },
  ];
  const activity = [
    { day: "Mon", commits: 8 },
    { day: "Tue", commits: 12 },
    { day: "Wed", commits: 5 },
    { day: "Thu", commits: 15 },
    { day: "Fri", commits: 9 },
    { day: "Sat", commits: 3 },
    { day: "Sun", commits: 7 },
  ];
  const contributions = Array.from({ length: 140 }, (_, index) => ({
    date: `2026-08-${(index % 28) + 1}`,
    count: Math.floor(Math.random() * 15),
  }));
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
        <div className="text-center">

          <h2 className="text-xl font-medium text-white">
            Unable to analyze profile
          </h2>

          <p className="mt-3 text-sm text-neutral-500">
            {error}
          </p>

        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="mx-20 border-l border-r border-neutral-700 pt-5">
          <section className="mx-10 mb-5">
            <Nav></Nav>
          </section>
          <section className="border-t border-neutral-700">
            <div className="flex">
              <div className="w-[50%] border-r border-neutral-700 py-10 px-10">
                <h1 className="text-6xl font-medium text-white pb-10">Understand your GitHub activity at a glance.</h1>
                <p className="text-neutral-400">Turn your GitHub activity into meaningful insights. Explore your commits, contribution patterns, coding streaks, repositories, and top languages — all in one clean dashboard.</p>
              </div>

              <div className="flex justify-center items-center w-[50%] py-10">
                <Loader></Loader>
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
                value={user.public_repos}
                description="Public repositories"
              />

              <StatCard
                title="Total Commits"
                value="1,284"
                description="Across all repositories"
              />

              <StatCard
                title="Current Streak"
                value="18 days"
                description="Keep it going!"
              />

              <StatCard
                title="Longest Streak"
                value="63 days"
                description="Your best streak"
              />

            </div>
          </section>
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