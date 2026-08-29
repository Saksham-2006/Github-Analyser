async function getUser(username) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "GitHub-Analyzer",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}`,
    { headers }
  );

  const body = await response.text();

  console.log("GitHub status:", response.status);
  console.log("GitHub remaining:", response.headers.get("x-ratelimit-remaining"));
  console.log("GitHub reset:", response.headers.get("x-ratelimit-reset"));

  if (!response.ok) {
    let errorMsg = `GitHub API error: ${response.status}`;
    try {
      const errorJson = JSON.parse(body);
      if (errorJson.message) {
        errorMsg = errorJson.message;
      }
    } catch {
      // Keep default message if response body is not JSON
    }
    const error = new Error(errorMsg);
    error.status = response.status;
    throw error;
  }

  const user = JSON.parse(body);

  return {
    login: user.login,
    name: user.name,
    avatar_url: user.avatar_url,
    bio: user.bio,
    public_repos: user.public_repos,
    followers: user.followers,
    following: user.following,
    html_url: user.html_url,
    location: user.location,
    created_at: user.created_at,
  };
}

module.exports = {
  getUser,
};