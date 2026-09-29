export default function MetaChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "gray" | "blue" | "amber" | "red";
}) {
  const tones = {
    gray: "bg-gray-50 text-gray-700 ring-gray-200/60",
    blue: "bg-blue-50 text-blue-700 ring-blue-200/60",
    amber: "bg-amber-50 text-amber-700 ring-amber-200/60",
    red: "bg-rose-50 text-rose-700 ring-rose-200/60",
  };
  return (
    <div className={`rounded-xl p-3 ring-1 ${tones[tone]}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium capitalize">{value}</p>
    </div>
  );
}

