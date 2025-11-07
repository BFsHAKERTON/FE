import { useState, useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.jsx";
import Integrations from "./pages/Integrations.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup.jsx";

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

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDark));
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] flex gap-3 p-3 justify-between items-center ${
          isCustomBackgroundPage ? "shadow-none" : "shadow-md"
        } ${isDark ? "bg-gray-800" : "bg-white"}`}
      >
        <Link
          to="/"
          className={`text-2xl font-bold tracking-tight no-underline ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Relay Tok
        </Link>
        <div className="flex gap-3 items-center">
          <button
            onClick={toggleDarkMode}
            className={`px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm font-semibold tracking-tight ${
              isDark
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
            aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {isDark ? "라이트모드" : "다크모드"}
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
          <Link
            to="/login"
            className={`no-underline text-sm font-semibold tracking-tight px-3 py-1.5 rounded-lg transition-colors duration-200 ${
              isDark
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className={`no-underline text-sm font-semibold tracking-tight px-3 py-1.5 rounded-lg transition-colors duration-200 ${
              isDark
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            회원가입
          </Link>
        </div>
      </nav>
      <div
        className={`pt-[60px] min-h-screen ${
          isCustomBackgroundPage ? "bg-transparent" : isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home isDark={isDark} />} />
          <Route
            path="/integrations"
            element={<Integrations isDark={isDark} />}
          />
          <Route path="/login" element={<Login isDark={isDark} />} />
          <Route path="/dashboard" element={<Dashboard isDark={isDark} />} />
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
              : "linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.1) 15%, rgba(255, 255, 255, 0.25) 35%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0.75) 85%, rgb(255, 255, 255) 100%)"
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
