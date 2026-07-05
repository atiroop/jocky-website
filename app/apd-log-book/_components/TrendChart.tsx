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
      <div className="rounded-2xl border-[3px] border-[#18122B] bg-white p-5 shadow-[5px_5px_0_0_#18122B]">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="font-black text-[#18122B]">{title}</h3>
          <span className="text-xs font-bold text-[#18122B]/50">{unit}</span>
        </div>
        <div className="h-44 rounded-2xl border-[2px] border-dashed border-[#18122B]/25 bg-[#FDF2F8] grid place-items-center text-sm font-bold text-[#18122B]/50">
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
    <div className="rounded-2xl border-[3px] border-[#18122B] bg-white p-5 shadow-[5px_5px_0_0_#18122B]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-black text-[#18122B]">{title}</h3>
          {secondLabel && (
            <p className="mt-1 text-xs font-bold text-[#18122B]/50">
              <span className="text-[#EC4899]">{primaryLabel}</span>
              <span className="mx-2 text-[#18122B]/25">/</span>
              <span className="text-[#06B6D4]">{secondLabel}</span>
            </p>
          )}
        </div>
        <span className="text-xs font-bold text-[#18122B]/50">{unit}</span>
      </div>

      <div className="overflow-hidden rounded-2xl border-[2px] border-[#18122B]/15 bg-[#FDF2F8]">
        <svg viewBox="0 0 640 210" role="img" aria-label={title} className="h-56 w-full">
          <line x1="18" y1="18" x2="18" y2="180" stroke="#18122B" strokeOpacity="0.2" />
          <line x1="18" y1="180" x2="622" y2="180" stroke="#18122B" strokeOpacity="0.2" />
          <line x1="18" y1="72" x2="622" y2="72" stroke="#18122B" strokeOpacity="0.1" strokeDasharray="4 6" />
          <line x1="18" y1="126" x2="622" y2="126" stroke="#18122B" strokeOpacity="0.1" strokeDasharray="4 6" />
          {secondaryPath && (
            <polyline
              points={secondaryPath}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          <polyline
            points={primaryPath}
            fill="none"
            stroke="#EC4899"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="24" y="30" fill="#18122B" fillOpacity="0.6" fontSize="11" fontWeight="700">
            {Math.round(max)}
          </text>
          <text x="24" y="174" fill="#18122B" fillOpacity="0.6" fontSize="11" fontWeight="700">
            {Math.round(min)}
          </text>
          {points.length > 0 && (
            <>
              <text x="18" y="202" fill="#18122B" fillOpacity="0.6" fontSize="11" fontWeight="700">
                {points[0].label}
              </text>
              <text x="622" y="202" fill="#18122B" fillOpacity="0.6" fontSize="11" fontWeight="700" textAnchor="end">
                {points[points.length - 1].label}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
