import { useMemo } from "react";

function ContributionGrid({ data = [], weeks = 20 }) {
  const grid = useMemo(() => {
    const result = [];

    for (let week = 0; week < weeks; week++) {
      const weekData = [];

      for (let day = 0; day < 7; day++) {
        const index = week * 7 + day;

        weekData.push(
          data[index] || {
            date: "",
            count: 0,
          }
        );
      }

      result.push(weekData);
    }

    return result;
  }, [data, weeks]);

  const getLevel = (count) => {
    if (count === 0) return "bg-white/5";
    if (count <= 2) return "bg-indigo-950";
    if (count <= 5) return "bg-indigo-800";
    if (count <= 10) return "bg-indigo-600";

    return "bg-indigo-400";
  };

  return (
    <div className="w-full flex justify-between p-10 backdrop-blur-md">

      {/* Header */}
      <div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Contribution Activity
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your contribution activity over the last few months
          </p>
        </div>

        {/* Grid */}
        <div className="w-full overflow-x-auto">
          <div className="flex min-w-max gap-1">

            {grid.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="flex flex-col gap-1"
              >
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    title={
                      day.date
                        ? `${day.count} contributions on ${day.date}`
                        : ""
                    }
                    className={`h-3 w-3 rounded-sm ${getLevel(
                      day.count
                    )}`}
                  />
                ))}
              </div>
            ))}

          </div>
        </div>

      </div>
      {/* Legend */}
      <div className="mt-5 flex justify-end gap-2 text-xs items-end text-gray-500">
        <span>Less</span>

        <div className="h-3 w-3 rounded-sm bg-white/5" />
        <div className="h-3 w-3 rounded-sm bg-indigo-950" />
        <div className="h-3 w-3 rounded-sm bg-indigo-800" />
        <div className="h-3 w-3 rounded-sm bg-indigo-600" />
        <div className="h-3 w-3 rounded-sm bg-indigo-400" />

        <span>More</span>
      </div>

    </div>
  );
}

export default ContributionGrid;