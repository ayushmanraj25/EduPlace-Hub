import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Subjects from "./pages/Subjects";
import Placement from "./pages/Placement";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AINotes from "./pages/AINotes";
import CompanyWise from "./pages/CompanyWise";

const ProtectedRoute = ({ element }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/subjects" element={<ProtectedRoute element={<Subjects />} />} />
        <Route path="/placement" element={<ProtectedRoute element={<Placement />} />} />
        <Route path="/company-wise" element={<ProtectedRoute element={<CompanyWise />} />} />
        <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
        <Route path="/ai-notes" element={<ProtectedRoute element={<AINotes />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
