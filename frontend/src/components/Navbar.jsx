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
    ] : [])
  ];

  return (
    <nav style={{ 
        position: 'sticky', 
        top: '0', 
        zIndex: 100, 
        padding: '16px 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--glass-border)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px' }}>E</div>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          EduPlace
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
                color: isActive(item.path) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: isActive(item.path) ? '600' : '500',
                textDecoration: "none",
                fontSize: "15px",
                padding: "8px 16px",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                backgroundColor: isActive(item.path) 
                  ? "var(--card-highlight)" 
                  : hovered === item.name 
                    ? "var(--bg-tertiary)" 
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
          <div style={{ position: "relative" }}>
            {/* Clickable Profile Pill */}
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--glass-border)",
                padding: "6px 6px 6px 20px",
                borderRadius: "50px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.02)'}
            >
              <div style={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", lineHeight: "1.2", textTransform: 'capitalize' }}>
                  {user.role === "admin" ? "Admin" : "User"}
                </span>
                <span style={{ fontSize: "10px", color: "var(--success)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px", display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <div style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%' }} /> Active
                </span>
              </div>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--accent-primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}>
                {user.role === "admin" ? "A" : "U"}
              </div>
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                background: "var(--bg-secondary)",
                border: "1px solid var(--glass-border)",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                minWidth: "160px",
                zIndex: 1000
              }}>
                <Link 
                  to={user.role === "admin" ? "/admin" : "/subjects"} 
                  style={{
                    padding: "10px 16px",
                    textDecoration: "none",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    fontWeight: "500",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <div style={{ height: "1px", background: "var(--glass-border)", margin: "4px 8px" }} />
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  style={{ 
                    padding: "10px 16px", 
                    fontSize: "14px", 
                    fontWeight: "500",
                    borderRadius: "8px",
                    border: "none", 
                    background: "transparent",
                    color: "var(--danger)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
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
