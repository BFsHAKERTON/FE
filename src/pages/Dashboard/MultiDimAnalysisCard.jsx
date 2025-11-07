import React from "react";

function MultiDimAnalysisCard({
  surfaceClass,
  headlineClass,
  subtleTextClass,
  primaryTextClass,
  availableDimensions,
  dimension1,
  setDimension1,
  dimension2,
  setDimension2,
  getCurrentDimensionData,
  isDark,
}) {
  const currentData = getCurrentDimensionData();
  const total = currentData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div
      // 👇 변경됨: w-full, h-full, flex, flex-col 추가
      className={`rounded-2xl p-6 transition-all duration-300 ${surfaceClass} w-full h-full flex flex-col`}
    >
      <div className="mb-6">
        <h2 className={`text-xl font-semibold mb-4 ${headlineClass}`}>
          다차원 분석
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <label className={`text-sm font-medium ${subtleTextClass}`}>
              차원 1:
            </label>
            <select
              value={dimension1}
              onChange={(e) => setDimension1(e.target.value)}
              className={`px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isDark
                  ? "bg-[#252c47] border-white/10 text-slate-100"
                  : "bg-[#f4f6ff] border-white/60 text-[#1f2440]"
              }`}
            >
              {availableDimensions.map((dim) => (
                <option key={dim} value={dim}>
                  {dim}
                </option>
              ))}
            </select>
          </div>

          <span className={`text-lg font-semibold ${subtleTextClass}`}>×</span>

          <div className="flex items-center gap-2">
            <label className={`text-sm font-medium ${subtleTextClass}`}>
              차원 2:
            </label>
            <select
              value={dimension2}
              onChange={(e) => setDimension2(e.target.value)}
              className={`px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isDark
                  ? "bg-[#252c47] border-white/10 text-slate-100"
                  : "bg-[#f4f6ff] border-white/60 text-[#1f2440]"
              }`}
            >
              {availableDimensions
                .filter((d) => d !== dimension1)
                .map((dim) => (
                  <option key={dim} value={dim}>
                    {dim}
                  </option>
                ))}
            </select>
          </div>

          <div
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isDark
                ? "bg-blue-900/30 text-blue-200"
                : "bg-[#ede9fe] text-[#5143d9]"
            }`}
          >
            {currentData.length > 0
              ? `${total.toLocaleString()} 건`
              : "데이터 없음"}
          </div>
        </div>
      </div>

      {currentData.length > 0 ? (
        // 👇 변경됨: 내용이 길어질 경우 스크롤되도록 flex-1, overflow-y-auto 추가
        <div className="space-y-6 flex-1 overflow-y-auto">
          {currentData.map((item) => (
            <div key={item.dimension1Value} className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span
                  className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                  title={item.dimension1Value}
                >
                  {item.dimension1Value}
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400 ml-2">
                  {item.total.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2 pl-2">
                {Object.entries(item.breakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, count]) => {
                    const percentage = (count / item.total) * 100;
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span
                          className="text-xs text-gray-600 dark:text-gray-400 w-24 truncate"
                          title={key}
                        >
                          {key}
                        </span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                          {count.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-12 text-right">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 flex-1 flex flex-col justify-center items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            해당 조합의 데이터가 없습니다.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
            다른 차원 조합을 선택해주세요.
          </p>
        </div>
      )}
    </div>
  );
}

export default MultiDimAnalysisCard;
