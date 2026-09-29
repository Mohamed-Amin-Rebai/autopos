export default function ProbabilityBar({
  probabilities,
  highlight,
  labels,
}: {
  probabilities: Record<string, number>;
  highlight?: string;
  labels?: Record<string, string>;
}) {
  const entries = Object.entries(probabilities);
  if (entries.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {entries.map(([key, value]) => {
        const pct = Math.round(value * 100);
        const isWinner = highlight ? key === highlight : value === 1;
        const label = labels?.[key] ?? key.replace("_", " ");

        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className={`text-[11px] capitalize w-24 truncate ${
                isWinner
                  ? "font-semibold text-gray-900"
                  : "text-gray-500"
              }`}
            >
              {label}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  isWinner
                    ? "bg-gradient-to-r from-violet-500 to-indigo-500"
                    : "bg-gray-300"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span
              className={`text-[11px] tabular-nums w-9 text-right ${
                isWinner ? "text-gray-900 font-medium" : "text-gray-400"
              }`}
            >
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}