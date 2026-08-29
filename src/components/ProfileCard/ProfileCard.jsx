function ProfileCard({ user }) {
  if (!user) return null;

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
  );
}

export default ProfileCard;