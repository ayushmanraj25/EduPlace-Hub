import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  ChevronRight, 
  Calendar, 
  Tag, 
  Loader2, 
  AlertCircle,
  Briefcase,
  Layers,
  Code
} from "lucide-react";
import axios from "axios";

// Constants for companies as requested
const COMPANIES = [
  { name: "TCS", logo: "🟦", color: "#0070C0", difficulty: "Easy – Medium", rounds: "3 Rounds" },
  { name: "Infosys", logo: "🟪", color: "#007CC3", difficulty: "Medium", rounds: "4 Rounds" },
  { name: "Wipro", logo: "🟩", color: "#49166D", difficulty: "Easy – Medium", rounds: "3 Rounds" },
  { name: "Cognizant", logo: "🔷", color: "#003B71", difficulty: "Easy – Medium", rounds: "3 Rounds" },
  { name: "Accenture", logo: "🟣", color: "#A100FF", difficulty: "Easy", rounds: "3 Rounds" },
  { name: "Amazon", logo: "📦", color: "#FF9900", difficulty: "Hard", rounds: "6 Rounds" },
  { name: "Google", logo: "🔴", color: "#4285F4", difficulty: "Very Hard", rounds: "7 Rounds" },
  { name: "Microsoft", logo: "🟥", color: "#00A4EF", difficulty: "Hard", rounds: "5 Rounds" },
];

const QUESTION_TYPES = ["Aptitude", "Technical", "Coding", "HR", "System Design"];
const YEARS = [2026, 2025, 2024, 2023];

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

function CompanyWise() {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    if (selectedCompany) {
      fetchQuestions();
    }
  }, [selectedCompany]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/company-wise`, {
        params: { company: selectedCompany.name }
      });
      setQuestions(response.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         q.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? q.type === selectedType : true;
    const matchesYear = selectedYear ? q.year === parseInt(selectedYear) : true;
    return matchesSearch && matchesType && matchesYear;
  });

  const typeColors = {
    Aptitude: { bg: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", border: "rgba(245, 158, 11, 0.3)" },
    Technical: { bg: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", border: "rgba(59, 130, 246, 0.3)" },
    Coding: { bg: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "rgba(16, 185, 129, 0.3)" },
    HR: { bg: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "rgba(239, 68, 68, 0.3)" },
    "System Design": { bg: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6", border: "rgba(139, 92, 246, 0.3)" },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="page-container">
      <AnimatePresence mode="wait">
        {!selectedCompany ? (
          <motion.div 
            key="company-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{ marginBottom: '40px' }}>
              <button
                className="secondary-btn"
                style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => navigate("/placement")}
              >
                <ArrowLeft size={18} /> Back to Placement
              </button>
              
              <h1 className="gradient-text" style={{ fontSize: '42px', marginBottom: '12px' }}>
                Company Wise Preparation
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
                Select a company to explore real interview questions and preparation strategies.
              </p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {COMPANIES.map((company, idx) => (
                <motion.div
                  key={company.name}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-panel"
                  style={{
                    padding: "32px",
                    cursor: "pointer",
                    borderTop: `4px solid ${company.color}`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => setSelectedCompany(company)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '42px' }}>{company.logo}</span>
                    <div>
                      <h3 style={{ fontSize: '24px', margin: 0 }}>{company.name}</h3>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        marginTop: '4px' 
                      }}>
                        <Layers size={14} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
                          {company.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                      <Briefcase size={16} />
                      <span>{company.rounds}</span>
                    </div>
                  </div>

                  <div style={{ 
                    marginTop: '24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    color: 'var(--accent-primary)',
                    fontWeight: '600',
                    fontSize: '15px'
                  }}>
                    Explore Questions
                    <ChevronRight size={18} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="question-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
              <div>
                <button
                  className="secondary-btn"
                  style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => setSelectedCompany(null)}
                >
                  <ArrowLeft size={18} /> All Companies
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontSize: '56px' }}>{selectedCompany.logo}</span>
                  <div>
                    <h1 className="gradient-text" style={{ fontSize: '48px', margin: 0 }}>{selectedCompany.name}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginTop: '4px' }}>
                      Interviews questions from <b>{selectedCompany.name}</b> placement drives.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="glass-panel" style={{ padding: '20px 30px', display: 'flex', gap: '30px' }}>
                 <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Difficulty</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent-primary)', margin: 0 }}>{selectedCompany.difficulty}</p>
                 </div>
                 <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
                 <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Questions</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{questions.length}</p>
                 </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-control" 
                  placeholder="Search questions or keywords..." 
                  style={{ paddingLeft: '48px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Tag size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <select 
                    className="input-control" 
                    style={{ paddingLeft: '38px', minWidth: '160px' }}
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    {QUESTION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <select 
                    className="input-control" 
                    style={{ paddingLeft: '38px', minWidth: '140px' }}
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">All Years</option>
                    {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Questions View */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0' }}>
                <Loader2 size={48} className="animate-spin" style={{ color: 'var(--accent-primary)', marginBottom: '16px' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Loading questions...</p>
              </div>
            ) : error ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <AlertCircle size={48} style={{ color: 'var(--danger)', marginBottom: '16px' }} />
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Oops! Something went wrong</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
                <button className="primary-btn" style={{ marginTop: '20px' }} onClick={fetchQuestions}>Retry</button>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="glass-panel" style={{ padding: '80px', textAlign: 'center' }}>
                <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No questions available</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {searchTerm || selectedType || selectedYear 
                    ? "Try adjusting your filters or search terms." 
                    : "No questions have been added for this company yet."}
                </p>
                {(searchTerm || selectedType || selectedYear) && (
                  <button 
                    className="secondary-btn" 
                    style={{ marginTop: '20px' }} 
                    onClick={() => { setSearchTerm(""); setSelectedType(""); setSelectedYear(""); }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'grid', gap: '20px' }}
              >
                {filteredQuestions.map((item, idx) => {
                  const tc = typeColors[item.type] || { bg: 'rgba(0,0,0,0.05)', color: 'var(--text-secondary)', border: 'var(--glass-border)' };
                  return (
                    <motion.div
                      key={item.id || idx}
                      variants={itemVariants}
                      className="glass-panel"
                      style={{
                        padding: '28px',
                        borderLeft: `5px solid ${tc.color}`,
                        transition: 'box-shadow 0.3s ease'
                      }}
                      whileHover={{ boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '700',
                            background: tc.bg,
                            color: tc.color,
                            border: `1px solid ${tc.border}`,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}>{item.type}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={13} /> {item.year}
                          </span>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>#{idx + 1}</span>
                      </div>
                      
                      <h4 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px', lineHeight: '1.6', fontWeight: '600' }}>
                        {item.question}
                      </h4>
                      
                      <div style={{
                        background: 'var(--bg-tertiary)',
                        padding: '20px',
                        borderRadius: '12px',
                        fontSize: '15px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.7',
                        border: '1px solid var(--glass-border)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Code size={16} style={{ color: 'var(--success)' }} />
                          <strong style={{ color: 'var(--success)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Suggested Answer
                          </strong>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{item.answer}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CompanyWise;
