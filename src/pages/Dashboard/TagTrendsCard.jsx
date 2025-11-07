function TagTrendsCard({
  surfaceClass,
  headlineClass,
  primaryTextClass,
  subtleTextClass,
  tagTrendData,
  dayLabels = [],
}) {
  const labels = dayLabels.length ? dayLabels : ["월", "화", "수", "목", "금"];

  return (
    <div className={`rounded-2xl p-6 mb-8 transition-all duration-300 ${surfaceClass} w-full`}>
      <h2 className={`text-xl font-semibold mb-6 ${headlineClass}`}>
        태그별 요일 패턴 (최근 주중)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {Object.entries(tagTrendData).map(([tag, data]) => (
          <div key={tag} className="space-y-4">
            <h3 className={`text-sm font-semibold ${primaryTextClass}`}>{tag}</h3>
            {(() => {
              const values = Array.isArray(data) ? data : [];
              const maxValue = Math.max(...values, 0);
              return (
                <div className="flex items-end gap-2 h-32">
                  {values.map((value, idx) => {
                    const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t transition-all duration-200"
                          style={{
                            height: `${heightPercent}%`,
                            background: "linear-gradient(180deg, #4f46e5 0%, #60a5fa 100%)",
                            opacity: heightPercent > 0 ? 1 : 0.2,
                          }}
                          aria-hidden="true"
                        />
                        <span className={`text-xs ${subtleTextClass}`}>
                          {labels[idx] || ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            <div className="text-center">
              <span className={`text-2xl font-bold ${primaryTextClass}`}>
                {data.reduce((a, b) => a + b, 0)}
              </span>
              <span className={`text-xs ml-1 ${subtleTextClass}`}>건</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TagTrendsCard;

