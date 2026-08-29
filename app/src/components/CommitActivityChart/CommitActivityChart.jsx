import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function CommitActivityChart({ data = [] }) {
  return (
    <div className="w-full p-10 backdrop-blur-md">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          Commit Activity
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Your commit activity over time
        </p>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f0f0f",
                border: "1px solid oklch(37.1% 0 none)",
                borderRadius: "8px",
                color: "#fff",
              }}
              labelStyle={{
                color: "#9ca3af",
              }}
              formatter={(value) => [`${value} commits`, "Activity"]}
            />

            <Line
              type="monotone"
              dataKey="commits"
              stroke="oklch(51.1% 0.262 276.966)"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#5227FF",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CommitActivityChart;