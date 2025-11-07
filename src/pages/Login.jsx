import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startKakaoLogin, mockLogin } from "../shared/api/services/auth";
import landpageBackground from "../assets/landpageBackground.png";

function Login({ isDark = true }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const containerStyle = isDark
    ? {
        color: "#f5f6ff",
        background:
          "radial-gradient(circle at 20% -10%, rgba(118, 98, 255, 0.35), transparent 45%), radial-gradient(circle at 80% -15%, rgba(89, 140, 255, 0.25), transparent 50%), linear-gradient(135deg, rgba(13, 16, 35, 0.95) 0%, rgba(17, 20, 43, 0.98) 60%, rgba(8, 10, 21, 1) 100%)",
      }
    : {
        color: "#1f2440",
        backgroundImage: `url(${landpageBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        backgroundRepeat: "no-repeat",
      };

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // TODO: 실제 로그인 API 연결 시 여기서 호출
      await new Promise((r) => setTimeout(r, 600));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "로그인에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen grid place-items-center px-6 py-12 relative overflow-hidden"
      style={containerStyle}
    >
      <form
        onSubmit={onSubmit}
        className={`relative z-10 w-full max-w-md rounded-[28px] px-8 py-10 flex flex-col gap-6 backdrop-blur-xl transition-all duration-300 ${
          isDark
            ? "bg-[#1f2237]/85 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
            : "bg-white/75 border border-white/60 shadow-[0_35px_120px_rgba(103,112,255,0.25)]"
        }`}
      >
        <div className="flex flex-col gap-2 text-center">
          <span
            className={`text-lg font-bold ${
              isDark ? "text-indigo-200" : "text-[#7a84c4]"
            }`}
          >
            Relay Tok
          </span>

          <p
            className={`text-sm leading-relaxed ${
              isDark ? "text-white/60" : "text-[#5e6996]"
            }`}
          >
            로그인을 위해 이메일과 비밀번호를 입력해주세요.
          </p>
        </div>
        <label className="flex flex-col gap-2 text-left">
          <span
            className={`text-xs font-medium tracking-wide ${
              isDark ? "text-white/70" : "text-[#505c97]"
            }`}
          >
            이메일
          </span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            required
            className={`px-4 py-3 rounded-xl border text-sm font-medium placeholder:text-[#a6afd9] focus:outline-none transition-all duration-200 shadow-[0_6px_18px_rgba(17,24,39,0.08)] ${
              isDark
                ? "bg-[#2c314f]/80 border-white/5 text-white focus:border-[#9288ff]/70 focus:shadow-[0_0_0_4px_rgba(132,125,255,0.2)]"
                : "bg-white/80 border-white/60 text-[#1f2440] focus:border-[#7565ff] focus:shadow-[0_0_0_4px_rgba(117,101,255,0.18)]"
            }`}
          />
        </label>
        <label className="flex flex-col gap-2 text-left">
          <span
            className={`text-xs font-medium tracking-wide ${
              isDark ? "text-white/70" : "text-[#505c97]"
            }`}
          >
            비밀번호
          </span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="비밀번호"
            required
            className={`px-4 py-3 rounded-xl border text-sm font-medium placeholder:text-[#a6afd9] focus:outline-none transition-all duration-200 shadow-[0_6px_18px_rgba(17,24,39,0.08)] ${
              isDark
                ? "bg-[#2c314f]/80 border-white/5 text-white focus:border-[#9288ff]/70 focus:shadow-[0_0_0_4px_rgba(132,125,255,0.2)]"
                : "bg-white/80 border-white/60 text-[#1f2440] focus:border-[#7565ff] focus:shadow-[0_0_0_4px_rgba(117,101,255,0.18)]"
            }`}
          />
        </label>
        {error ? (
          <div className="text-xs text-rose-400 text-left">{error}</div>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className={`cursor-pointer w-full px-4 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 transform shadow-[0_15px_40px_rgba(117,101,255,0.35)] hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(117,101,255,0.45)] disabled:opacity-60 disabled:cursor-not-allowed ${
            isDark
              ? "bg-[#7565ff] hover:bg-[#6a5af4] text-white"
              : "bg-[#7565ff] hover:bg-[#6250f3] text-white"
          }`}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
        <div className="flex items-center gap-3">
          <div
            className={`h-px flex-1 ${isDark ? "bg-white/10" : "bg-white/70"}`}
          />
          <span
            className={`text-xs font-medium tracking-wider uppercase ${
              isDark ? "text-white/50" : "text-[#8a96d6]"
            }`}
          >
            또는
          </span>
          <div
            className={`h-px flex-1 ${isDark ? "bg-white/10" : "bg-white/70"}`}
          />
        </div>
        <button
          type="button"
          onClick={async () => {
            setError("");
            setLoading(true);
            try {
              const data = await mockLogin({ email, password });
              try {
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
              } catch (storageError) {
                console.warn("토큰 저장에 실패했습니다.", storageError);
              }
              navigate("/dashboard");
            } catch (err) {
              setError(err?.message || "Mock 로그인 실패");
            } finally {
              setLoading(false);
            }
          }}
          className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-[0_10px_30px_rgba(16,185,129,0.25)] ${
            isDark
              ? "bg-emerald-500/90 border border-emerald-400/80 text-white hover:bg-emerald-400/90"
              : "bg-emerald-500 border border-emerald-400 text-white hover:bg-emerald-500/90"
          }`}
        >
          Mock 로그인 (개발)
        </button>
        <button
          type="button"
          onClick={() => startKakaoLogin(`${window.location.origin}/dashboard`)}
          className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-[0_10px_30px_rgba(250,204,21,0.22)] ${
            isDark
              ? "bg-yellow-400/90 border border-yellow-300/80 text-gray-900 hover:bg-yellow-300/90"
              : "bg-yellow-400 border border-yellow-300 text-gray-900 hover:bg-yellow-300"
          }`}
        >
          카카오로 로그인
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer border ${
            isDark
              ? "bg-transparent border-white/15 text-white/80 hover:bg-white/10 hover:text-white"
              : "bg-white/80 border-white/70 text-[#4f5a94] hover:bg-gray-100 hover:border-white/80 hover:text-[#3a4270]"
          }`}
        >
          홈으로
        </button>
      </form>
    </div>
  );
}

export default Login;
