import {
  Activity,
  Flame,
  FolderGit2,
  Code2,
} from "lucide-react";

import FeatureCard from "../components/FeatureCard/FeatureCard";
import Nav from "../components/Nav/Nav";
import Loader3 from "../components/Loadre3/Loader3";
import GitHubSearch from "../components/GitHubSearch/GitHubSearch";
import TrueFocus from '../components/TrueFocus/TrueFocus';

function Analyze() {
  return (
    <div className="mx-20 border-l border-r border-neutral-700 pt-5">
      <section className="mx-10 mb-5">
        <Nav></Nav>
      </section>
      <section className="border-t border-neutral-700">
        <div className="flex">
          <div className="w-[50%] border-r border-neutral-700 py-10 px-10">
            <h1 className="text-6xl font-medium text-white pb-10"> Analyze GitHub activity </h1>
            <p className="text-neutral-400">Enter a GitHub username and uncover contribution
              patterns, coding streaks, repositories, and
              programming languages.</p>
          </div>
          <div className="w-[50%] p-10 flex justify-center items-center pb-20">
            <Loader3></Loader3>
          </div>
        </div>
      </section>
      <section className="border-t border-neutral-700 p-10">
        <GitHubSearch />
        <div className="pt-10">
          <TrueFocus
            sentence=" No-login-required  Public-profiles-only"
            manualMode={false}
            blurAmount={5}
            borderColor="#5227FF"
            animationDuration={0.5}
            pauseBetweenAnimations={1}
          />
        </div>
      </section>
      <section className="border-t border-neutral-700 p-10 border-b">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <FeatureCard
            icon={<Activity size={30} />}
            title="Activity"
            description="Visualize contribution patterns and coding activity over time."
            color="#5227FF"
          />

          <FeatureCard
            icon={<Code2 size={30} />}
            title="Languages"
            description="Discover the programming languages and technologies you use most."
            color="#00D9FF"
          />

          <FeatureCard
            icon={<Flame size={30} />}
            title="Streaks"
            description="Track coding consistency and discover your contribution streaks."
            color="#FF6B35"
          />

          <FeatureCard
            icon={<FolderGit2 size={30} />}
            title="Repositories"
            description="Explore your projects, stars, forks, and repository activity."
            color="#00D084"
          />

        </div>
      </section>
    </div>
  );
}

export default Analyze;