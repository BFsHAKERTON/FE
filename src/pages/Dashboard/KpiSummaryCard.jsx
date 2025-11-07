function formatVipRatio(vipRatio) {
  if (typeof vipRatio !== "number" || Number.isNaN(vipRatio)) {
    return "데이터 없음";
  }
  return `${vipRatio.toFixed(1)}%`;
}

function KpiSummaryCard({ surfaceClass, primaryTextClass, subtleTextClass, kpiData, vipRatio, isDark, topKeyword }) {
  const totalInquiries = typeof kpiData?.totalInquiries === "number" ? kpiData.totalInquiries : 0;
  const cards = [
    {
      label: "총 상담 건수",
      value: `${totalInquiries.toLocaleString()}`,
    },
    {
      label: "VIP 고객 비중",
      value: formatVipRatio(vipRatio),
    },
    {
      label: "가장 많이 언급된 태그",
      value: topKeyword
        ? `${topKeyword.keyword} · ${topKeyword.count.toLocaleString()}회`
        : "데이터 없음",
    },
  ];

  return (
    <div className={`rounded-2xl p-6 transition-all duration-300 ${surfaceClass} w-full`}>
      <h2 className={`text-lg font-semibold mb-4 ${primaryTextClass}`}>부가 지표</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`text-center p-4 rounded-lg ${isDark ? "bg-[#252c47]" : "bg-[#f6f7fd]"}`}
          >
            <p className={`text-xs mb-1 ${subtleTextClass}`}>{card.label}</p>
            <p className={`text-2xl font-bold ${primaryTextClass}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KpiSummaryCard;

