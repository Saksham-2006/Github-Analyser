const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    let message = data.message || "An error occurred while fetching GitHub data.";
    if (response.status === 404 || data.code === "NOT_FOUND") {
      message = "GitHub user not found.";
    } else if (response.status === 403 || data.code === "RATE_LIMITED") {
      message = "GitHub API rate limit reached. Please try again later.";
    }
    const error = new Error(message);
    error.status = response.status;
    error.code = data.code;
    throw error;
  }

  return data.data;
}

export async function fetchUserProfile(username) {
  const response = await fetch(
    `${API_BASE_URL}/api/github/${encodeURIComponent(username.trim())}`
  );
  return handleResponse(response);
}

export async function fetchUserDashboard(username) {
  const response = await fetch(
    `${API_BASE_URL}/api/github/${encodeURIComponent(username.trim())}/dashboard?fresh=true`
  );
  return handleResponse(response);
}

export async function fetchUserRepositories(username) {
  const response = await fetch(
    `${API_BASE_URL}/api/github/${encodeURIComponent(username.trim())}/repos`
  );
  return handleResponse(response);
}

export async function fetchUserActivity(username) {
  const response = await fetch(
    `${API_BASE_URL}/api/github/${encodeURIComponent(username.trim())}/activity`
  );
  return handleResponse(response);
}

// Analytics history — returns snapshots newest-first
export async function fetchUserHistory(username) {
  const response = await fetch(
    `${API_BASE_URL}/api/github/${encodeURIComponent(username.trim())}/history`
  );
  return handleResponse(response);
}

// Saved profiles
export async function saveProfile(profileData) {
  const response = await fetch(`${API_BASE_URL}/api/profiles/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
}

export async function fetchSavedProfiles() {
  const response = await fetch(`${API_BASE_URL}/api/profiles/saved`);
  return handleResponse(response);
}

export async function deleteSavedProfile(username) {
  const response = await fetch(
    `${API_BASE_URL}/api/profiles/saved/${encodeURIComponent(username.trim())}`,
    { method: "DELETE" }
  );
  return handleResponse(response);
}

export async function compareUsers(username1, username2) {
  const response = await fetch(
    `${API_BASE_URL}/api/github/compare/${encodeURIComponent(username1.trim())}/${encodeURIComponent(username2.trim())}?fresh=true`
  );
  return handleResponse(response);
}
