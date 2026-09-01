import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MostActiveDays({ data = [] }) {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-10 backdrop-blur-md min-w-0">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          Most Active Days
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Your contribution activity by day of the week
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
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
            />

            <YAxis
              type="category"
              dataKey="day"
              width={80}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#9ca3af",
                fontSize: 12,
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
              dataKey="commits"
              fill="oklch(51.1% 0.262 276.966)"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default MostActiveDays;