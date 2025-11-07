function HotKeywordsCard({ isDark, loading, error, keywords }) {
  return (
    <div
      className={`rounded-2xl p-6 mb-8 transition-all duration-300 border ${
        isDark
          ? "bg-linear-to-br from-[#1d2140] via-[#1a1f3a] to-[#181d36] border-white/10 shadow-[0_25px_80px_rgba(5,7,17,0.55)]"
          : "bg-linear-to-br from-[#f7f5ff] via-[#f1ecff] to-[#ede6ff] border-white/60 shadow-[0_35px_90px_rgba(99,102,241,0.25)]"
      }`}
      style={{
        backgroundImage: !isDark
          ? "radial-gradient(circle at 20% 0%, rgba(192, 189, 255, 0.45), transparent 55%), radial-gradient(circle at 85% 15%, rgba(186, 210, 255, 0.35), transparent 50%)"
          : "radial-gradient(circle at 25% -10%, rgba(118, 98, 255, 0.35), transparent 55%), radial-gradient(circle at 80% 0%, rgba(89, 140, 255, 0.3), transparent 50%)",
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h2
            className={`text-2xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-[#4c3dd1]"
            }`}
          >
            이번 주 인기 키워드
          </h2>
          <p
            className={`text-sm leading-relaxed ${
              isDark ? "text-white/70" : "text-[#615c8e]"
            }`}
          >
            실시간 상담 데이터에서 가장 많이 언급된 키워드입니다. 트렌드를 확인하고 대응 전략을 세워보세요.
          </p>
        </div>
      </div>
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/40 border-t-transparent" />
          </div>
        ) : error ? (
          <p
            className={`text-center text-sm font-medium ${
              isDark ? "text-red-300" : "text-red-500"
            }`}
          >
            {error}
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {keywords.map((k) => (
              <div
                key={k.keyword}
                className={`px-4 py-2 rounded-full border backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                  isDark
                    ? "bg-white/5 border-white/15 text-white/80"
                    : "bg-white/90 border-white/60 text-[#3a327a]"
                }`}
              >
                <span className="font-semibold">{k.keyword}</span>
                <span
                  className={`ml-2 text-xs ${
                    isDark ? "text-white/60" : "text-[#6b6799]"
                  }`}
                >
                  {k.count}회
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HotKeywordsCard;

