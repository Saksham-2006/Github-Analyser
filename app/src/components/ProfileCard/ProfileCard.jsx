import { useEffect, useState } from "react";
import { saveProfile, fetchSavedProfiles, deleteSavedProfile } from "../../services/githubApi";

function ProfileCard({ user }) {
  const [saveState, setSaveState] = useState("idle"); // "idle" | "saving" | "saved"

  // On mount, check if this profile is already saved
  useEffect(() => {
    if (!user?.login) return;

    fetchSavedProfiles()
      .then((profiles) => {
        const already = profiles.some(
          (p) => p.username === user.login.toLowerCase()
        );
        if (already) setSaveState("saved");
      })
      .catch(() => {}); // non-fatal
  }, [user?.login]);

  if (!user) return null;

  const handleSave = async () => {
    if (saveState === "saved" || saveState === "saving") return;

    setSaveState("saving");
    try {
      await saveProfile({
        username: user.login,
        githubId: user.id,
        name: user.name || user.login,
        avatarUrl: user.avatar_url,
        profileUrl: user.html_url,
      });
      setSaveState("saved");
    } catch {
      setSaveState("idle"); // revert so user can retry
    }
  };

  const handleUnsave = async () => {
    try {
      await deleteSavedProfile(user.login);
      setSaveState("idle");
    } catch {
      // silently ignore
    }
  };

  const isSaved = saveState === "saved";
  const isSaving = saveState === "saving";

  return (
    <div className="p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

        {/* Avatar */}
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="h-24 w-24 rounded-full border-2 border-white/10 object-cover"
        />

        {/* Profile information */}
        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-white">
              {user.name || user.login}
            </h2>

            <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400">
              @{user.login}
            </span>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              {user.bio}
            </p>
          )}

          {/* Stats */}
          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            <div>
              <span className="font-semibold text-white">
                {user.public_repos}
              </span>
              <span className="ml-1 text-gray-500">
                repositories
              </span>
            </div>

            <div>
              <span className="font-semibold text-white">
                {user.followers}
              </span>
              <span className="ml-1 text-gray-500">
                followers
              </span>
            </div>

            <div>
              <span className="font-semibold text-white">
                {user.following}
              </span>
              <span className="ml-1 text-gray-500">
                following
              </span>
            </div>
          </div>

        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 gap-2">
          {/* Save / Saved / Unsave button */}
          {user.id && (
            isSaved ? (
              <button
                onClick={handleUnsave}
                title="Click to unsave"
                className="group flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400"
              >
                <span className="group-hover:hidden">✓ Saved</span>
                <span className="hidden group-hover:inline">✕ Unsave</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "☆ Save Profile"}
              </button>
            )
          )}

          {/* GitHub profile button */}
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            View GitHub ↗
          </a>
        </div>

      </div>
    </div>
  );
}

export default ProfileCard;