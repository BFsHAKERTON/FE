import React from "react";

function RegionDistributionCard({
  isDark,
  surfaceClass,
  headlineClass,
  primaryTextClass,
  subtleTextClass,
  regionSegments,
  regionTotal,
  regionGradient,
}) {
  const fallbackGradient =
    regionGradient.length > 0 ? regionGradient : "#E5E7EB";

  return (
    <div
      // 👇 h-full이 이미 있었지만, 확실하게 유지합니다.
      className={`rounded-2xl px-6 pt-6 pb-6 transition-all duration-300 ${surfaceClass} w-full h-full md:min-h-[420px] flex flex-col`}
    >
      <h2 className={`text-xl font-semibold mb-6 ${headlineClass}`}>
        지역별 상담 비중
      </h2>
      <div className="flex flex-col items-center gap-6 flex-1 justify-center">
        <div className="relative">
          <div
            className="h-40 w-40 rounded-full shadow-inner"
            style={{ background: `conic-gradient(${fallbackGradient})` }}
          />
          <div className="absolute inset-4 rounded-full flex flex-col items-center justify-center bg-white/95 dark:bg-[#1b2138]/90 text-center">
            <span className="text-xs uppercase tracking-wide text-[#6b7196] dark:text-slate-300">
              전체
            </span>
            <span className="text-lg font-semibold text-[#2b2f4d] dark:text-slate-100">
              {regionTotal.toLocaleString()}건
            </span>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 gap-3">
          {regionSegments.map((segment) => {
            const percentage =
              regionTotal > 0
                ? ((segment.value / regionTotal) * 100).toFixed(1)
                : "0.0";

            return (
              <div
                key={segment.label}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2 bg-white/90 dark:bg-white/5 ${
                  isDark ? "border-white/10" : "border-white/60"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${primaryTextClass}`}>
                    {segment.label}
                  </p>
                  <p className={`text-xs ${subtleTextClass}`}>
                    {segment.value.toLocaleString()}건 · {percentage}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RegionDistributionCard;
