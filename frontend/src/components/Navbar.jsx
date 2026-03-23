import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  
  const isActive = (path) => location.pathname === path;

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
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px'
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
        {[
          { name: "Home", path: "/" },
          { name: "Subjects", path: "/subjects" },
          { name: "Placement", path: "/placement" },
          { name: "AI Notes", path: "/ai-notes" },
        ].map((item, index) => (
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
        {localStorage.getItem("user") ? (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ 
              width: "42px", 
              height: "42px", 
              borderRadius: "50%", 
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
              boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              cursor: "pointer"
            }}>
              {JSON.parse(localStorage.getItem("user")).email[0].toUpperCase()}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                {JSON.parse(localStorage.getItem("user")).email.split("@")[0]}
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {JSON.parse(localStorage.getItem("user")).role}
              </span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.reload();
              }}
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              Sign Out
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
