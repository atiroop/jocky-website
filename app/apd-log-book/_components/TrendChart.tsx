type ChartPoint = {
  label: string;
  value: number | null;
  secondValue?: number | null;
};

type TrendChartProps = {
  title: string;
  unit: string;
  points: ChartPoint[];
  primaryLabel?: string;
  secondLabel?: string;
};

function buildPath(values: Array<number | null>, min: number, max: number) {
  const width = 640;
  const height = 180;
  const padX = 18;
  const padY = 18;
  const usableWidth = width - padX * 2;
  const usableHeight = height - padY * 2;
  const range = max - min || 1;
  const steps = Math.max(values.length - 1, 1);

  return values
    .map((value, index) => {
      if (value === null) return null;
      const x = padX + (index / steps) * usableWidth;
      const y = padY + (1 - (value - min) / range) * usableHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter(Boolean)
    .join(" ");
}

export default function TrendChart({
  title,
  unit,
  points,
  primaryLabel = "ค่า",
  secondLabel,
}: TrendChartProps) {
  const values = points.flatMap((point) => [
    point.value,
    point.secondValue ?? null,
  ]).filter((value): value is number => typeof value === "number");

  if (values.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="font-semibold text-white">{title}</h3>
          <span className="text-xs text-slate-600">{unit}</span>
        </div>
        <div className="h-44 rounded-lg border border-dashed border-slate-800 grid place-items-center text-sm text-slate-600">
          ยังไม่มีข้อมูลกราฟ
        </div>
      </div>
    );
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = Math.max((maxValue - minValue) * 0.12, 1);
  const min = minValue - padding;
  const max = maxValue + padding;
  const primaryPath = buildPath(points.map((point) => point.value), min, max);
  const secondaryPath = buildPath(
    points.map((point) => point.secondValue ?? null),
    min,
    max
  );

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          {secondLabel && (
            <p className="mt-1 text-xs text-slate-500">
              <span className="text-green-400">{primaryLabel}</span>
              <span className="mx-2 text-slate-700">/</span>
              <span className="text-cyan-400">{secondLabel}</span>
            </p>
          )}
        </div>
        <span className="text-xs text-slate-600">{unit}</span>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-800 bg-[#0D1117]">
        <svg viewBox="0 0 640 210" role="img" aria-label={title} className="h-56 w-full">
          <line x1="18" y1="18" x2="18" y2="180" stroke="#1e293b" />
          <line x1="18" y1="180" x2="622" y2="180" stroke="#1e293b" />
          <line x1="18" y1="72" x2="622" y2="72" stroke="#1e293b" strokeDasharray="4 6" />
          <line x1="18" y1="126" x2="622" y2="126" stroke="#1e293b" strokeDasharray="4 6" />
          {secondaryPath && (
            <polyline
              points={secondaryPath}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          <polyline
            points={primaryPath}
            fill="none"
            stroke="#22C55E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="24" y="30" fill="#64748b" fontSize="11">
            {Math.round(max)}
          </text>
          <text x="24" y="174" fill="#64748b" fontSize="11">
            {Math.round(min)}
          </text>
          {points.length > 0 && (
            <>
              <text x="18" y="202" fill="#64748b" fontSize="11">
                {points[0].label}
              </text>
              <text x="622" y="202" fill="#64748b" fontSize="11" textAnchor="end">
                {points[points.length - 1].label}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
