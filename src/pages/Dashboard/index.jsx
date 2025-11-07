import { useEffect, useMemo, useState } from "react";
import HotKeywordsCard from "./HotKeywordsCard";
import HeatmapCard from "./HeatmapCard";
import RegionDistributionCard from "./RegionDistributionCard";
import MultiDimAnalysisCard from "./MultiDimAnalysisCard";
import TagTrendsCard from "./TagTrendsCard";
import KpiSummaryCard from "./KpiSummaryCard";
import { getWeeklyKeywords } from "../../shared/api/services/stats";

const HIERARCHICAL_TAGS = [
  "전체",
  "고객유형/VIP",
  "고객유형/반복컴플레인",
  "고객유형/신규고객",
  "고객유형/휴면고객",
  "상품문의/교환/사이즈",
  "상품문의/교환/색상",
  "상품문의/교환/불량",
  "상품문의/반품/단순변심",
  "상품문의/반품/사이즈",
  "상품문의/재고/입고문의",
  "상품문의/재고/품절",
  "배송문의/배송지연",
  "배송문의/배송조회",
  "배송문의/배송변경",
  "결제문의/결제실패",
  "결제문의/환불",
  "결제문의/쿠폰",
  "이벤트/할인",
  "이벤트/포인트",
  "기타/문의",
  "기타/건의",
];

const AVAILABLE_DIMENSIONS = [
  "유입페이지",
  "상담태그",
  "시간대",
  "요일",
  "담당자",
  "고객등급",
  "상담상태",
];

const KPI_DATA = {
  totalInquiries: 1234,
  avgResponseTime: 145,
};

const TAG_TREND_DATA = {
  "반품 및 교환": [45, 52, 48, 61, 58, 73, 68],
  구매: [38, 42, 35, 44, 51, 47, 49],
  상담: [62, 58, 65, 59, 72, 68, 71],
  배송: [28, 31, 35, 29, 38, 42, 40],
  결제: [22, 25, 19, 27, 24, 29, 31],
};

const REGION_SEGMENTS = [
  { label: "서울·경기", value: 148, color: "#7C3AED" },
  { label: "영남", value: 92, color: "#22D3EE" },
  { label: "충청", value: 74, color: "#34D399" },
  { label: "호남", value: 58, color: "#FACC15" },
  { label: "기타", value: 36, color: "#F472B6" },
];

