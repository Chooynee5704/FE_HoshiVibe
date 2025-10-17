// src/pages/auth/BasicLogin.tsx
"use client";
import { useState } from "react";
import type { PageKey } from "../../types/navigation";
import { loginApi } from "../../api/authApi";
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

interface LoginProps {
  onNavigate?: (page: PageKey) => void;
}

export default function BasicLogin({ onNavigate }: LoginProps) {
  // \uD83D\uDD11 form state
  const [identifier, setIdentifier] = useState(""); // email hoặc account
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = identifier.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setError(null);
    setLoading(true);
    try {
      const res = await loginApi({ identifier, password });
      // TODO: save token/user to localStorage if backend returns them
      if (res?.role === "Admin") onNavigate?.("admin");
      else onNavigate?.("home");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Đăng nhập thất bại, vui lòng thử lại.";
      setError(typeof msg === "string" ? msg : "Đăng nhập thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: "facebook" | "google") => {
    // hook up real OAuth later
    console.log(`Login with ${provider}`);
  };

  return (
    <>
      <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
          .login-input { transition: all 0.3s ease; }
          .login-input:focus {
            border-color: #000000 !important;
            background-color: #ffffff !important;
            box-shadow: 0 0 0 3px rgba(0,0,0,0.05) !important;
          }
          .login-button { transition: all 0.3s ease; }
          .login-button:not(:disabled):hover {
            background: #1a1a1a; transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
          }
          .social-button { transition: all 0.3s ease; }
          .social-button:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
          .link-hover { transition: color 0.3s ease; }
          .link-hover:hover { color: #000000 !important; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative Elements */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 500, height: 500, background: "linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.01) 100%)", borderRadius: "50%", animation: "fadeIn 1.5s ease-out" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 400, height: 400, background: "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)", borderRadius: "50%", animation: "fadeIn 1.5s ease-out 0.3s backwards" }} />

        {/* Left Side - Brand Section */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
          background: 'url("/images/dangnhap.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)", zIndex: 1 }} />
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", animation: "slideIn 1s ease-out", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <div style={{ padding: "2rem 3rem", marginBottom: "2rem", transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px) scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
            >
              <h1 style={{ fontSize: "4rem", fontWeight: 900, margin: 0, letterSpacing: "0.05em", textTransform: "uppercase", textShadow: "2px 2px 4px rgba(0,0,0,0.8)", color: "#ffffff" }}>
                HOSHIVIBE
              </h1>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)", transform: "translateX(-100%)", transition: "transform 0.8s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(100%)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(-100%)"; }}
              />
            </div>
            <div style={{ width: 100, height: 4, background: "linear-gradient(90deg, transparent, #ffffff, transparent)", margin: "0 auto 2rem", borderRadius: 2 }} />
            <p style={{ fontSize: "1.25rem", color: "#ffffff", maxWidth: 400, lineHeight: 1.8, fontWeight: 300, textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
              Khám phá năng lượng của đá phong thủy, mang may mắn đến với cuộc sống của bạn
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 480, width: "100%", background: "#ffffff", padding: "3rem", borderRadius: 0, border: "1px solid #e5e5e5", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)", animation: "fadeInUp 0.8s ease-out" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#000000", marginBottom: "0.75rem", letterSpacing: "0.02em", textTransform: "uppercase" }}>Đăng Nhập</h2>
              <p style={{ color: "#666666", fontSize: "0.95rem" }}>
                Chưa có tài khoản? {" "}
                <span className="link-hover" style={{ color: "#000000", fontWeight: 600, cursor: "pointer", borderBottom: "2px solid #000000" }}
                  onClick={() => onNavigate?.("register")}>Đăng ký ngay</span>
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div style={{ marginBottom: 16, padding: "10px 12px", border: "1px solid #ffccc7", background: "#fff2f0", color: "#cf1322", borderRadius: 6, fontSize: 14 }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Identifier Field */}
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ display: "block", fontSize: ".875rem", fontWeight: 700, color: "#000", marginBottom: ".75rem", letterSpacing: ".05em", textTransform: "uppercase" }}>
                  Email hoặc Tên đăng nhập
                </label>
                <div style={{ position: "relative" }}>
                  <UserOutlined style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "1.125rem" }} />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Username"
                    required
                    autoComplete="username"
                    className="login-input"
                    style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", border: "2px solid #e5e5e5", borderRadius: 0, fontSize: "1rem", backgroundColor: "#fff", color: "#000", outline: "none", boxSizing: "border-box", fontWeight: 500 }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: ".875rem", fontWeight: 700, color: "#000", marginBottom: ".75rem", letterSpacing: ".05em", textTransform: "uppercase" }}>
                  Mật Khẩu
                </label>
                <div style={{ position: "relative" }}>
                  <LockOutlined style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "1.125rem" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    autoComplete="current-password"
                    className="login-input"
                    style={{ width: "100%", padding: "1rem 3rem 1rem 3rem", border: "2px solid #e5e5e5", borderRadius: 0, fontSize: "1rem", backgroundColor: "#fff", color: "#000", outline: "none", boxSizing: "border-box", fontWeight: 500 }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: "1.125rem", padding: 0 }}>
                    {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div style={{ textAlign: "right", marginBottom: "2rem" }}>
                <span className="link-hover" style={{ color: "#666", fontSize: ".875rem", cursor: "pointer", fontWeight: 500 }}>
                  Quên mật khẩu?
                </span>
              </div>

              {/* Submit */}
              <button type="submit" disabled={!isFormValid || loading} className="login-button"
                style={{ width: "100%", padding: "1rem", border: "none", fontSize: "1rem", fontWeight: 700, cursor: isFormValid && !loading ? "pointer" : "not-allowed", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "2rem", background: isFormValid && !loading ? "#000" : "#e5e5e5", color: isFormValid && !loading ? "#fff" : "#999", opacity: isFormValid && !loading ? 1 : 0.6 }}>
                {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", gap: "1rem" }}>
              <div style={{ flex: 1, height: 1, background: "#e5e5e5" }} />
              <span style={{ color: "#999", fontSize: ".875rem", fontWeight: 500 }}>HOẶC</span>
              <div style={{ flex: 1, height: 1, background: "#e5e5e5" }} />
            </div>

            {/* Socials */}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              {/* <button onClick={() => handleSocialLogin("facebook")} className="social-button"
                style={{ width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#3b5998", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", padding: 0 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="white"/></svg>
              </button> */}
              <button onClick={() => handleSocialLogin("google")} className="social-button"
                style={{ width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", border: "2px solid #e5e5e5", borderRadius: 8, cursor: "pointer", padding: 0 }}>
                <svg width="32" height="32" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
