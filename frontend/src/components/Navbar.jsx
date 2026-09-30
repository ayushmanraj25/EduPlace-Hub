import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function Navbar() {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      if (supabase?.auth) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn("Supabase signOut error:", err);
    }
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
    ] : [
      { name: "Subjects", path: "/subjects" },
      { name: "Coding", path: "/coding" }
    ])
  ];

  return (
    <nav style={{ 
        position: 'sticky', 
        top: '0', 
        zIndex: 1000, 
        padding: '12px 5%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.3s ease'
    }}>
      {/* Brand Logo */}
      <Link 
        to="/" 
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
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

      {/* Desktop Navigation Links */}
      <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ul style={{ 
            display: 'flex', 
            gap: '6px', 
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
                  fontWeight: isActive(item.path) ? '700' : '500',
                  textDecoration: "none",
                  fontSize: "14px",
                  padding: "8px 16px",
                  borderRadius: "50px",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive(item.path) 
                    ? "var(--card-highlight)" 
                    : hovered === item.name 
                      ? "rgba(0,0,0,0.03)" 
                      : "transparent",
                  display: "block"
                }}
                onMouseEnter={() => setHovered(item.name)}
                onMouseLeave={() => setHovered(null)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {user ? (
          <div style={{ position: "relative", marginLeft: "12px" }}>
            {/* Clickable Profile Pill */}
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px",
                background: dropdownOpen ? "var(--bg-tertiary)" : "var(--bg-secondary)",
                border: "1px solid var(--glass-border)",
                padding: "4px 4px 4px 14px",
                borderRadius: "50px",
                boxShadow: dropdownOpen ? "0 4px 12px rgba(0,0,0,0.05)" : "0 2px 5px rgba(0,0,0,0.02)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", lineHeight: "1.2", textTransform: 'capitalize' }}>
                  {user.role === "admin" ? "Admin" : "User"}
                </span>
                <span style={{ fontSize: "10px", color: "var(--success)", fontWeight: "600", letterSpacing: "0.5px", display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <span style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 5px var(--success)' }} /> Active
                </span>
              </div>
              <div style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "bold",
                textTransform: "uppercase"
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
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "rgba(255, 255, 255, 0.98)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "14px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  minWidth: "170px",
                  zIndex: 1000
                }}
              >
                <Link 
                  to={user.role === "admin" ? "/admin" : "/dashboard"} 
                  style={{
                    padding: "10px 14px",
                    textDecoration: "none",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.2s"
                  }}
                  onClick={() => setDropdownOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  Dashboard
                </Link>
                <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "4px 0" }} />
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  style={{ 
                    padding: "10px 14px", 
                    fontSize: "14px", 
                    fontWeight: "600",
                    borderRadius: "8px",
                    border: "none", 
                    background: "transparent", 
                    color: "var(--danger)",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: "8px" }}>
            <Link
              to="/login"
              style={{
                padding: '8px 18px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                borderRadius: '50px',
                transition: 'background 0.2s'
              }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="primary-btn"
              style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '50px' }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Controls (Always visible on mobile) */}
      <div className="mobile-nav-toggle" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
        {!user && (
          <Link
            to="/signup"
            className="primary-btn"
            style={{ 
              padding: '7px 14px', 
              fontSize: '13px', 
              fontWeight: '700',
              borderRadius: '20px',
              touchAction: 'manipulation'
            }}
          >
            Sign Up
          </Link>
        )}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border)',
            borderRadius: '10px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            touchAction: 'manipulation'
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div 
          className="animate-slide-up"
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '16px',
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '15px',
                color: isActive('/') ? 'var(--accent-primary)' : 'var(--text-primary)',
                background: isActive('/') ? 'var(--card-highlight)' : 'transparent',
                textDecoration: 'none'
              }}
            >
              🏠 Home
            </Link>
            <Link
              to="/subjects"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '15px',
                color: isActive('/subjects') ? 'var(--accent-primary)' : 'var(--text-primary)',
                background: isActive('/subjects') ? 'var(--card-highlight)' : 'transparent',
                textDecoration: 'none'
              }}
            >
              📚 Subjects & Notes
            </Link>
            <Link
              to="/coding"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '15px',
                color: isActive('/coding') ? 'var(--accent-primary)' : 'var(--text-primary)',
                background: isActive('/coding') ? 'var(--card-highlight)' : 'transparent',
                textDecoration: 'none'
              }}
            >
              💻 Coding Challenges
            </Link>
            <Link
              to="/placement"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '15px',
                color: isActive('/placement') ? 'var(--accent-primary)' : 'var(--text-primary)',
                background: isActive('/placement') ? 'var(--card-highlight)' : 'transparent',
                textDecoration: 'none'
              }}
            >
              🎯 Placement Prep
            </Link>
            <Link
              to="/company-wise"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '15px',
                color: isActive('/company-wise') ? 'var(--accent-primary)' : 'var(--text-primary)',
                background: isActive('/company-wise') ? 'var(--card-highlight)' : 'transparent',
                textDecoration: 'none'
              }}
            >
              🏢 Company Wise
            </Link>
          </div>

          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />

          {/* User Auth Buttons in Mobile Menu */}
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '15px',
                  background: 'var(--card-highlight)',
                  color: 'var(--accent-primary)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📊 {user.role === "admin" ? "Admin Panel" : "My Dashboard"}
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '15px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: 'var(--danger)',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                🚪 Logout ({user.email})
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  textAlign: 'center',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '15px',
                  border: '1.5px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  background: 'var(--bg-tertiary)'
                }}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="primary-btn"
                style={{
                  flex: 1,
                  padding: '12px',
                  textAlign: 'center',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '15px',
                  textDecoration: 'none'
                }}
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
