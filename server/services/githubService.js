const cache = require("./cacheService");

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const GITHUB_REST_ENDPOINT = "https://api.github.com";

function getHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "GitHub-Analyzer",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

function formatRelativeTime(dateString) {
  if (!dateString) return "recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 3600) return "just now";
  const diffInHours = Math.floor(diffInSeconds / 3600);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 1) return "1 week ago";
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths <= 1) return "1 month ago";
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
}

function calculateStreaks(days) {
  if (!days || days.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < days.length; i++) {
    if (days[i].count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak walking backward from the last day
  const lastIndex = days.length - 1;
  const today = days[lastIndex];
  const yesterday = lastIndex > 0 ? days[lastIndex - 1] : null;

  let startIndex = -1;
  if (today && today.count > 0) {
    startIndex = lastIndex;
  } else if (yesterday && yesterday.count > 0) {
    startIndex = lastIndex - 1;
  }

  if (startIndex >= 0) {
    for (let i = startIndex; i >= 0; i--) {
      if (days[i].count > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
}

function computeActivityTrends(days) {
  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const fullDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // 1. Recent Activity (last 7 days)
  const last7Days = days.slice(-7);
  const recentActivity = last7Days.map((item) => {
    const d = new Date(item.date);
    const dayName = isNaN(d.getTime()) ? "Day" : shortDays[d.getUTCDay()];
    return {
      day: dayName,
      commits: item.count || 0,
      date: item.date,
    };
  });

  // Ensure we have 7 days if fewer were provided
  while (recentActivity.length < 7) {
    recentActivity.unshift({
      day: shortDays[recentActivity.length % 7],
      commits: 0,
      date: "",
    });
  }

  // 2. Most Active Days (Monday to Sunday)
  const daySums = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };

  days.forEach((item) => {
    const d = new Date(item.date);
    if (!isNaN(d.getTime())) {
      const fullDay = fullDays[d.getUTCDay()];
      if (daySums[fullDay] !== undefined) {
        daySums[fullDay] += item.count || 0;
      }
    }
  });

  const mostActiveDays = [
    { day: "Monday", commits: daySums.Monday },
    { day: "Tuesday", commits: daySums.Tuesday },
    { day: "Wednesday", commits: daySums.Wednesday },
    { day: "Thursday", commits: daySums.Thursday },
    { day: "Friday", commits: daySums.Friday },
    { day: "Saturday", commits: daySums.Saturday },
    { day: "Sunday", commits: daySums.Sunday },
  ];

  // 3. Activity by Week (last 8 weeks: W1 to W8)
  const activityByWeek = [];
  const totalDays = days.length;
  for (let w = 7; w >= 0; w--) {
    const end = totalDays - w * 7;
    const start = Math.max(0, end - 7);
    const weekDays = days.slice(start, end);
    const weekSum = weekDays.reduce((acc, curr) => acc + (curr.count || 0), 0);
    const weekNumber = 8 - w;
    activityByWeek.push({
      week: `W${weekNumber}`,
      commits: weekSum,
    });
  }

  // 4. Commit Activity by Month (last 8 months)
  const monthSums = new Map();
  days.forEach((item) => {
    const d = new Date(item.date);
    if (!isNaN(d.getTime())) {
      const monthKey = `${d.getUTCFullYear()}-${String(
        d.getUTCMonth() + 1
      ).padStart(2, "0")}`;
      const shortName = monthNames[d.getUTCMonth()];
      if (!monthSums.has(monthKey)) {
        monthSums.set(monthKey, { month: shortName, commits: 0 });
      }
      monthSums.get(monthKey).commits += item.count || 0;
    }
  });

  const sortedMonths = Array.from(monthSums.entries())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([, val]) => val);

  const commitActivity =
    sortedMonths.length > 8 ? sortedMonths.slice(-8) : sortedMonths;

  // Fallback to fill up months if less than 8
  if (commitActivity.length === 0) {
    commitActivity.push({ month: "Recent", commits: 0 });
  }

  return {
    recentActivity,
    mostActiveDays,
    activityByWeek,
    commitActivity,
  };
}

async function fetchGraphQLData(username) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        name
        login
        bio
        avatarUrl
        location
        url
        createdAt
        followers { totalCount }
        following { totalCount }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: UPDATED_AT, direction: DESC}) {
          totalCount
          nodes {
            id
            name
            description
            url
            isFork
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
            updatedAt
            createdAt
            repositoryTopics(first: 5) {
              nodes {
                topic {
                  name
                }
              }
            }
          }
        }
        contributionsCollection {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                weekday
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  const remaining = response.headers.get("x-ratelimit-remaining");
  if (remaining && parseInt(remaining, 10) === 0) {
    const error = new Error("GitHub API rate limit reached. Please try again later.");
    error.status = 403;
    error.code = "RATE_LIMITED";
    throw error;
  }

  if (response.status === 403) {
    const error = new Error("GitHub API rate limit reached. Please try again later.");
    error.status = 403;
    error.code = "RATE_LIMITED";
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`GitHub API error: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    const notFound = result.errors.some(
      (err) =>
        err.type === "NOT_FOUND" ||
        (err.message && err.message.toLowerCase().includes("could not resolve to a user"))
    );

    if (notFound || !result.data?.user) {
      const error = new Error("GitHub user not found.");
      error.status = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const rateLimitErr = result.errors.some(
      (err) =>
        err.type === "RATE_LIMITED" ||
        (err.message && err.message.toLowerCase().includes("rate limit"))
    );

    if (rateLimitErr) {
      const error = new Error("GitHub API rate limit reached. Please try again later.");
      error.status = 403;
      error.code = "RATE_LIMITED";
      throw error;
    }
  }

  if (!result.data?.user) {
    const error = new Error("GitHub user not found.");
    error.status = 404;
    error.code = "NOT_FOUND";
    throw error;
  }

  return result.data.user;
}

// Fallback REST fetch for user profile
async function fetchRestUser(username) {
  const response = await fetch(
    `${GITHUB_REST_ENDPOINT}/users/${encodeURIComponent(username)}`,
    { headers: getHeaders() }
  );

  if (response.status === 404) {
    const error = new Error("GitHub user not found.");
    error.status = 404;
    error.code = "NOT_FOUND";
    throw error;
  }

  if (response.status === 403) {
    const error = new Error("GitHub API rate limit reached. Please try again later.");
    error.status = 403;
    error.code = "RATE_LIMITED";
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`GitHub API error: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return await response.json();
}

// Full user data analysis
async function getFullUserData(username) {
  const cacheKey = `user:${username.toLowerCase()}:bundle`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const rawUser = await fetchGraphQLData(username);

    // 1. Profile
    const profile = {
      login: rawUser.login,
      name: rawUser.name || rawUser.login,
      avatar_url: rawUser.avatarUrl,
      bio: rawUser.bio || "",
      public_repos: rawUser.repositories.totalCount,
      followers: rawUser.followers.totalCount,
      following: rawUser.following.totalCount,
      html_url: rawUser.url,
      location: rawUser.location || "",
      created_at: rawUser.createdAt,
    };

    // 2. Repositories
    const repoNodes = rawUser.repositories.nodes || [];
    const repos = repoNodes.map((r, idx) => ({
      id: r.id || `${r.name}-${idx}`,
      name: r.name,
      description: r.description || "",
      language: r.primaryLanguage?.name || null,
      stargazers_count: r.stargazerCount || 0,
      forks_count: r.forkCount || 0,
      html_url: r.url,
      updated_at: r.updatedAt,
      updated: formatRelativeTime(r.updatedAt),
      created_at: r.createdAt,
      topics: (r.repositoryTopics?.nodes || []).map((t) => t.topic.name),
      isFork: r.isFork,
    }));

    // 3. Language byte aggregation
    const languageBytes = {};
    repoNodes.forEach((repo) => {
      const edges = repo.languages?.edges || [];
      edges.forEach((edge) => {
        const langName = edge.node?.name;
        const size = edge.size || 0;
        if (langName) {
          languageBytes[langName] = (languageBytes[langName] || 0) + size;
        }
      });
    });

    const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);
    let languages = Object.entries(languageBytes)
      .map(([language, bytes]) => ({
        language,
        bytes,
        percentage:
          totalBytes > 0
            ? Math.round((bytes / totalBytes) * 1000) / 10
            : 0,
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 8);

    // Fallback if no language byte distribution found but primary languages exist
    if (languages.length === 0) {
      const langCounts = {};
      repos.forEach((r) => {
        if (r.language) {
          langCounts[r.language] = (langCounts[r.language] || 0) + 1;
        }
      });
      const totalLangRepos = Object.values(langCounts).reduce((a, b) => a + b, 0);
      languages = Object.entries(langCounts)
        .map(([language, count]) => ({
          language,
          percentage:
            totalLangRepos > 0
              ? Math.round((count / totalLangRepos) * 1000) / 10
              : 0,
        }))
        .sort((a, b) => b.percentage - a.percentage);
    }

    // 4. Daily contribution history
    const weeks =
      rawUser.contributionsCollection?.contributionCalendar?.weeks || [];
    const allDays = [];
    weeks.forEach((week) => {
      (week.contributionDays || []).forEach((day) => {
        allDays.push({
          date: day.date,
          count: day.contributionCount || 0,
        });
      });
    });

    // 5. Streaks
    const { currentStreak, longestStreak } = calculateStreaks(allDays);

    // 6. Activity trends
    const { recentActivity, mostActiveDays, activityByWeek, commitActivity } =
      computeActivityTrends(allDays);

    // 7. Overall Stats
    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
    const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
    const totalContributions =
      rawUser.contributionsCollection?.contributionCalendar?.totalContributions ??
      allDays.reduce((sum, d) => sum + d.count, 0);

    const stats = {
      repositories: profile.public_repos,
      totalStars,
      totalForks,
      totalCommits: totalContributions,
      currentStreak,
      longestStreak,
      languageCount: languages.length,
    };

    // Return last 140 days for the 20-week contribution grid
    const contributions =
      allDays.length > 140 ? allDays.slice(-140) : allDays;

    const bundle = {
      profile,
      stats,
      languages,
      recentActivity,
      contributions,
      activity: {
        commitActivity,
        mostActiveDays,
        activityByWeek,
      },
      repositories: repos,
    };

    cache.set(cacheKey, bundle, 600); // 10 minutes cache
    return bundle;
  } catch (err) {
    if (err.status) throw err;

    // Fallback using REST if GraphQL is completely unavailable
    console.warn("GraphQL failed, attempting REST fallback for", username, err.message);
    const restUser = await fetchRestUser(username);

    const profile = {
      login: restUser.login,
      name: restUser.name || restUser.login,
      avatar_url: restUser.avatar_url,
      bio: restUser.bio || "",
      public_repos: restUser.public_repos,
      followers: restUser.followers,
      following: restUser.following,
      html_url: restUser.html_url,
      location: restUser.location || "",
      created_at: restUser.created_at,
    };

    const bundle = {
      profile,
      stats: {
        repositories: profile.public_repos,
        totalStars: 0,
        totalForks: 0,
        totalCommits: 0,
        currentStreak: 0,
        longestStreak: 0,
        languageCount: 0,
      },
      languages: [],
      recentActivity: computeActivityTrends([]).recentActivity,
      contributions: Array.from({ length: 140 }, () => ({ date: "", count: 0 })),
      activity: {
        commitActivity: [],
        mostActiveDays: [],
        activityByWeek: [],
      },
      repositories: [],
    };

    cache.set(cacheKey, bundle, 300);
    return bundle;
  }
}

async function getUser(username) {
  const bundle = await getFullUserData(username);
  return bundle.profile;
}

async function getDashboard(username) {
  const bundle = await getFullUserData(username);
  return {
    profile: bundle.profile,
    stats: bundle.stats,
    languages: bundle.languages,
    recentActivity: bundle.recentActivity,
    contributions: bundle.contributions,
    activity: bundle.activity,
  };
}

async function getRepositories(username) {
  const bundle = await getFullUserData(username);
  return {
    repositories: bundle.repositories,
    stats: {
      repositories: bundle.stats.repositories,
      stars: bundle.stats.totalStars,
      forks: bundle.stats.totalForks,
      languages: new Set(
        bundle.repositories.map((r) => r.language).filter(Boolean)
      ).size,
    },
  };
}

async function getActivity(username) {
  const bundle = await getFullUserData(username);
  return {
    stats: bundle.stats,
    contributions: bundle.contributions,
    commitActivity: bundle.activity.commitActivity,
    mostActiveDays: bundle.activity.mostActiveDays,
    activityByWeek: bundle.activity.activityByWeek,
  };
}

module.exports = {
  getUser,
  getDashboard,
  getRepositories,
  getActivity,
};