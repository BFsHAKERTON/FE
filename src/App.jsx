import { useState, useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.jsx";
import Integrations from "./pages/Integrations.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup.jsx";
import {
  registerChannelTalkKey,
  startNotionConnect,
  getNotionStatus,
} from "./shared/api/services/integrations";

function RequireAuth({ children }) {
  const location = useLocation();
  let token = null;

  if (typeof window !== "undefined") {
    let accessTokenFromUrl = null;
    let refreshTokenFromUrl = null;

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("accessToken")) {
      accessTokenFromUrl = searchParams.get("accessToken");
      refreshTokenFromUrl = searchParams.get("refreshToken");
      searchParams.delete("accessToken");
      searchParams.delete("refreshToken");
      const newSearch = searchParams.toString();
      const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}`;
      window.history.replaceState({}, "", newUrl);
    } else if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      if (hashParams.has("accessToken")) {
        accessTokenFromUrl = hashParams.get("accessToken");
        refreshTokenFromUrl = hashParams.get("refreshToken");
        window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}`);
      }
    }

    if (accessTokenFromUrl) {
      try {
        localStorage.setItem("accessToken", accessTokenFromUrl);
        if (refreshTokenFromUrl) {
          localStorage.setItem("refreshToken", refreshTokenFromUrl);
        }
      } catch (storageError) {
        console.warn("토큰 저장에 실패했습니다.", storageError);
      }
    }

    token = localStorage.getItem("accessToken");
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function App() {
  const location = useLocation();
  const pathname = location.pathname;
  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isDashboardPage = pathname === "/dashboard";
  const isCustomBackgroundPage = isHomePage || isLoginPage || isDashboardPage;
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true; // 기본값은 다크모드
  });
  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const [channelKey, setChannelKey] = useState("");
  const [channelSecret, setChannelSecret] = useState("");
  const [channelLoading, setChannelLoading] = useState(false);
  const [channelMessage, setChannelMessage] = useState("");
  const [channelError, setChannelError] = useState("");
  const [notionStatus, setNotionStatus] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const status = await getNotionStatus();
        if (!cancelled) {
          setNotionStatus(status);
        }
      } catch (err) {
        if (!cancelled) {
          setNotionStatus(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const closeChannelModal = () => {
    setChannelModalOpen(false);
    setChannelMessage("");
    setChannelError("");
    setChannelKey("");
    setChannelSecret("");
  };

  const handleChannelSubmit = async (event) => {
    event.preventDefault();
    setChannelMessage("");
    setChannelError("");
    const apiKey = channelKey.trim();
    const apiSecret = channelSecret.trim();
    if (!apiKey || !apiSecret) {
      setChannelError("Access Key와 Access Secret을 모두 입력해주세요.");
      return;
    }
    try {
      setChannelLoading(true);
      const res = await registerChannelTalkKey({ apiKey, apiSecret });
      setChannelMessage(res?.message || "채널톡 연동이 완료되었습니다.");
      setChannelKey("");
      setChannelSecret("");
    } catch (err) {
      setChannelError(err?.message || "채널톡 연동에 실패했습니다.");
    } finally {
      setChannelLoading(false);
    }
  };

  return (
    <>
      {channelModalOpen ? (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 px-4">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${
              isDark ? "bg-[#1f253b] text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">채널톡 API 키 등록</h3>
              <button
                type="button"
                onClick={closeChannelModal}
                className={`text-sm ${
                  isDark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                닫기
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleChannelSubmit}>
              <div>
                <label className="block text-xs font-semibold mb-2" htmlFor="channel-api-key">
                  Access Key
                </label>
                <input
                  id="channel-api-key"
                  type="text"
                  value={channelKey}
                  onChange={(e) => setChannelKey(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    isDark
                      ? "bg-[#252c47] border-white/10 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="채널톡 Access Key"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" htmlFor="channel-api-secret">
                  Access Secret
                </label>
                <input
                  id="channel-api-secret"
                  type="password"
                  value={channelSecret}
                  onChange={(e) => setChannelSecret(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    isDark
                      ? "bg-[#252c47] border-white/10 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="채널톡 Access Secret"
                  required
                />
              </div>
              {channelError ? (
                <p className="text-sm text-red-400">{channelError}</p>
              ) : null}
              {channelMessage ? (
                <p className="text-sm text-emerald-400">{channelMessage}</p>
              ) : null}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeChannelModal}
                  className={`px-4 py-2 text-sm rounded-lg border ${
                    isDark
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={channelLoading}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isDark
                      ? "bg-indigo-500/80 hover:bg-indigo-400 text-white"
                      : "bg-indigo-500/90 hover:bg-indigo-500 text-white"
                  } ${channelLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {channelLoading ? "등록 중..." : "연동하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      <nav
          className={`fixed top-0 left-0 right-0 z-[1000] flex gap-3 px-6 py-4 justify-between items-center border-b ${
            isCustomBackgroundPage ? "border-transparent" : "border-gray-200"
          } ${isDark ? "bg-[#121528] border-white/10" : "bg-white border-gray-200"}`}
      >
        <Link
          to="/"
          className={`text-xl md:text-2xl font-bold tracking-tight no-underline ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Relay Tok
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <div
              className={`text-xs font-medium px-3 py-1 rounded-full border ${
                notionStatus?.connected
                  ? isDark
                    ? "border-emerald-400 text-emerald-200"
                    : "border-emerald-500 text-emerald-600"
                  : isDark
                  ? "border-white/15 text-white/60"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              노션 {notionStatus?.connected ? "연결됨" : "미연결"}
            </div>
            <button
              type="button"
              onClick={() => startNotionConnect()}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/70 focus:ring-offset-2 ${
                isDark
                  ? "bg-purple-500/80 hover:bg-purple-400 text-white"
                  : "bg-purple-500/90 hover:bg-purple-500 text-white"
              }`}
            >
              노션 연동
            </button>
            <button
              type="button"
              onClick={() => {
                setChannelModalOpen(true);
                setChannelMessage("");
                setChannelError("");
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/70 focus:ring-offset-2 ${
                isDark
                  ? "bg-indigo-500/80 hover:bg-indigo-400 text-white"
                  : "bg-indigo-500/90 hover:bg-indigo-500 text-white"
              }`}
            >
              채널톡 연동
            </button>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`hover:cursor-pointer px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm font-semibold tracking-tight ${
              isDark
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
            aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {isDark ? "라이트" : "다크"}
          </button>
          <Link
            to="/"
            className={`no-underline text-sm font-semibold tracking-tight px-3 py-1.5 rounded-lg transition-colors duration-200 ${
              isDark
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            Home
          </Link>
          <button
            onClick={() => {
              const token =
                typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
              if (token) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
              } else {
                window.location.href = "/login";
              }
            }}
            className={`text-sm font-semibold tracking-tight px-3 py-1.5 rounded-lg transition-colors duration-200 border ${
              isDark
                ? "border-white/10 text-gray-300 hover:bg-gray-700 hover:text-white"
                : "border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
            type="button"
          >
            {typeof window !== "undefined" && localStorage.getItem("accessToken")
              ? "로그아웃"
              : "로그인"}
          </button>
        </div>
      </nav>
      <div
        className={`pt-[60px] min-h-screen ${
          isCustomBackgroundPage
            ? "bg-transparent"
            : isDark
            ? "bg-gray-900"
            : "bg-gray-50"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home isDark={isDark} />} />
          <Route
            path="/integrations"
            element={<Integrations isDark={isDark} />}
          />
          <Route path="/login" element={<Login isDark={isDark} />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard isDark={isDark} />
              </RequireAuth>
            }
          />
          <Route path="/signup" element={<Signup isDark={isDark} />} />
        </Routes>
      </div>
      <footer
        className={`w-full relative flex justify-center items-center p-5 m-0 box-border border-t ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {/* 그라데이션 오버레이 - 위에서 아래로 부드럽게 전환 */}
        <div
          className="absolute -top-32 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to bottom, transparent 0%, rgba(31, 41, 55, 0.1) 15%, rgba(31, 41, 55, 0.25) 35%, rgba(31, 41, 55, 0.5) 60%, rgba(31, 41, 55, 0.75) 85%, rgb(31, 41, 55) 100%)"
              : "linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.1) 15%, rgba(255, 255, 255, 0.25) 35%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0.75) 85%, rgb(255, 255, 255) 100%)",
          }}
        />
        <p
          className={`relative z-10 m-0 text-sm font-sans flex gap-2 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <span>© 2025 Hacky-Tocky</span>
          <span>@Team BF's</span>
        </p>
      </footer>
    </>
  );
}

export default App;
