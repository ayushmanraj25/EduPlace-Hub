import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabaseClient";

function Navbar() {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  
  const isActive = (path) => location.pathname === path;

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const navLinks = [
    { name: "Home", path: "/" },
    ...(user ? [
      { name: "Subjects", path: "/subjects" },
      { name: "Placement", path: "/placement" },
      { name: "Company Wise", path: "/company-wise" },
      { name: "AI Notes", path: "/ai-notes" },
    ] : [])
  ];

  return (
    <nav className="glass-panel" style={{ 
        position: 'sticky', 
        top: '15px', 
        zIndex: 100, 
        margin: '0 20px',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '16px'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 className="gradient-text" style={{ margin: 0, fontSize: '24px', letterSpacing: '-0.5px' }}>
          EduPlace Hub
        </h2>
      </Link>
      
      <ul style={{ 
          display: 'flex', 
          gap: '30px', 
          listStyle: 'none', 
          margin: 0, 
          padding: 0, 
          alignItems: 'center' 
      }}>
        {navLinks.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              style={{
                color: isActive(item.path) ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive(item.path) ? '600' : '500',
                textDecoration: "none",
                fontSize: "15px",
                padding: "8px 16px",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                backgroundColor: isActive(item.path) 
                  ? "rgba(59, 130, 246, 0.15)" 
                  : hovered === item.name 
                    ? "rgba(255, 255, 255, 0.05)" 
                    : "transparent",
              }}
              onMouseEnter={() => setHovered(item.name)}
              onMouseLeave={() => setHovered(null)}
            >
              {item.name}
            </Link>
          </li>
        ))}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Link 
              to={user.role === "admin" ? "/admin" : "/subjects"} 
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                textAlign: "right", 
                textDecoration: "none",
                transition: "opacity 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                {user.email.split("@")[0]}
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>
                {user.role}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="secondary-btn"
              style={{ padding: "6px 12px", fontSize: "12px", border: "1px solid var(--danger)", color: "var(--danger)" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <li>
            <Link
              to="/login"
              className="primary-btn"
              style={{ padding: '8px 24px', fontSize: '15px' }}
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
