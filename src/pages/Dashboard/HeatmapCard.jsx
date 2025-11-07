import { useEffect, useRef, useState } from "react";

function HeatmapCard({
  isDark,
  surfaceClass,
  headlineClass,
  subtleTextClass,
  hierarchicalTags,
  tagFilter,
  onTagFilterChange,
  tagHeatmapData,
  weeks,
  maxCount,
  getHeatmapColor,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      // 👇 변경됨: h-full 추가 (높이를 부모에 맞춤)
      className={`flex flex-col gap-4 rounded-2xl px-6 pt-6 pb-6 transition-all duration-300 ${surfaceClass} w-full h-full md:min-h-[420px]`}
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-semibold ${headlineClass}`}>
            태그 필터 히트맵 (최근 한달)
          </h2>
        </div>

        <div ref={dropdownRef} className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <label
              className={`block text-xs font-semibold mb-2 ${subtleTextClass}`}
            >
              태그 필터
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isDark
                  ? "bg-[#252c47] border-white/10 text-slate-100"
                  : "bg-[#f4f6ff] border-white/60 text-[#1f2440]"
              }`}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <span className="truncate">{tagFilter}</span>
              <svg
                className={`h-4 w-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </button>
            {isDropdownOpen ? (
              <div
                role="listbox"
                className={`absolute z-30 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border backdrop-blur-sm transition-all duration-200 ${
                  isDark
                    ? "bg-[#1f253b]/95 border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                    : "bg-white/95 border-white/80 shadow-[0_22px_50px_rgba(99,102,241,0.2)]"
                }`}
              >
                {hierarchicalTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      onTagFilterChange(tag);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      tagFilter === tag
                        ? isDark
                          ? "bg-white/10 text-emerald-200"
                          : "bg-[#ede6ff] text-[#3a2f8f]"
                        : isDark
                        ? "text-slate-100 hover:bg-white/5"
                        : "text-[#2b2f4d] hover:bg-[#f2efff]"
                    }`}
                    role="option"
                    aria-selected={tagFilter === tag}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p className={subtleTextClass}>
            {tagFilter === "전체" ? (
              "모든 상담 데이터"
            ) : (
              <>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {tagFilter}
                </span>
                <span className="ml-1">태그 포함</span>
              </>
            )}
          </p>
          <div className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
            총{" "}
            {Object.values(tagHeatmapData)
              .reduce((sum, count) => sum + count, 0)
              .toLocaleString()}
            건
          </div>
        </div>
      </div>

      <div className="overflow-x-auto relative flex-1">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className={`w-4 h-4 rounded-sm ${getHeatmapColor(
                    day.count,
                    maxCount
                  )} hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer relative`}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredDay({
                      date: day.date,
                      count: day.count,
                      percentage:
                        maxCount > 0
                          ? ((day.count / maxCount) * 100).toFixed(1)
                          : 0,
                      dayName: ["일", "월", "화", "수", "목", "금", "토"][
                        day.day
                      ],
                    });
                    setTooltipPosition({
                      x: rect.left + rect.width / 2,
                      y: rect.top - 10,
                    });
                  }}
                  onMouseLeave={() => setHoveredDay(null)}
                />
              ))}
            </div>
          ))}
        </div>

        {hoveredDay && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-blue-500 dark:border-blue-400 p-4 min-w-[220px] animate-pulse-subtle">
              <div className="text-center space-y-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {hoveredDay.dayName}요일
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {hoveredDay.date}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {hoveredDay.count.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    건
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-medium">
                    최댓값 대비 {hoveredDay.percentage}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span className="text-xs">0%</span>
            <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded-sm border border-gray-300 dark:border-gray-600" />
            <div className="w-4 h-4 bg-emerald-200 dark:bg-emerald-900 rounded-sm" />
            <div className="w-4 h-4 bg-emerald-400 dark:bg-emerald-700 rounded-sm" />
            <div className="w-4 h-4 bg-emerald-600 dark:bg-emerald-500 rounded-sm" />
            <div className="w-4 h-4 bg-emerald-700 dark:bg-emerald-400 rounded-sm" />
            <div className="w-4 h-4 bg-emerald-800 dark:bg-emerald-300 rounded-sm" />
            <span className="text-xs">100%</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            최대{" "}
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {maxCount.toLocaleString()}
            </span>
            건/일
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeatmapCard;
