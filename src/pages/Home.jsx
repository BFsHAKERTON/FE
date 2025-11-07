import { useNavigate } from "react-router-dom";
import landpageBackground from "../assets/landpageBackground.png";

export default function Home({ isDark = true }) {
  const navigate = useNavigate();

  const containerStyle = isDark
    ? {
        background:
          "radial-gradient(circle at 15% 0%, rgba(118, 98, 255, 0.28), transparent 40%), radial-gradient(circle at 85% -10%, rgba(92, 162, 255, 0.22), transparent 55%), linear-gradient(145deg, rgba(12, 15, 34, 0.96) 0%, rgba(16, 18, 39, 0.98) 65%, rgba(6, 8, 20, 1) 100%)",
      }
    : {
        backgroundImage: `url(${landpageBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        backgroundRepeat: "no-repeat",
      };

  return (
    <div
      className="min-h-[calc(100vh-60px)] flex flex-col justify-center items-center pb-10 px-5 relative overflow-hidden"
      style={containerStyle}
    >
      <div className="relative flex flex-col items-center">
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
