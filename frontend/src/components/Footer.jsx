import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--glass-border)',
      padding: '60px 5% 30px 5%',
      marginTop: 'auto', // Pushes footer to bottom if page content is short
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Brand Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--accent-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>E</div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              EduPlace Hub
            </h2>
          </Link>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', maxWidth: '280px' }}>
            Empowering students with robust study materials, verified notes, and intelligent placement preparation resources.
          </p>
        </div>

        {/* Quick Links Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Quick Links</h3>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/subjects" style={linkStyle}>Subjects</Link>
          <Link to="/placement" style={linkStyle}>Placement Prep</Link>
          <Link to="/company-wise" style={linkStyle}>Company Wise</Link>
        </div>

        {/* Legal & Support Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Support & Legal</h3>
          <a href="mailto:ayushmanraj430@gmail.com" style={linkStyle}>ayushmanraj430@gmail.com</a>
          <a href="tel:+917485856647" style={linkStyle}>+91 7485856647</a>
          <a href="#" style={linkStyle}>FAQ</a>
          <a href="#" style={linkStyle}>Privacy Policy</a>
          <a href="#" style={linkStyle}>Terms of Service</a>
        </div>

        {/* Socials Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Connect</h3>
          <a 
            href="https://github.com/ayushmanraj25" 
            target="_blank" 
            rel="noreferrer" 
            style={{...linkStyle, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.475 2 2 6.475 2 12C2 16.425 4.8625 20.1625 8.8375 21.4875C9.3375 21.575 9.525 21.275 9.525 21.0125C9.525 20.775 9.5125 19.9875 9.5125 19.15C6.7375 19.75 6.15 17.8 6.15 17.8C5.6875 16.6375 5.0375 16.325 5.0375 16.325C4.125 15.7 5.1125 15.7125 5.1125 15.7125C6.125 15.7875 6.65 16.75 6.65 16.75C7.55 18.2875 8.9875 17.8375 9.5625 17.575C9.65 16.925 9.9125 16.475 10.2 16.225C7.975 15.975 5.65 15.1125 5.65 11.475C5.65 10.4375 6.025 9.5875 6.625 8.925C6.525 8.675 6.2 7.7125 6.725 6.4125C6.725 6.4125 7.525 6.1625 9.525 7.5125C10.2875 7.3 11.1125 7.1875 11.9375 7.1875C12.7625 7.1875 13.5875 7.3 14.35 7.5125C16.35 6.15 17.15 6.4125 17.15 6.4125C17.675 7.7125 17.35 8.675 17.25 8.925C17.85 9.5875 18.225 10.425 18.225 11.475C18.225 15.125 15.8875 15.9625 13.65 16.2125C14.0125 16.525 14.3375 17.125 14.3375 18.0625C14.3375 19.4125 14.325 20.5 14.325 20.825C14.325 21.0875 14.5125 21.4 15.0125 21.3125C18.9875 20.15 21.85 16.4125 21.85 11.9875C21.85 6.475 17.3875 2 12 2Z"/>
            </svg>
            GitHub
          </a>
          <a 
            href="https://www.linkedin.com/in/ayushman-raj-7446b12b7/" 
            target="_blank" 
            rel="noreferrer" 
            style={{...linkStyle, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452H16.92V14.88c0-1.328-.024-3.037-1.85-3.037-1.851 0-2.134 1.445-2.134 2.938v5.671H9.41V9h3.385v1.561h.048c.471-.89 1.62-1.826 3.328-1.826 3.562 0 4.221 2.343 4.221 5.39v6.327h.055zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zM7.098 20.452H3.57V9h3.528v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '24px',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          &copy; {currentYear} EduPlace Hub. All rights reserved.
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          Designed by Ayushman for students.
        </span>
      </div>
    </footer>
  );
}

const linkStyle = {
  textDecoration: 'none',
  color: 'var(--text-secondary)',
  fontSize: '14px',
  transition: 'color 0.2s ease',
};

// Quick CSS hack to add hover effect since we are using inline styles for a component
// Ideally you'd use a CSS module, but this works cleanly!
export default () => (
  <>
    <style>{`
      footer a:hover {
        color: var(--accent-primary) !important;
      }
    `}</style>
    <Footer />
  </>
);
