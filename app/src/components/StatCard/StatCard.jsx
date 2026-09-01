function StatCard({
  title,
  value,
  description,
  icon,
  className = "",
}) {
  return (
    <div
      className={`p-6 sm:p-8 lg:p-10 backdrop-blur-md border-r border-neutral-700 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">
          {title}
        </p>

        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-300">
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-4">
        <h3 className="text-3xl font-semibold tracking-tight text-white">
          {value}
        </h3>

        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default StatCard;