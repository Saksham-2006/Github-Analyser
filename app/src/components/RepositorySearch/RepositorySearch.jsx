import { Search, X, ArrowUpDown } from "lucide-react";

function RepositorySearch({
  search,
  setSearch,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row p-10">

      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={22}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search repositories..."
          className="h-12 w-full border border-neutral-700 pl-11 pr-10 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#5227FF]/60"
        />

        {/* Clear search */}
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 transition hover:bg-white/10 hover:text-white"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="relative">
        <ArrowUpDown
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-12 w-full appearance-none border border-neutral-700 pl-11 pr-10 text-sm text-gray-300 outline-none transition focus:border-[#5227FF]/60 sm:w-52"
        >
          <option value="stars" className="bg-[#0f0f0f]">Most Stars</option>
          <option value="forks" className="bg-[#0f0f0f]">Most Forks</option>
          <option value="updated" className="bg-[#0f0f0f]">Recently Updated</option>
          <option value="created" className="bg-[#0f0f0f]">Recently Created</option>
          <option value="name" className="bg-[#0f0f0f]">Name</option>
        </select>

        {/* Dropdown arrow */}
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
          ▾
        </span>
      </div>

    </div>
  );
}

export default RepositorySearch;