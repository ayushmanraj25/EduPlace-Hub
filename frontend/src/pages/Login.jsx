import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Email/Role, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [recentAccounts, setRecentAccounts] = useState(() => {
    return JSON.parse(localStorage.getItem("recentAccounts") || "[]");
  });
  
  const navigate = useNavigate();

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5001/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role })
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
        setMessage("✅ OTP successfully dispatched to your inbox!");
      } else {
        setMessage("❌ " + (data.message || "Failed to send OTP"));
      }
    } catch (error) {
      setMessage("❌ Connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5001/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        
        const updatedRecent = [
          { email, role },
          ...recentAccounts.filter(acc => acc.email !== email)
        ].slice(0, 3);
        localStorage.setItem("recentAccounts", JSON.stringify(updatedRecent));

        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/subjects");
        }
      } else {
        setMessage("❌ " + (data.message || "Invalid OTP"));
      }
    } catch (error) {
      setMessage("❌ Connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchAccount = (acc) => {
    setEmail(acc.email);
    setRole(acc.role);
    setStep(1);
    setOtp("");
    setMessage("");
  };

  return (
    <div style={{ minHeight: "calc(100vh - 80px)", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div className="glass-panel animate-slide-up" style={{ padding: "40px", width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 className="gradient-text" style={{ fontSize: "28px", marginBottom: "8px" }}>Welcome</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Enter your email to receive an OTP</p>
        </div>

        {message && (
          <div style={{ padding: "12px", marginBottom: "20px", borderRadius: "8px", background: "var(--card-highlight)", color: message.includes("✅") ? "var(--success)" : "var(--danger)", fontSize: "13px", textAlign: "center" }}>
            {message}
          </div>
        )}

        {recentAccounts.length > 0 && step === 1 && (
          <div style={{ marginBottom: "25px" }}>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              {recentAccounts.map((acc, i) => (
                <div key={i} onClick={() => switchAccount(acc)} style={{ width: "36px", height: "36px", borderRadius: "50%", background: role === acc.role && email === acc.email ? "var(--accent-primary)" : "var(--card-highlight)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                  {acc.email[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleStep1} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-control" required />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input-control">
              <option value="user">Student</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="primary-btn" disabled={isLoading}>
              {isLoading ? "Sending..." : "Get OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <input type="text" placeholder="6-Digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="input-control" maxLength="6" style={{ textAlign: "center", letterSpacing: "5px" }} required />
            <button type="submit" className="primary-btn" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Login"}
            </button>
            <button type="button" onClick={() => setStep(1)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer" }}>Back to Email</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
