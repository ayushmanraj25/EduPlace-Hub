import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Subjects from "./pages/Subjects";
import Placement from "./pages/Placement";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AINotes from "./pages/AINotes";
import CompanyWise from "./pages/CompanyWise";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/placement" element={<Placement />} />
        <Route path="/company-wise" element={<CompanyWise />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/ai-notes" element={<AINotes />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
