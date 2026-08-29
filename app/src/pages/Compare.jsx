import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav/Nav";
import Loader from "../components/Loader/Loader";
import { compareUsers, fetchSavedProfiles } from "../services/githubApi";
import { Check } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Compare() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const user1Param = searchParams.get("user1");
  const user2Param = searchParams.get("user2");

  const [input1, setInput1] = useState(user1Param || "");
  const [input2, setInput2] = useState(user2Param || "");

  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedProfiles, setSavedProfiles] = useState([]);

  useEffect(() => {
    fetchSavedProfiles()
      .then(setSavedProfiles)
      .catch(() => setSavedProfiles([]));
  }, []);

  useEffect(() => {
    if (!user1Param || !user2Param) {
      setComparisonData(null);
      setError("");
      setLoading(false);
      return;
    }

    const loadComparison = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await compareUsers(user1Param, user2Param);
        setComparisonData(data);
      } catch (err) {
        console.error("Comparison fetch error:", err);
        setError(err.message || "Unable to fetch GitHub profiles.");
      } finally {
        setLoading(false);
      }
    };

    loadComparison();
  }, [user1Param, user2Param]);

  const handleCompare = (e) => {
    e.preventDefault();
    if (!input1.trim() || !input2.trim()) return;
    navigate(`/compare?user1=${encodeURIComponent(input1.trim())}&user2=${encodeURIComponent(input2.trim())}`);
  };

  const renderProfileCard = (data) => {
    if (!data || !data.profile) return null;
    const { profile } = data;
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8 flex-1">
        <img
          src={profile.avatar_url}
          alt={profile.login}
          className="h-24 w-24 rounded-full border border-white/10 object-cover"
        />
        <div className="text-center">
          <h3 className="text-xl font-medium text-white">{profile.name || profile.login}</h3>
          <p className="text-neutral-500">@{profile.login}</p>
        </div>
      </div>
    );
  };

  const MetricRow = ({ label, val1, val2, higherIsBetter = true }) => {
    const v1 = Number(val1?.toString().replace(/,/g, '')) || 0;
    const v2 = Number(val2?.toString().replace(/,/g, '')) || 0;
    
    let winner = 0;
    if (v1 > v2) winner = higherIsBetter ? 1 : 2;
    if (v2 > v1) winner = higherIsBetter ? 2 : 1;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 border-b border-neutral-800/50">
        <div className="w-full sm:w-1/3 text-center sm:text-right font-medium text-white order-2 sm:order-1 flex items-center justify-center sm:justify-end gap-2">
          {val1} {winner === 1 && <span className="text-xs text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-md flex items-center gap-1"><Check size={12} className="text-[#5227FF]"/> Higher</span>}
        </div>
        <div className="w-full sm:w-1/3 text-center text-sm text-neutral-400 uppercase tracking-wider mb-2 sm:mb-0 order-1 sm:order-2">
          {label}
        </div>
        <div className="w-full sm:w-1/3 text-center sm:text-left font-medium text-white order-3 flex items-center justify-center sm:justify-start gap-2">
          {winner === 2 && <span className="text-xs text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-md flex items-center gap-1"><Check size={12} className="text-[#5227FF]"/> Higher</span>} {val2}
        </div>
      </div>
    );
  };

  const getRadarData = (cData) => {
    if (!cData || !cData.user1 || !cData.user2) return [];

    const getVal = (u, field) => {
      const stats = u.stats || {};
      const prof = u.profile || {};
      if (field === 'Followers') return prof.followers || 0;
      if (field === 'Following') return prof.following || 0;
      const v = stats[field];
      if (typeof v === 'string') return Number(v.replace(/,/g, '')) || 0;
      return Number(v) || 0;
    };

    const metrics = [
      { label: "Repositories", key: "repositories" },
      { label: "Stars", key: "totalStars" },
      { label: "Forks", key: "totalForks" },
      { label: "Followers", key: "Followers" },
      { label: "Following", key: "Following" },
      { label: "Languages", key: "languageCount" },
      { label: "Total Commits", key: "totalCommits" },
      { label: "Current Streak", key: "currentStreak" },
      { label: "Longest Streak", key: "longestStreak" }
    ];

    return metrics.map(m => {
      const v1 = getVal(cData.user1, m.key);
      const v2 = getVal(cData.user2, m.key);
      const max = Math.max(v1, v2) || 1; // avoid division by zero
      const user1Name = cData.user1.profile.login;
      const user2Name = cData.user2.profile.login;
      return {
        subject: m.label,
        [user1Name]: (v1 / max) * 100,
        [user2Name]: (v2 / max) * 100,
        [`${user1Name}_raw`]: v1,
        [`${user2Name}_raw`]: v2,
        fullMark: 100,
      };
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-lg shadow-xl text-sm">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }}>
              {p.name}: {p.payload[`${p.name}_raw`]}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mx-4 sm:mx-20 border-l border-r border-neutral-700 min-h-screen">
      <section className="mx-4 sm:mx-10 pt-5 mb-5">
        <Nav />
      </section>

      <section className="border-t border-neutral-700 p-6 sm:p-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-medium text-white mb-4">Compare GitHub Developers</h1>
          <p className="text-neutral-400 max-w-xl mx-auto">
            Compare GitHub activity, repositories and development patterns side by side.
          </p>
        </div>

        <form onSubmit={handleCompare} className="max-w-3xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Developer 1 Username"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-4 text-white focus:border-neutral-600 focus:outline-none"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
              />
              {savedProfiles.length > 0 && (
                <select 
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-2 text-neutral-400 text-sm focus:outline-none"
                  onChange={(e) => setInput1(e.target.value)}
                  value={savedProfiles.some(p => p.username === input1) ? input1 : ""}
                >
                  <option value="">Or select saved profile...</option>
                  {savedProfiles.map(p => (
                    <option key={p.username} value={p.username}>{p.name || p.username} (@{p.username})</option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="flex items-center justify-center text-neutral-600 font-bold px-2 py-4 sm:py-0">
              VS
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Developer 2 Username"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-4 text-white focus:border-neutral-600 focus:outline-none"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
              />
              {savedProfiles.length > 0 && (
                <select 
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-2 text-neutral-400 text-sm focus:outline-none"
                  onChange={(e) => setInput2(e.target.value)}
                  value={savedProfiles.some(p => p.username === input2) ? input2 : ""}
                >
                  <option value="">Or select saved profile...</option>
                  {savedProfiles.map(p => (
                    <option key={p.username} value={p.username}>{p.name || p.username} (@{p.username})</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="rounded-xl bg-[#5227FF] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#5227FF]/80"
              disabled={loading}
            >
              Compare Developers
            </button>
          </div>
        </form>

        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
            <Loader />
            <p className="mt-4">Analyzing profiles...</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {comparisonData && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              {renderProfileCard(comparisonData.user1)}
              {renderProfileCard(comparisonData.user2)}
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6 sm:p-10 mb-12">
              <h4 className="text-lg font-medium text-white text-center mb-8">Comparison Statistics</h4>
              
              <MetricRow 
                label="Repositories" 
                val1={comparisonData.user1?.stats?.repositories} 
                val2={comparisonData.user2?.stats?.repositories} 
              />
              <MetricRow 
                label="Stars" 
                val1={comparisonData.user1?.stats?.totalStars} 
                val2={comparisonData.user2?.stats?.totalStars} 
              />
              <MetricRow 
                label="Forks" 
                val1={comparisonData.user1?.stats?.totalForks} 
                val2={comparisonData.user2?.stats?.totalForks} 
              />
              <MetricRow 
                label="Followers" 
                val1={comparisonData.user1?.profile?.followers} 
                val2={comparisonData.user2?.profile?.followers} 
              />
              <MetricRow 
                label="Following" 
                val1={comparisonData.user1?.profile?.following} 
                val2={comparisonData.user2?.profile?.following} 
              />
              <MetricRow 
                label="Languages" 
                val1={comparisonData.user1?.stats?.languageCount} 
                val2={comparisonData.user2?.stats?.languageCount} 
              />
              <MetricRow 
                label="Total Commits" 
                val1={comparisonData.user1?.stats?.totalCommits} 
                val2={comparisonData.user2?.stats?.totalCommits} 
              />
              <MetricRow 
                label="Current Streak (Days)" 
                val1={comparisonData.user1?.stats?.currentStreak} 
                val2={comparisonData.user2?.stats?.currentStreak} 
              />
              <MetricRow 
                label="Longest Streak (Days)" 
                val1={comparisonData.user1?.stats?.longestStreak} 
                val2={comparisonData.user2?.stats?.longestStreak} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
                <h4 className="text-sm font-medium text-neutral-400 mb-4">{comparisonData.user1?.profile?.login}'s Top Languages</h4>
                <div className="flex flex-col gap-3">
                  {comparisonData.user1?.languages?.slice(0,5).map((l, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-white">{l.language}</span>
                      <span className="text-neutral-500">{l.percentage}%</span>
                    </div>
                  ))}
                  {(!comparisonData.user1?.languages || comparisonData.user1.languages.length === 0) && (
                    <div className="text-sm text-neutral-500">No language data available.</div>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
                <h4 className="text-sm font-medium text-neutral-400 mb-4">{comparisonData.user2?.profile?.login}'s Top Languages</h4>
                <div className="flex flex-col gap-3">
                  {comparisonData.user2?.languages?.slice(0,5).map((l, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-white">{l.language}</span>
                      <span className="text-neutral-500">{l.percentage}%</span>
                    </div>
                  ))}
                  {(!comparisonData.user2?.languages || comparisonData.user2.languages.length === 0) && (
                    <div className="text-sm text-neutral-500">No language data available.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Radar Chart Section */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6 sm:p-10 mb-12 flex flex-col items-center">
              <h4 className="text-lg font-medium text-white text-center mb-8">Performance Radar</h4>
              <div className="w-full max-w-2xl h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarData(comparisonData)}>
                    <PolarGrid stroke="#525252" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar 
                      name={comparisonData.user1?.profile?.login} 
                      dataKey={comparisonData.user1?.profile?.login} 
                      stroke="#5227FF" 
                      fill="#5227FF" 
                      fillOpacity={0.5} 
                    />
                    <Radar 
                      name={comparisonData.user2?.profile?.login} 
                      dataKey={comparisonData.user2?.profile?.login} 
                      stroke="#00D9FF" 
                      fill="#00D9FF" 
                      fillOpacity={0.5} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </section>
    </div>
  );
}

export default Compare;
