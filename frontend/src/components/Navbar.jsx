import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabaseClient";

function Navbar() {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
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
      { name: "Coding", path: "/coding" },
    ] : [])
  ];

  return (
    <nav style={{ 
        position: 'sticky', 
        top: '0', 
        zIndex: 1000, 
        padding: '16px 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.3s ease'
    }}>
      <Link 
        to="/" 
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{ 
          width: '36px', height: '36px', 
          background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))', 
          borderRadius: '10px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          color: 'white', fontWeight: 'bold', fontSize: '20px',
          boxShadow: '0 4px 10px rgba(43, 109, 76, 0.2)'
        }}>
          E
        </div>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Edu<span style={{ color: 'var(--accent-primary)' }}>Place</span>
        </h2>
      </Link>
      
      <ul style={{ 
          display: 'flex', 
          gap: '8px', 
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
                color: isActive(item.path) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: isActive(item.path) ? '600' : '500',
                textDecoration: "none",
                fontSize: "15px",
                padding: "8px 18px",
                borderRadius: "50px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                backgroundColor: isActive(item.path) 
                  ? "var(--card-highlight)" 
                  : hovered === item.name 
                    ? "rgba(0,0,0,0.03)" 
                    : "transparent",
                position: "relative",
                display: "block"
              }}
              onMouseEnter={() => setHovered(item.name)}
              onMouseLeave={() => setHovered(null)}
            >
              {item.name}
            </Link>
          </li>
        ))}
        {user ? (
          <div style={{ position: "relative", marginLeft: "12px" }}>
            {/* Clickable Profile Pill */}
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px",
                background: dropdownOpen ? "var(--bg-tertiary)" : "var(--bg-secondary)",
                border: "1px solid var(--glass-border)",
                padding: "4px 4px 4px 16px",
                borderRadius: "50px",
                boxShadow: dropdownOpen ? "0 4px 12px rgba(0,0,0,0.05)" : "0 2px 5px rgba(0,0,0,0.02)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              onMouseEnter={(e) => { if(!dropdownOpen) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)' }}
              onMouseLeave={(e) => { if(!dropdownOpen) e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.02)' }}
            >
              <div style={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", lineHeight: "1.2", textTransform: 'capitalize' }}>
                  {user.role === "admin" ? "Admin" : "User"}
                </span>
                <span style={{ fontSize: "11px", color: "var(--success)", fontWeight: "600", letterSpacing: "0.5px", display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <div style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 5px var(--success)' }} /> Active
                </span>
              </div>
              <div style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "uppercase",
                boxShadow: "0 2px 8px rgba(43, 109, 76, 0.2)"
              }}>
                {user.role === "admin" ? "A" : "U"}
              </div>
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div 
                className="animate-slide-up"
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: 0,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  borderRadius: "16px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  minWidth: "180px",
                  zIndex: 1000,
                  overflow: "hidden"
                }}
              >
                <Link 
                  to={user.role === "admin" ? "/admin" : "/dashboard"} 
                  style={{
                    padding: "12px 16px",
                    textDecoration: "none",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--card-highlight)';
                    e.currentTarget.style.color = 'var(--accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onClick={() => setDropdownOpen(false)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  Dashboard
                </Link>
                <div style={{ height: "1px", background: "rgba(0,0,0,0.05)", margin: "4px 8px" }} />
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  style={{ 
                    padding: "12px 16px", 
                    fontSize: "14px", 
                    fontWeight: "600",
                    borderRadius: "10px",
                    border: "none", 
                    background: "transparent",
                    color: "var(--danger)",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Logout
                </button>
              </div>
            )}
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
