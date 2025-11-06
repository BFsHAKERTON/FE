import { useState, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.jsx";
import Integrations from "./pages/Integrations.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Signup from "./pages/Signup.jsx";

function App() {
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
        className="fixed top-0 left-0 right-0 z-[1000] flex gap-3 p-3 justify-end items-center shadow-md"
        style={{
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
        }}
      >
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg transition-colors duration-200"
          style={{
            backgroundColor: isDark ? "transparent" : "transparent",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = isDark ? "#374151" : "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
          }}
          aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
        >
          {isDark ? (
            <span className="text-xl">☀️</span>
          ) : (
            <span className="text-xl">🌙</span>
          )}
        </button>
        <Link
          to="/"
          className="no-underline text-sm font-medium"
          style={{ color: isDark ? "#d1d5db" : "#374151" }}
        >
          Home
        </Link>
        <Link
          to="/login"
          className="no-underline text-sm font-medium"
          style={{ color: isDark ? "#d1d5db" : "#374151" }}
        >
          로그인
        </Link>
        <Link
          to="/signup"
          className="no-underline text-sm font-medium"
          style={{ color: isDark ? "#d1d5db" : "#374151" }}
        >
          회원가입
        </Link>
      </nav>
      <div
        className="pt-[60px] min-h-screen"
        style={{
          backgroundColor: isDark ? "#2C3539" : "#f9fafb",
        }}
      >
        <Routes>
          <Route path="/" element={<Home isDark={isDark} />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      <footer
        className="w-full flex justify-center items-center p-5 m-0 box-border border-t"
        style={{
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          borderColor: isDark ? "#374151" : "#e5e7eb",
        }}
      >
        <p
          className="m-0 text-sm font-sans"
          style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
        >
          © 2025 Hacky-Tocky
        </p>
      </footer>
    </>
  );
}

export default App;