const MULTI_DIMENSIONAL_DATA = {
  "유입페이지-상담태그": [
    {
      dimension1Value: "/products/shoes",
      total: 342,
      breakdown: {
        "반품 및 교환": 142,
        상담: 98,
        사이즈: 67,
        색상: 35,
      },
    },
    {
      dimension1Value: "/cart",
      total: 289,
      breakdown: {
        결제: 128,
        구매: 89,
        배송: 52,
        쿠폰: 20,
      },
    },
    {
      dimension1Value: "/products/bags",
      total: 198,
      breakdown: {
        상담: 87,
        재입고: 54,
        "반품 및 교환": 38,
        가격: 19,
      },
    },
    {
      dimension1Value: "/my-page",
      total: 156,
      breakdown: {
        회원: 78,
        포인트: 43,
        등급: 25,
        정보수정: 10,
      },
    },
    {
      dimension1Value: "/orders",
      total: 123,
      breakdown: {
        배송: 67,
        취소: 34,
        교환: 15,
        영수증: 7,
      },
    },
  ],
  "시간대-상담태그": [
    {
      dimension1Value: "09-11시",
      total: 234,
      breakdown: {
        구매: 89,
        상담: 67,
        배송: 45,
        "반품 및 교환": 33,
      },
    },
    {
      dimension1Value: "11-13시",
      total: 198,
      breakdown: {
        결제: 78,
        배송: 56,
        상담: 42,
        구매: 22,
      },
    },
    {
      dimension1Value: "13-15시",
      total: 267,
      breakdown: {
        "반품 및 교환": 112,
        상담: 78,
        배송: 54,
        사이즈: 23,
      },
    },
    {
      dimension1Value: "15-17시",
      total: 312,
      breakdown: {
        상담: 134,
        구매: 87,
        결제: 61,
        배송: 30,
      },
    },
    {
      dimension1Value: "17-19시",
      total: 223,
      breakdown: {
        배송: 98,
        상담: 67,
        취소: 38,
        환불: 20,
      },
    },
  ],
  "요일-상담태그": [
    {
      dimension1Value: "월요일",
      total: 189,
      breakdown: {
        배송: 87,
        상담: 54,
        취소: 32,
        환불: 16,
      },
    },
    {
      dimension1Value: "화요일",
      total: 234,
      breakdown: {
        구매: 98,
        상담: 76,
        결제: 43,
        배송: 17,
      },
    },
    {
      dimension1Value: "수요일",
      total: 267,
      breakdown: {
        상담: 112,
        "반품 및 교환": 89,
        사이즈: 44,
        색상: 22,
      },
    },
    {
      dimension1Value: "목요일",
      total: 298,
      breakdown: {
        구매: 134,
        결제: 87,
        상담: 56,
        배송: 21,
      },
    },
    {
      dimension1Value: "금요일",
      total: 312,
      breakdown: {
        결제: 156,
        구매: 89,
        배송: 47,
        상담: 20,
      },
    },
    {
      dimension1Value: "토요일",
      total: 156,
      breakdown: {
        상담: 67,
        구매: 54,
        "반품 및 교환": 25,
        배송: 10,
      },
    },
    {
      dimension1Value: "일요일",
      total: 123,
      breakdown: {
        상담: 56,
        구매: 38,
        배송: 20,
        기타: 9,
      },
    },
  ],
  "담당자-상담태그": [
    {
      dimension1Value: "김민수",
      total: 287,
      breakdown: {
        상담: 123,
        구매: 89,
        배송: 54,
        "반품 및 교환": 21,
      },
    },
    {
      dimension1Value: "이지은",
      total: 312,
      breakdown: {
        "반품 및 교환": 145,
        상담: 98,
        사이즈: 47,
        색상: 22,
      },
    },
    {
      dimension1Value: "박준호",
      total: 234,
      breakdown: {
        결제: 112,
        구매: 76,
        쿠폰: 32,
        환불: 14,
      },
    },
    {
      dimension1Value: "최서연",
      total: 267,
      breakdown: {
        배송: 134,
        취소: 78,
        교환: 38,
        환불: 17,
      },
    },
    {
      dimension1Value: "정우진",
      total: 198,
      breakdown: {
        상담: 98,
        회원: 56,
        포인트: 32,
        등급: 12,
      },
    },
  ],
  "고객등급-상담태그": [
    {
      dimension1Value: "VIP",
      total: 234,
      breakdown: {
        상담: 112,
        구매: 78,
        배송: 32,
        포인트: 12,
      },
    },
    {
      dimension1Value: "GOLD",
      total: 312,
      breakdown: {
        구매: 145,
        상담: 98,
        결제: 47,
        배송: 22,
      },
    },
    {
      dimension1Value: "SILVER",
      total: 398,
      breakdown: {
        상담: 178,
        "반품 및 교환": 112,
        배송: 76,
        구매: 32,
      },
    },
    {
      dimension1Value: "일반",
      total: 456,
      breakdown: {
        상담: 198,
        배송: 134,
        "반품 및 교환": 89,
        결제: 35,
      },
    },
  ],
  "상담상태-상담태그": [
    {
      dimension1Value: "진행중",
      total: 156,
      breakdown: {
        상담: 78,
        구매: 43,
        배송: 25,
        결제: 10,
      },
    },
    {
      dimension1Value: "대기중",
      total: 89,
      breakdown: {
        긴급: 45,
        상담: 28,
        배송: 12,
        기타: 4,
      },
    },
    {
      dimension1Value: "완료",
      total: 892,
      breakdown: {
        상담: 312,
        구매: 234,
        배송: 198,
        "반품 및 교환": 148,
      },
    },
    {
      dimension1Value: "보류",
      total: 67,
      breakdown: {
        "복잡한 문의": 34,
        상담: 18,
        "반품 및 교환": 10,
        기타: 5,
      },
    },
  ],
  "유입페이지-시간대": [
    {
      dimension1Value: "/products/shoes",
      total: 342,
      breakdown: {
        "09-11시": 45,
        "11-13시": 67,
        "13-15시": 98,
        "15-17시": 89,
        "17-19시": 43,
      },
    },
    {
      dimension1Value: "/cart",
      total: 289,
      breakdown: {
        "09-11시": 34,
        "11-13시": 78,
        "13-15시": 67,
        "15-17시": 76,
        "17-19시": 34,
      },
    },
    {
      dimension1Value: "/products/bags",
      total: 198,
      breakdown: {
        "09-11시": 23,
        "11-13시": 45,
        "13-15시": 56,
        "15-17시": 52,
        "17-19시": 22,
      },
    },
  ],
  "요일-시간대": [
    {
      dimension1Value: "월요일",
      total: 189,
      breakdown: {
        "09-11시": 34,
        "11-13시": 45,
        "13-15시": 52,
        "15-17시": 43,
        "17-19시": 15,
      },
    },
    {
      dimension1Value: "화요일",
      total: 234,
      breakdown: {
        "09-11시": 45,
        "11-13시": 56,
        "13-15시": 62,
        "15-17시": 54,
        "17-19시": 17,
      },
    },
    {
      dimension1Value: "수요일",
      total: 267,
      breakdown: {
        "09-11시": 52,
        "11-13시": 67,
        "13-15시": 76,
        "15-17시": 58,
        "17-19시": 14,
      },
    },
  ],
};

