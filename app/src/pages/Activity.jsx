import Nav from "../components/Nav/Nav";
import StatCard from "../components/StatCard/StatCard";
import ContributionGrid from "../components/ContributionGrid/ContributionGrid";
import CommitActivityChart from "../components/CommitActivityChart/CommitActivityChart";
import MostActiveDays from "../components/MostActiveDays/MostActiveDays";
import ActivityByWeek from "../components/ActivityByWeek/ActivityByWeek";
import Loader2 from "../components/Loader2/Loader2";

function Activity() {
  const contributions = Array.from({ length: 140 }, (_, index) => ({
    date: `2026-08-${(index % 28) + 1}`,
    count: Math.floor(Math.random() * 15),
  }));
  const commitData = [
    { month: "Jan", commits: 82 },
    { month: "Feb", commits: 104 },
    { month: "Mar", commits: 76 },
    { month: "Apr", commits: 143 },
    { month: "May", commits: 121 },
    { month: "Jun", commits: 168 },
    { month: "Jul", commits: 152 },
    { month: "Aug", commits: 190 },
  ];
  const activeDays = [
    { day: "Monday", commits: 82 },
    { day: "Tuesday", commits: 64 },
    { day: "Wednesday", commits: 91 },
    { day: "Thursday", commits: 73 },
    { day: "Friday", commits: 108 },
    { day: "Saturday", commits: 31 },
    { day: "Sunday", commits: 45 },
  ];
  const weeklyActivity = [
    { week: "W1", commits: 32 },
    { week: "W2", commits: 41 },
    { week: "W3", commits: 27 },
    { week: "W4", commits: 38 },
    { week: "W5", commits: 52 },
    { week: "W6", commits: 44 },
    { week: "W7", commits: 61 },
    { week: "W8", commits: 35 },
  ];
  return (
    <div className="mx-20 border-l border-r border-neutral-700 pt-5">
      <section className="mx-10 mb-5">
        <Nav></Nav>
      </section>
      <section className="border-t border-neutral-700">
        <div className="flex">
          <div className="w-[50%] border-r border-neutral-700 py-10 px-10">
            <h1 className="text-6xl font-medium text-white pb-10"> Activity </h1>
            <p className="text-neutral-400">A detailed look at your GitHub contribution patterns</p>
          </div>
          <div className="w-[50%] p-10 flex justify-center items-center">
            <Loader2></Loader2>
          </div>
        </div>
      </section>
      <section className="border-t border-neutral-700">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Repositories"
            value="42"
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