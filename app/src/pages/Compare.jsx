import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav/Nav";
import Loader from "../components/Loader1/Loader1";
import { compareUsers, fetchSavedProfiles } from "../services/githubApi";
import { Check } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loader4 from "../components/Loader4/Loader4";

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

  // ============================================================
  // SAVED PROFILES
  // ============================================================

  useEffect(() => {
    fetchSavedProfiles()
      .then(setSavedProfiles)
      .catch(() => setSavedProfiles([]));
  }, []);

  // ============================================================
  // LOAD COMPARISON
  // ============================================================

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

        const data = await compareUsers(
          user1Param,
          user2Param
        );

        setComparisonData(data);
      } catch (err) {
        console.error("Comparison fetch error:", err);
        setError(
          err.message ||
            "Unable to fetch GitHub profiles."
        );
      } finally {
        setLoading(false);
      }
    };

    loadComparison();
  }, [user1Param, user2Param]);

  // ============================================================
  // COMPARE FORM
  // ============================================================

  const handleCompare = (e) => {
    e.preventDefault();

    if (!input1.trim() || !input2.trim()) return;

    navigate(
      `/compare?user1=${encodeURIComponent(
        input1.trim()
      )}&user2=${encodeURIComponent(
        input2.trim()
      )}`
    );
  };

  // ============================================================
  // PROFILE CARD
  // ============================================================

  const renderProfileCard = (data) => {
    if (!data || !data.profile) return null;

    const { profile } = data;

    return (
      <div className="flex h-full min-w-0 flex-col items-center justify-center gap-4 border border-neutral-800 bg-neutral-900/40 p-6">
        <img
          src={profile.avatar_url}
          alt={profile.login}
          className="h-20 w-20 rounded-full border border-white/10 object-cover"
        />

        <div className="min-w-0 text-center">
          <h3 className="truncate text-lg font-medium text-white">
            {profile.name || profile.login}
          </h3>

          <p className="truncate text-sm text-neutral-500">
            @{profile.login}
          </p>
        </div>
      </div>
    );
  };

  // ============================================================
  // METRIC ROW
  // ============================================================

  const MetricRow = ({
    label,
    val1,
    val2,
    higherIsBetter = true,
  }) => {
    const v1 =
      Number(
        val1?.toString().replace(/,/g, "")
      ) || 0;

    const v2 =
      Number(
        val2?.toString().replace(/,/g, "")
      ) || 0;

    let winner = 0;

    if (v1 > v2) {
      winner = higherIsBetter ? 1 : 2;
    }

    if (v2 > v1) {
      winner = higherIsBetter ? 2 : 1;
    }

    return (
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-neutral-800/50 py-4 sm:gap-4">
        {/* USER 1 */}
        <div className="flex min-w-0 items-center justify-end gap-2 text-right font-medium text-white">
          <span>{val1}</span>

          {winner === 1 && (
            <span className="hidden items-center gap-1 bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400 sm:flex">
              <Check
                size={12}
                className="text-[#5227FF]"
              />
              Higher
            </span>
          )}
        </div>

        {/* LABEL */}
        <div className="whitespace-nowrap text-center text-[10px] uppercase tracking-wider text-neutral-500 sm:text-xs">
          {label}
        </div>

        {/* USER 2 */}
        <div className="flex min-w-0 items-center justify-start gap-2 text-left font-medium text-white">
          {winner === 2 && (
            <span className="hidden items-center gap-1 bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400 sm:flex">
              <Check
                size={12}
                className="text-[#5227FF]"
              />
              Higher
            </span>
          )}

          <span>{val2}</span>
        </div>
      </div>
    );
  };

  // ============================================================
  // RADAR DATA
  // ============================================================

  const getRadarData = (cData) => {
    if (
      !cData ||
      !cData.user1 ||
      !cData.user2
    ) {
      return [];
    }

    const getVal = (user, field) => {
      const stats = user.stats || {};
      const profile = user.profile || {};

      if (field === "Followers") {
        return profile.followers || 0;
      }

      if (field === "Following") {
        return profile.following || 0;
      }

      const value = stats[field];

      if (typeof value === "string") {
        return (
          Number(
            value.replace(/,/g, "")
          ) || 0
        );
      }

      return Number(value) || 0;
    };

    const metrics = [
      {
        label: "Repositories",
        key: "repositories",
      },
      {
        label: "Stars",
        key: "totalStars",
      },
      {
        label: "Forks",
        key: "totalForks",
      },
      {
        label: "Followers",
        key: "Followers",
      },
      {
        label: "Following",
        key: "Following",
      },
      {
        label: "Languages",
        key: "languageCount",
      },
      {
        label: "Total Commits",
        key: "totalCommits",
      },
      {
        label: "Current Streak",
        key: "currentStreak",
      },
      {
        label: "Longest Streak",
        key: "longestStreak",
      },
    ];

    const user1Name =
      cData.user1.profile.login;

    const user2Name =
      cData.user2.profile.login;

    return metrics.map((metric) => {
      const v1 = getVal(
        cData.user1,
        metric.key
      );

      const v2 = getVal(
        cData.user2,
        metric.key
      );

      const max =
        Math.max(v1, v2) || 1;

      return {
        subject: metric.label,

        [user1Name]:
          (v1 / max) * 100,

        [user2Name]:
          (v2 / max) * 100,

        [`${user1Name}_raw`]: v1,

        [`${user2Name}_raw`]: v2,

        fullMark: 100,
      };
    });
  };

  // ============================================================
  // RADAR TOOLTIP
  // ============================================================

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {
    if (
      !active ||
      !payload ||
      !payload.length
    ) {
      return null;
    }

    return (
      <div className="border border-neutral-700 bg-neutral-900 p-3 text-sm shadow-xl">
        <p className="mb-2 font-medium text-white">
          {label}
        </p>

        {payload.map((item, index) => (
          <p
            key={index}
            style={{
              color: item.color,
            }}
          >
            {item.name}:{" "}
            {
              item.payload[
                `${item.name}_raw`
              ]
            }
          </p>
        ))}
      </div>
    );
  };

  // ============================================================
  // LANGUAGE CARD
  // ============================================================

  const renderLanguageCard = (user) => {
    if (!user?.profile) return null;

    const languages =
      user.languages?.slice(0, 5) || [];

    return (
      <div className="flex h-full min-h-47.5 w-full flex-col border border-neutral-800 bg-neutral-900/40 p-6">
        <h4 className="mb-5 text-sm font-medium text-neutral-400">
          {user.profile.login}'s Top Languages
        </h4>

        <div className="flex flex-1 flex-col justify-between gap-3">
          {languages.map(
            (language, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-white">
                  {language.language}
                </span>

                <span className="text-neutral-500">
                  {language.percentage}%
                </span>
              </div>
            )
          )}

          {languages.length === 0 && (
            <div className="text-sm text-neutral-500">
              No language data available.
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="mx-0 sm:mx-6 lg:mx-20 min-h-screen border-x border-b border-neutral-700">

      {/* ======================================================== */}
      {/* NAVIGATION */}
      {/* ======================================================== */}

      <section className="mx-4 mb-5 pt-5 sm:mx-10">
        <Nav />
      </section>

      <section className="border-t border-neutral-700">

        {/* ====================================================== */}
        {/* HERO */}
        {/* ====================================================== */}

        <div className="flex flex-col border-b border-neutral-700 lg:flex-row">

          <div className="w-full border-b border-neutral-700 px-4 py-8 sm:px-10 sm:py-10 lg:w-1/2 lg:border-b-0 lg:border-r">
            <h1 className="mb-4 text-3xl font-medium text-white sm:text-5xl lg:text-6xl">
              Compare GitHub Developers
            </h1>

            <p className="max-w-2xl text-neutral-400">
              Compare GitHub activity,
              repositories and development
              patterns side by side.
            </p>
          </div>

          <div className="flex min-h-[220px] w-full items-center justify-center lg:w-1/2">
            <Loader4 />
          </div>

        </div>

        {/* ====================================================== */}
        {/* SEARCH FORM */}
        {/* ====================================================== */}

        <div className="border-b border-neutral-700">

          <form
            onSubmit={handleCompare}
            className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-10 sm:py-10"
          >

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">

              {/* USER 1 INPUT */}
              <div className="flex min-w-0 flex-1 flex-col gap-2">

                <input
                  type="text"
                  placeholder="Developer 1 Username"
                  className="w-full border border-neutral-800 bg-neutral-900 px-5 py-4 text-white focus:border-neutral-600 focus:outline-none"
                  value={input1}
                  onChange={(e) =>
                    setInput1(
                      e.target.value
                    )
                  }
                />

                {savedProfiles.length >
                  0 && (
                  <select
                    className="w-full border border-neutral-800 bg-neutral-900 px-5 py-2 text-sm text-neutral-400 focus:outline-none"
                    onChange={(e) =>
                      setInput1(
                        e.target.value
                      )
                    }
                    value={
                      savedProfiles.some(
                        (profile) =>
                          profile.username ===
                          input1
                      )
                        ? input1
                        : ""
                    }
                  >
                    <option value="">
                      Or select saved
                      profile...
                    </option>

                    {savedProfiles.map(
                      (profile) => (
                        <option
                          key={
                            profile.username
                          }
                          value={
                            profile.username
                          }
                        >
                          {profile.name ||
                            profile.username}{" "}
                          (@
                          {
                            profile.username
                          }
                          )
                        </option>
                      )
                    )}
                  </select>
                )}

              </div>

              {/* VS */}
              <div className="flex items-center justify-center px-2 py-2 font-bold text-neutral-600 lg:py-4">
                VS
              </div>

              {/* USER 2 INPUT */}
              <div className="flex min-w-0 flex-1 flex-col gap-2">

                <input
                  type="text"
                  placeholder="Developer 2 Username"
                  className="w-full border border-neutral-800 bg-neutral-900 px-5 py-4 text-white focus:border-neutral-600 focus:outline-none"
                  value={input2}
                  onChange={(e) =>
                    setInput2(
                      e.target.value
                    )
                  }
                />

                {savedProfiles.length >
                  0 && (
                  <select
                    className="w-full border border-neutral-800 bg-neutral-900 px-5 py-2 text-sm text-neutral-400 focus:outline-none"
                    onChange={(e) =>
                      setInput2(
                        e.target.value
                      )
                    }
                    value={
                      savedProfiles.some(
                        (profile) =>
                          profile.username ===
                          input2
                      )
                        ? input2
                        : ""
                    }
                  >
                    <option value="">
                      Or select saved
                      profile...
                    </option>

                    {savedProfiles.map(
                      (profile) => (
                        <option
                          key={
                            profile.username
                          }
                          value={
                            profile.username
                          }
                        >
                          {profile.name ||
                            profile.username}{" "}
                          (@
                          {
                            profile.username
                          }
                          )
                        </option>
                      )
                    )}
                  </select>
                )}

              </div>

            </div>

            <div className="mt-6 text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#5227FF] px-5 py-3 font-medium text-white transition hover:bg-[#6339ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Comparing..."
                  : "Compare Developers"}
              </button>
            </div>

          </form>

        </div>

        {/* ====================================================== */}
        {/* LOADING */}
        {/* ====================================================== */}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <Loader />

            <p className="mt-4">
              Analyzing profiles...
            </p>
          </div>
        )}

        {/* ====================================================== */}
        {/* ERROR */}
        {/* ====================================================== */}

        {error && !loading && (
          <div className="mx-auto my-10 w-[calc(100%-3rem)] max-w-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
            {error}
          </div>
        )}

        {/* ====================================================== */}
        {/* RESULTS */}
        {/* ====================================================== */}

        {comparisonData &&
          !loading && (
                            <div className="w-full p-4 sm:p-6 lg:p-10">

              {/* ================================================= */}
              {/* TOP ROW - 4 COLUMNS */}
              {/* ================================================= */}

              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

                {/* PROFILE 1 */}
                <div className="w-full">
                  {renderProfileCard(
                    comparisonData.user1
                  )}
                </div>

                {/* PROFILE 2 */}
                <div className="w-full">
                  {renderProfileCard(
                    comparisonData.user2
                  )}
                </div>

                {/* USER 1 LANGUAGES */}
                <div className="w-full">
                  {renderLanguageCard(
                    comparisonData.user1
                  )}
                </div>

                {/* USER 2 LANGUAGES */}
                <div className="w-full">
                  {renderLanguageCard(
                    comparisonData.user2
                  )}
                </div>

              </div>

              {/* ================================================= */}
              {/* BOTTOM ROW - 2 COLUMNS */}
              {/* ================================================= */}

              <div className="mt-6 grid w-full grid-cols-1 gap-6 xl:grid-cols-2">

                {/* =============================================== */}
                {/* COMPARISON STATISTICS */}
                {/* =============================================== */}

                <div className="w-full border border-neutral-800 bg-neutral-900/20 p-4 sm:p-8 overflow-x-auto">

                  <h4 className="mb-6 text-center text-lg font-medium text-white">
                    Comparison Statistics
                  </h4>

                  <div className="w-full">

                    <MetricRow
                      label="Repositories"
                      val1={
                        comparisonData
                          .user1
                          ?.stats
                          ?.repositories
                      }
                      val2={
                        comparisonData
                          .user2
                          ?.stats
                          ?.repositories
                      }
                    />

                    <MetricRow
                      label="Stars"
                      val1={
                        comparisonData
                          .user1
                          ?.stats
                          ?.totalStars
                      }
                      val2={
                        comparisonData
                          .user2
                          ?.stats
                          ?.totalStars
                      }
                    />

                    <MetricRow
                      label="Forks"
                      val1={
                        comparisonData
                          .user1
                          ?.stats
                          ?.totalForks
                      }
                      val2={
                        comparisonData
                          .user2
                          ?.stats
                          ?.totalForks
                      }
                    />

                    <MetricRow
                      label="Followers"
                      val1={
                        comparisonData
                          .user1
                          ?.profile
                          ?.followers
                      }
                      val2={
                        comparisonData
                          .user2
                          ?.profile
                          ?.followers
                      }
                    />

                    <MetricRow
                      label="Following"
                      val1={
                        comparisonData
                          .user1
                          ?.profile
                          ?.following
                      }
                      val2={
                        comparisonData
                          .user2
                          ?.profile
                          ?.following
                      }
                    />

                    <MetricRow
                      label="Languages"
                      val1={
                        comparisonData
                          .user1
                          ?.stats
                          ?.languageCount
                      }
                      val2={
                        comparisonData
                          .user2
                          ?.stats
                          ?.languageCount
                      }
                    />

                    <MetricRow
                      label="Total Commits"
                      val1={
                        comparisonData
                          .user1
                          ?.stats
                          ?.totalCommits
                      }
                      val2={
                        comparisonData
                          .user2
                          ?.stats
                          ?.totalCommits
                      }
                    />

                    <MetricRow
                      label="Current Streak (Days)"
                      val1={
                        comparisonData
                          .user1
                          ?.stats
                          ?.currentStreak
                      }
                      val2={
                        comparisonData
                          .user2
                          ?.stats
                          ?.currentStreak
                      }
                    />

                    <MetricRow
                      label="Longest Streak (Days)"
                      val1={
                        comparisonData
                          .user1
                          ?.stats
                          ?.longestStreak
                      }
                      val2={
                        comparisonData
                          .user2
                          ?.stats
                          ?.longestStreak
                      }
                    />

                  </div>
                </div>

                {/* =============================================== */}
                {/* PERFORMANCE RADAR */}
                {/* =============================================== */}

                <div className="flex min-h-[420px] sm:min-h-[500px] lg:min-h-[600px] w-full flex-col border border-neutral-800 bg-neutral-900/20 p-4 sm:p-8">

                  <h4 className="mb-6 text-center text-lg font-medium text-white">
                    Performance Radar
                  </h4>

                  <div className="flex min-h-0 flex-1 items-center justify-center">

                    <div className="h-[280px] sm:h-[360px] lg:h-[450px] w-full">

                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="75%"
                          data={getRadarData(
                            comparisonData
                          )}
                        >

                          <PolarGrid
                            stroke="#525252"
                          />

                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{
                              fill: "#a3a3a3",
                              fontSize: 12,
                            }}
                          />

                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                          />

                          <Radar
                            name={
                              comparisonData
                                .user1
                                ?.profile
                                ?.login
                            }
                            dataKey={
                              comparisonData
                                .user1
                                ?.profile
                                ?.login
                            }
                            stroke="#5227FF"
                            fill="#5227FF"
                            fillOpacity={0.5}
                          />

                          <Radar
                            name={
                              comparisonData
                                .user2
                                ?.profile
                                ?.login
                            }
                            dataKey={
                              comparisonData
                                .user2
                                ?.profile
                                ?.login
                            }
                            stroke="#00D9FF"
                            fill="#00D9FF"
                            fillOpacity={0.5}
                          />

                          <Tooltip
                            content={
                              <CustomTooltip />
                            }
                          />

                          <Legend />

                        </RadarChart>
                      </ResponsiveContainer>

                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

      </section>
    </div>
  );
}

export default Compare;