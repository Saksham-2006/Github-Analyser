import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function LanguageChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Top Languages</h2>
          <p className="mt-1 text-sm text-gray-500">
            Languages used across your repositories
          </p>
        </div>
        <div className="flex h-72 items-center justify-center">
          <p className="text-sm text-gray-600">No language data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          Top Languages
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Languages used across your repositories
        </p>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 0,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <XAxis
              type="number"
              hide
            />

            <YAxis
              type="category"
              dataKey="language"
              width={90}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#9ca3af",
                fontSize: 13,
              }}
            />

            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                backgroundColor: "#0f0f0f",
                border: "1px solid oklch(37.1% 0 none)",
                borderRadius: "8px",
                color: "#fff",
              }}
            />

            <Bar
              dataKey="percentage"
              radius={[0, 6, 6, 0]}
              fill="oklch(51.1% 0.262 276.966)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default LanguageChart;