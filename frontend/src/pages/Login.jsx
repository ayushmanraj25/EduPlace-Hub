import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Form, 2: OTP (Signup only)
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setMessage("");

    try {
      if (isSignup) {
        // Handle Signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role }
          }
        });
        
        if (error) throw error;

        if (data.session) {
          // Email confirmations are disabled on Supabase, logged in directly
          const user = {
            email: data.user.email,
            role: data.user.user_metadata?.role || "user",
          };
          localStorage.setItem("user", JSON.stringify(user));
          setMessage("✅ Signup successful! Redirecting...");
          setTimeout(() => navigate(user.role === "admin" ? "/admin" : "/subjects"), 1500);
        } else {
          // OTP required
          setStep(2);
          setMessage("✅ Verification email sent! Enter the OTP.");
        }
      } else {
        // Handle Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        const user = {
          email: data.user.email,
          role: data.user.user_metadata?.role || "user",
        };
        localStorage.setItem("user", JSON.stringify(user));
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => navigate(user.role === "admin" ? "/admin" : "/subjects"), 1500);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setMessage("❌ " + error.message);
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
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      });

      if (error) throw error;

      const user = {
        email: data.user.email,
        role: data.user.user_metadata?.role || "user",
      };
      localStorage.setItem("user", JSON.stringify(user));
      setMessage("✅ Verification successful! Redirecting...");
      setTimeout(() => navigate(user.role === "admin" ? "/admin" : "/subjects"), 1500);
    } catch (error) {
      console.error("Verify OTP Error:", error);
      setMessage("❌ " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div className="glass-panel animate-slide-up" style={{ padding: "40px", width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 className="gradient-text" style={{ fontSize: "32px", marginBottom: "8px" }}>
            {step === 2 ? "Verify Email" : (isSignup ? "Create Account" : "Welcome Back")}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            {step === 2 
              ? "Enter the verification code sent to your email"
              : (isSignup ? "Sign up to access study materials" : "Login to your account to continue")}
          </p>
        </div>

        {message && (
          <div style={{ 
            padding: "12px", 
            marginBottom: "20px", 
            borderRadius: "8px", 
            background: "var(--card-highlight)", 
            color: message.includes("✅") ? "var(--success)" : "var(--danger)", 
            fontSize: "13px", 
            textAlign: "center",
            border: `1px solid ${message.includes("✅") ? "var(--success)" : "var(--danger)"}44`
          }}>
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Email Address</label>
              <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-control" required />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="input-control" minLength="6" required />
            </div>
            
            {isSignup && (
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="input-control">
                  <option value="user">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <button type="submit" className="primary-btn" disabled={isLoading} style={{ marginTop: "10px" }}>
              {isLoading ? "Processing..." : (isSignup ? "Sign Up" : "Login")}
            </button>

            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button type="button" onClick={() => {
                setIsSignup(!isSignup);
                setMessage("");
                setPassword("");
              }} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}>
                {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Verification Code</label>
              <input type="text" placeholder="8-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} className="input-control" maxLength="8" style={{ textAlign: "center", letterSpacing: "8px", fontSize: "20px" }} required />
            </div>
            <button type="submit" className="primary-btn" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify & Login"}
            </button>
            <button type="button" onClick={() => {
              setStep(1);
              setMessage("");
            }} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}>
              Back to Signup
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
