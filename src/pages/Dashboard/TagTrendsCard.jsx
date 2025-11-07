function TagTrendsCard({ surfaceClass, headlineClass, primaryTextClass, subtleTextClass, tagTrendData }) {
  return (
    <div className={`rounded-2xl p-6 mb-8 transition-all duration-300 ${surfaceClass} w-full`}>
      <h2 className={`text-xl font-semibold mb-6 ${headlineClass}`}>태그별 트렌드 (최근 7일)</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {Object.entries(tagTrendData).map(([tag, data]) => (
          <div key={tag} className="space-y-4">
            <h3 className={`text-sm font-semibold ${primaryTextClass}`}>{tag}</h3>
            <div className="flex items-end gap-1 h-32">
              {data.map((value, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-linear-to-t from-blue-500 to-blue-300 rounded-t hover:from-blue-600 hover:to-blue-400 transition-colors"
                    style={{ height: `${(value / Math.max(...data)) * 100}%` }}
                    title={`${value}건`}
                  />
                  <span className={`text-xs ${subtleTextClass}`}>
                    {["월", "화", "수", "목", "금", "토", "일"][idx]}
                  </span>
                </div>
              ))}
            </div>
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

