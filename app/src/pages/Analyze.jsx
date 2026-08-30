import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Flame,
  FolderGit2,
  Code2,
  Bookmark,
  X,
} from "lucide-react";

import FeatureCard from "../components/FeatureCard/FeatureCard";
import Nav from "../components/Nav/Nav";
import Loader3 from "../components/Loadre3/Loader3";
import GitHubSearch from "../components/GitHubSearch/GitHubSearch";
import TrueFocus from "../components/TrueFocus/TrueFocus";
import { fetchSavedProfiles, deleteSavedProfile } from "../services/githubApi";

function Analyze() {
  const navigate = useNavigate();
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const loadSaved = () => {
    setLoadingSaved(true);
    fetchSavedProfiles()
      .then(setSavedProfiles)
      .catch(() => setSavedProfiles([]))
      .finally(() => setLoadingSaved(false));
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleDelete = async (username) => {
    try {
      await deleteSavedProfile(username);
      setSavedProfiles((prev) => prev.filter((p) => p.username !== username));
    } catch {
      // silently ignore
    }
  };

  const handleAnalyze = (username) => {
    navigate(`/?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="mx-20 border-l border-r border-neutral-700 pt-5">
      <section className="mx-10 mb-5">
        <Nav></Nav>
      </section>
      <section className="border-t border-neutral-700">
        <div className="flex">
          <div className="w-[50%] border-r border-neutral-700 py-10 px-10">
            <h1 className="text-6xl font-medium text-white pb-10">
              {" "}
              Analyze GitHub activity{" "}
            </h1>
            <p className="text-neutral-400">
              Enter a GitHub username and uncover contribution patterns, coding
              streaks, repositories, and programming languages.
            </p>
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

      {/* ── Saved Profiles ── */}
      <section className="border-b border-neutral-700 p-10">
        <div className="flex items-center gap-2 mb-6">
          <Bookmark size={22} className="text-[#5227FF]" />
          <p className="text-md uppercase tracking-widest text-white">
            Saved Profiles
          </p>
        </div>

        {loadingSaved ? (
          <p className="text-sm text-neutral-600 italic">Loading...</p>
        ) : savedProfiles.length === 0 ? (
          <p className="text-sm text-neutral-600 italic">
            No saved profiles yet. Analyze a profile and click{" "}
            <span className="text-neutral-400">☆ Save Profile</span> to bookmark
            it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedProfiles.map((p) => (
              <div
                key={p.username}
                className="relative flex items-center gap-4 border border-neutral-800 bg-neutral-900/60 px-5 py-4 transition hover:border-neutral-700"
              >
                {/* Avatar */}
                <img
                  src={p.avatarUrl || `https://github.com/${p.username}.png`}
                  alt={p.username}
                  className="h-12 w-12 rounded-full border border-white/10 object-cover shrink-0"
                />

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {p.name || p.username}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    @{p.username}
                  </p>
                </div>

                {/* Analyze button */}
                <button
                  onClick={() => handleAnalyze(p.username)}
                  className="shrink-0 border border-[#5227FF]/40 bg-[#5227FF]/10 px-3 py-1.5 text-xs font-medium text-[#5227FF] transition hover:bg-[#5227FF]/20"
                >
                  Analyze
                </button>

                {/* Remove button */}
                <button
                  onClick={() => handleDelete(p.username)}
                  title="Remove"
                  className="absolute top-1 right-1 text-neutral-700 transition hover:text-rose-400"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Analyze;