function createInquiryData() {
  const data = [];
  const today = new Date();

  for (let i = 89; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    const dailyCount = isWeekend
      ? Math.floor(Math.random() * 30) + 5
      : Math.floor(Math.random() * 60) + 20;

    for (let j = 0; j < dailyCount; j += 1) {
      const tagCount = Math.floor(Math.random() * 2) + 1;
      const selectedTags = new Set();

      while (selectedTags.size < tagCount) {
        const randomTag =
          HIERARCHICAL_TAGS[
            Math.floor(Math.random() * (HIERARCHICAL_TAGS.length - 1)) + 1
          ];
        selectedTags.add(randomTag);
      }

      data.push({
        date: dateStr,
        tags: Array.from(selectedTags),
        id: `inquiry-${dateStr}-${j}`,
      });
    }
  }

  return data;
}

function generateTagFilteredHeatmap(inquiryData, tagFilter) {
  const dateData = {};

  inquiryData
    .filter(
      (inquiry) => tagFilter === "전체" || inquiry.tags.includes(tagFilter)
    )
    .forEach((inquiry) => {
      if (!dateData[inquiry.date]) {
        dateData[inquiry.date] = 0;
      }
      dateData[inquiry.date] += 1;
    });

  return dateData;
}

function getHeatmapColor(count, max) {
  if (count === 0 || max === 0) return "bg-gray-100 dark:bg-gray-800";

  const percentage = (count / max) * 100;

  if (percentage <= 20) return "bg-emerald-200 dark:bg-emerald-900";
  if (percentage <= 40) return "bg-emerald-400 dark:bg-emerald-700";
  if (percentage <= 60) return "bg-emerald-600 dark:bg-emerald-500";
  if (percentage <= 80) return "bg-emerald-700 dark:bg-emerald-400";
  return "bg-emerald-800 dark:bg-emerald-300";
}

function buildWeeks(tagHeatmapData) {
  const weeks = [];
  const today = new Date();
  for (let i = 12; i >= 0; i -= 1) {
    const weekDays = [];
    for (let j = 6; j >= 0; j -= 1) {
      const date = new Date(today);
      date.setDate(date.getDate() - (i * 7 + j));
      const dateStr = date.toISOString().split("T")[0];
      weekDays.push({
        date: dateStr,
        count: tagHeatmapData[dateStr] || 0,
        day: date.getDay(),
      });
    }
    weeks.push(weekDays);
  }
  return weeks;
}

function computeRegionGradient(segments) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  if (!total) return "";

  return segments
    .reduce((acc, seg, index) => {
      const previous = segments
        .slice(0, index)
        .reduce((s, current) => s + current.value, 0);
      const start = ((previous / total) * 100).toFixed(2);
      const end = (((previous + seg.value) / total) * 100).toFixed(2);
      acc.push(`${seg.color} ${start}% ${end}%`);
      return acc;
    }, [])
    .join(", ");
}

