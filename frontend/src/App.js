// Ye App component poore React app ka routing system handle karta hai (kaunsa URL → kaunsa page)
// ProtectedRoute check karta hai ki user login hai ya nahi, warna login page pe redirect karta hai
// Navbar sab pages pe common rehta hai aur baaki routes different pages render karte hain

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Subjects from "./pages/Subjects";
import SubjectView from "./pages/SubjectView";
import Placement from "./pages/Placement";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import CompanyWise from "./pages/CompanyWise";
import CodingList from "./pages/CodingList";
import Workspace from "./pages/Workspace";
import AIFloatingWidget from "./components/AIFloatingWidget";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const ProtectedRoute = ({ element, authReady }) => {
  // Don't redirect until we've finished checking Supabase session
  if (!authReady) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            width: "40px", height: "40px", border: "4px solid var(--glass-border)", 
            borderTop: "4px solid var(--accent-primary)", borderRadius: "50%",
            animation: "spin 1s linear infinite", margin: "0 auto 16px"
          }} />
          <p style={{ color: "var(--text-secondary)" }}>Authenticating...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user ? element : <Navigate to="/login" replace />;
};

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let handled = false;

    const syncUser = (session) => {
      if (session?.user) {
        const user = {
          email: session.user.email,
          role: session.user.user_metadata?.role || "user",
        };
        localStorage.setItem("user", JSON.stringify(user));
      }
    };

    // 1. Check existing session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session);
      if (!handled) {
        handled = true;
        setAuthReady(true);
      }
    });

    // 2. Listen for auth changes (handles the OAuth redirect callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      syncUser(session);
      
      if (!handled) {
        handled = true;
        setAuthReady(true);
      }

      if (event === 'SIGNED_OUT') {
        localStorage.removeItem("user");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      {/* Wrapper to ensure footer pushes to bottom if content is short */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: '1 0 auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/subjects" element={<ProtectedRoute authReady={authReady} element={<Subjects />} />} />
            <Route path="/subjects/:subjectName" element={<ProtectedRoute authReady={authReady} element={<SubjectView />} />} />
            <Route path="/placement" element={<ProtectedRoute authReady={authReady} element={<Placement />} />} />
            <Route path="/company-wise" element={<ProtectedRoute authReady={authReady} element={<CompanyWise />} />} />
            <Route path="/admin" element={<ProtectedRoute authReady={authReady} element={<Admin />} />} />
            <Route path="/dashboard" element={<ProtectedRoute authReady={authReady} element={<Dashboard />} />} />
            <Route path="/coding" element={<ProtectedRoute authReady={authReady} element={<CodingList />} />} />
            <Route path="/coding/:id" element={<ProtectedRoute authReady={authReady} element={<Workspace />} />} />
          </Routes>
        </main>
        <Footer />
        <AIFloatingWidget />
      </div>
    </BrowserRouter>
  );
}

export default App;
