import { useNavigate } from "react-router-dom";
import landpageBackground from "../assets/landpageBackground.png";

export default function Home({ isDark = true }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-center items-center pb-10 px-5 relative overflow-hidden">
      {/* 배경 이미지 레이어 */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `url(${landpageBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
          filter: "blur(60px)",
          transform: "scale(1.1)",
          opacity: isDark ? 0.2 : 0.4,
          zIndex: -2,
        }}
      />
      {/* 어두운 오버레이 레이어 */}
      <div
        className="fixed inset-0"
        style={{
          backgroundColor: isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.1)",
          zIndex: -1,
        }}
      />
      {/* 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center">
        <h1
          className={`text-[clamp(3rem,8vw,6rem)] font-bold m-0 mb-6 -tracking-[0.02em] text-center leading-[1.1] font-sans ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Relay Tok
        </h1>
        <p
          className={`text-[clamp(1.125rem,2vw,1.5rem)] font-light m-0 mb-8 tracking-[0.01em] text-center leading-[1.6] max-w-[600px] font-sans ${
            isDark ? "text-white/80" : "text-gray-700"
          }`}
        >
          Every Voice. Every Team. Instantly.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className={`px-8 py-3 font-semibold text-base rounded-lg hover:scale-105 hover:shadow-xl active:scale-100 transition-all duration-200 shadow-lg cursor-pointer ${
            isDark
              ? "bg-white text-gray-800 hover:bg-gray-100"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