function Dashboard({ isDark = true }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [tagFilter, setTagFilter] = useState("전체");
  const [dimension1, setDimension1] = useState("유입페이지");
  const [dimension2, setDimension2] = useState("상담태그");
  const [inquiryData] = useState(() => createInquiryData());

  useEffect(() => {
    let mounted = true;
    (async () => {
      setError("");
      setLoading(true);
      try {
        const data = await getWeeklyKeywords({ limit: 10 });
        if (mounted) {
          setKeywords(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (mounted) setError(err?.message || "데이터 로드 실패");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const tagHeatmapData = useMemo(
    () => generateTagFilteredHeatmap(inquiryData, tagFilter),
    [inquiryData, tagFilter]
  );

  const maxCount = useMemo(
    () => Math.max(0, ...Object.values(tagHeatmapData)),
    [tagHeatmapData]
  );

  const weeks = useMemo(() => buildWeeks(tagHeatmapData), [tagHeatmapData]);

  const regionTotal = useMemo(
    () => REGION_SEGMENTS.reduce((sum, seg) => sum + seg.value, 0),
    []
  );

  const regionGradient = useMemo(
    () => computeRegionGradient(REGION_SEGMENTS),
    []
  );

  const topKeyword = useMemo(() => {
    if (!Array.isArray(keywords) || keywords.length === 0) return null;
    return keywords.reduce((acc, cur) => (cur.count > acc.count ? cur : acc), keywords[0]);
  }, [keywords]);

  const containerStyle = isDark
    ? {
        color: "#f8f9ff",
        background:
          "radial-gradient(circle at 20% -10%, rgba(118, 98, 255, 0.3), transparent 45%), radial-gradient(circle at 85% -15%, rgba(92, 162, 255, 0.28), transparent 50%), linear-gradient(145deg, rgba(10, 13, 30, 0.98) 0%, rgba(14, 17, 38, 0.98) 55%, rgba(6, 8, 20, 1) 100%)",
      }
    : {
        color: "#111322",
        background:
          "radial-gradient(circle at 10% 0%, rgba(197, 195, 255, 0.58), transparent 42%), radial-gradient(circle at 90% -10%, rgba(186, 204, 255, 0.52), transparent 48%), linear-gradient(135deg, rgba(248, 249, 255, 0.98) 0%, rgba(233, 231, 255, 0.92) 55%, rgba(220, 215, 255, 0.9) 100%)",
      };

  const surfaceClass = isDark
    ? "bg-[#1f253b] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.45)] text-slate-100"
    : "bg-white/95 backdrop-blur-[2px] border border-white/70 shadow-[0_25px_60px_rgba(15,23,42,0.07)] text-[#1c2242]";

  const headlineClass = isDark ? "text-gray-100" : "text-[#4338ca]";
  const primaryTextClass = isDark ? "text-gray-200" : "text-[#2b2f4d]";
  const subtleTextClass = isDark ? "text-gray-400" : "text-[#6b7196]";

  const getCurrentDimensionData = () => {
    const key = `${dimension1}-${dimension2}`;
    return MULTI_DIMENSIONAL_DATA[key] || [];
  };

  return (
    <div
      className="relative min-h-screen p-6 pb-24 overflow-visible"
      style={containerStyle}
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-16 h-40"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, rgba(31, 41, 55, 1) 0%, rgba(20, 25, 46, 0.92) 35%, rgba(14, 17, 38, 0.75) 65%, rgba(9, 11, 24, 0.55) 85%, rgba(6, 8, 20, 0.35) 100%)"
            : "linear-gradient(to bottom, rgba(255, 255, 255, 0.96) 0%, rgba(247, 245, 255, 0.85) 35%, rgba(236, 230, 255, 0.62) 60%, rgba(228, 220, 255, 0.4) 80%, rgba(220, 215, 255, 0.16) 100%)",
        }}
      />

      <div className="mb-8">
        <h1
          className={`text-[clamp(2rem,4vw,3rem)] font-black tracking-tight text-[#1f2933] dark:text-purple-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.18)]`}
        >
          Relay Tok Dashboard
        </h1>
        <p className={`mt-3 text-base md:text-lg font-semibold text-purple-800`}>
          당신을 위한 상담 데이터 통합 분석
        </p>
      </div>

      <HotKeywordsCard
        isDark={isDark}
        loading={loading}
        error={error}
        keywords={keywords}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)] gap-6 mb-8 items-start">
        <HeatmapCard
          isDark={isDark}
          surfaceClass={surfaceClass}
          headlineClass={headlineClass}
          subtleTextClass={subtleTextClass}
          hierarchicalTags={HIERARCHICAL_TAGS}
          tagFilter={tagFilter}
          onTagFilterChange={setTagFilter}
          tagHeatmapData={tagHeatmapData}
          weeks={weeks}
          maxCount={maxCount}
          getHeatmapColor={getHeatmapColor}
        />

        <RegionDistributionCard
          isDark={isDark}
          surfaceClass={surfaceClass}
          headlineClass={headlineClass}
          primaryTextClass={primaryTextClass}
          subtleTextClass={subtleTextClass}
          regionSegments={REGION_SEGMENTS}
          regionTotal={regionTotal}
          regionGradient={regionGradient}
        />
        <div className="xl:col-span-2">
          <MultiDimAnalysisCard
            surfaceClass={surfaceClass}
            headlineClass={headlineClass}
            subtleTextClass={subtleTextClass}
            primaryTextClass={primaryTextClass}
            availableDimensions={AVAILABLE_DIMENSIONS}
            dimension1={dimension1}
            setDimension1={setDimension1}
            dimension2={dimension2}
            setDimension2={setDimension2}
            getCurrentDimensionData={getCurrentDimensionData}
            isDark={isDark}
          />
        </div>
      </div>

      <TagTrendsCard
        surfaceClass={surfaceClass}
        headlineClass={headlineClass}
        primaryTextClass={primaryTextClass}
        subtleTextClass={subtleTextClass}
        tagTrendData={TAG_TREND_DATA}
      />

      <KpiSummaryCard
        surfaceClass={surfaceClass}
        primaryTextClass={primaryTextClass}
        subtleTextClass={subtleTextClass}
        kpiData={KPI_DATA}
        isDark={isDark}
        topKeyword={topKeyword}
      />
    </div>
  );
}

export default Dashboard;
