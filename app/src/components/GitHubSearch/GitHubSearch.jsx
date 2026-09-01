import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { fetchUserProfile } from "../../services/githubApi";

function GitHubSearch() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Please enter a GitHub username.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await fetchUserProfile(trimmedUsername);

      // Username is valid → go to dashboard
      navigate(
        `/?username=${encodeURIComponent(
          user.login
        )}`
      );
    } catch (err) {
      console.error("Analyze error:", err);
      setError(
        err.message ||
          "Unable to analyze GitHub profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div
          className={`flex items-center border p-1.5 sm:p-2 backdrop-blur-md transition ${
            error
              ? "border-red-500/40"
              : "border-white/10 focus-within:border-[#5227FF]/60"
          }`}
        >
          {/* Search icon */}
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center">
            <Search
              size={20}
              className="text-gray-500"
            />
          </div>

          {/* Input */}
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);

              if (error) {
                setError("");
              }
            }}
            placeholder="Enter GitHub username..."
            disabled={loading}
            className="h-10 sm:h-12 min-w-0 flex-1 bg-transparent px-1 sm:px-2 text-sm text-white outline-none placeholder:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-10 sm:h-12 shrink-0 items-center gap-1 sm:gap-2 bg-[#5227FF] px-3 sm:px-5 text-sm font-medium text-white transition hover:bg-[#6339ff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Analyzing
              </>
            ) : (
              <>
                Analyze
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <p className="mt-3 px-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Helper text */}
      {!error && (
        <p className="mt-3 px-2 text-xs text-gray-600">
          Enter a public GitHub username to begin the analysis.
        </p>
      )}
    </div>
  );
}

export default GitHubSearch;