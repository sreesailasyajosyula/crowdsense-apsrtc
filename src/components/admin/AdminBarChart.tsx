type BarChartProps = {
  data: { label: string; value: number }[];
  maxBars?: number;
  highlightMax?: boolean;
};

export function AdminBarChart({ data, maxBars, highlightMax = false }: BarChartProps) {
  const display = maxBars ? data.slice(0, maxBars) : data;
  const maxValue = Math.max(...display.map((d) => d.value), 1);
  const maxIdx = display.findIndex((d) => d.value === maxValue);

  return (
    <div className="flex h-48 items-end gap-2">
      {display.map((d, i) => {
        const heightPct = (d.value / maxValue) * 100;
        const isMax = highlightMax && i === maxIdx;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end justify-center">
              <div
                className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                  isMax
                    ? 'bg-gradient-to-t from-primary to-blue-400'
                    : 'bg-gradient-to-t from-slate-600 to-slate-500'
                }`}
                style={{ height: `${Math.max(heightPct, 3)}%` }}
                title={`${d.label}: ${d.value}`}
              />
            </div>
            <span className="truncate text-[10px] font-medium text-slate-500">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
