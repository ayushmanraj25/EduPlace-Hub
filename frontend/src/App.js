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
import CompanyWise from "./pages/CompanyWise";
import AIFloatingWidget from "./components/AIFloatingWidget";

const ProtectedRoute = ({ element }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      {/* Wrapper to ensure footer pushes to bottom if content is short */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: '1 0 auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/subjects" element={<ProtectedRoute element={<Subjects />} />} />
            <Route path="/subjects/:subjectName" element={<ProtectedRoute element={<SubjectView />} />} />
            <Route path="/placement" element={<ProtectedRoute element={<Placement />} />} />
            <Route path="/company-wise" element={<ProtectedRoute element={<CompanyWise />} />} />
            <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
          </Routes>
        </main>
        <Footer />
        <AIFloatingWidget />
      </div>
    </BrowserRouter>
  );
}

export default App;
