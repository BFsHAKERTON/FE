import { useNavigate } from "react-router-dom";

export default function Home({ isDark = true }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-start items-center pt-[120px] pb-10 px-5">
      <h1
        className="text-[clamp(3rem,8vw,6rem)] font-bold m-0 mb-6 -tracking-[0.02em] text-center leading-[1.1] font-sans"
        style={{ color: isDark ? "#ffffff" : "#111827" }}
      >
        Relay Tok
      </h1>
      <p
        className="text-[clamp(1.125rem,2vw,1.5rem)] font-light m-0 mb-8 tracking-[0.01em] text-center leading-[1.6] max-w-[600px] font-sans"
        style={{ color: isDark ? "rgba(255, 255, 255, 0.8)" : "#374151" }}
      >
        Every Voice. Every Team. Instantly.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="px-8 py-3 font-semibold text-base rounded-lg hover:scale-105 hover:shadow-xl active:scale-100 transition-all duration-200 shadow-lg cursor-pointer"
        style={{
          backgroundColor: isDark ? "#ffffff" : "#111827",
          color: isDark ? "#2C3539" : "#ffffff",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = isDark ? "#f3f4f6" : "#1f2937";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = isDark ? "#ffffff" : "#111827";
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}
