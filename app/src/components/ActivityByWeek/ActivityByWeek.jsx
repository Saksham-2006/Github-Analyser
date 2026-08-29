import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function ActivityByWeek({ data = [] }) {
  return (
    <div className="w-full p-10 backdrop-blur-md">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          Activity by Week
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Your weekly contribution activity
        </p>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 11,
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
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ActivityByWeek;