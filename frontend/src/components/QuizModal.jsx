import React, { useState } from 'react';

function QuizModal({ subject, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  if (!isOpen) return null;

  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const prompt = `Generate a 5-question multiple choice test on the core concepts of "${subject}". 
      You MUST return ONLY valid JSON in this exact format, with no markdown formatting around it, no backticks, just the raw JSON array:
      [
        {
          "q": "Question text here?",
          "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
          "answer": "A) Option 1"
        }
      ]`;

      const response = await fetch("http://localhost:5001/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userId: user.email }),
      });
      const data = await response.json();
      
      if (response.ok) {
        try {
          // Extract JSON robustly: find the first '[' and last ']'
          const match = data.notes.match(/\[[\s\S]*\]/);
          if (!match) throw new Error("AI did not return a valid JSON array.");
          
          const parsed = JSON.parse(match[0]);
          setQuestions(parsed);
          setCurrentStep(0);
          setScore(0);
          setShowResult(false);
          setSelectedAnswer(null);
          setUserAnswers([]);
        } catch (parseErr) {
          console.error("Parse Error:", parseErr, data.notes);
          setError("AI returned malformed questions. Try again.");
        }
      } else {
        // Handle API keys and rate limits (429) clearly
        if (data.message && data.message.includes("Quota Exceeded")) {
          setError("API Rate Limit Reached! Google AI is resting. Please wait a minute before taking another test.");
        } else {
          setError(`Error: ${data.message || "Failed to fetch from AI"}`);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Network or AI connection failed. Please ensure the backend is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const isCorrect = selectedAnswer === questions[currentStep].answer;
    if (isCorrect) {
      setScore(s => s + 1);
    }
    
    setUserAnswers(prev => [...prev, {
      question: questions[currentStep].q,
      selected: selectedAnswer,
      correct: questions[currentStep].answer,
      isCorrect: isCorrect
    }]);

    if (currentStep < questions.length - 1) {
      setCurrentStep(c => c + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      // Save score to local storage
      const history = JSON.parse(localStorage.getItem("quiz_scores") || "{}");
      history[subject] = (history[subject] || []).concat({ date: new Date().toLocaleDateString(), score: score + (isCorrect ? 1 : 0), total: questions.length });
      localStorage.setItem("quiz_scores", JSON.stringify(history));
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
    }}>
      <div className="glass-panel animate-slide-up" style={{
        background: 'var(--bg-primary)', width: '90%', maxWidth: '600px', 
        borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)'
      }}>
        
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)' }}>🤖 AI Mock Quiz: {subject}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          
          {error ? (
             <div style={{ textAlign: 'center', color: 'var(--error)' }}>
                <p>⚠️ {error}</p>
                <button className="primary-btn" onClick={startQuiz}>Try Again</button>
             </div>
          ) : questions.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '16px' }}>Ready to test your knowledge on {subject}? Our AI will generate 5 brand new questions right now.</p>
              <button 
                className="primary-btn" 
                onClick={startQuiz} 
                disabled={loading}
                style={{ width: '100%', padding: '14px', fontSize: '16px', borderRadius: '8px' }}
              >
                {loading ? '🧠 Generating Questions...' : 'Start Quiz'}
              </button>
            </div>
          ) : showResult ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                {score >= 4 ? '🏆' : score >= 2 ? '👍' : '📚'}
              </div>
              <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>Quiz Complete!</h3>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                You scored <strong style={{ color: 'var(--accent-primary)' }}>{score}</strong> out of {questions.length}.
              </p>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '24px', textAlign: 'left' }}>
                {userAnswers.map((ans, idx) => (
                  <div key={idx} style={{ 
                    marginBottom: '12px', padding: '16px', background: 'var(--bg-secondary)', 
                    borderRadius: '8px', borderLeft: ans.isCorrect ? '4px solid #10B981' : '4px solid #EF4444' 
                  }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      Q{idx + 1}: {ans.question}
                    </div>
                    <div style={{ fontSize: '14px', color: ans.isCorrect ? '#10B981' : '#EF4444', marginBottom: '4px' }}>
                      Your Answer: {ans.selected} {ans.isCorrect ? '✓' : '✗'}
                    </div>
                    {!ans.isCorrect && (
                      <div style={{ fontSize: '14px', color: '#10B981' }}>
                        Correct Answer: {ans.correct}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="secondary-btn" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '8px' }}>Close</button>
                <button className="primary-btn" onClick={startQuiz} style={{ flex: 1, padding: '12px', borderRadius: '8px' }}>Take Another</button>
              </div>
            </div>
          ) : (
            <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                  <span>Question {currentStep + 1} of {questions.length}</span>
               </div>
               <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '24px', lineHeight: '1.4' }}>
                 {questions[currentStep].q}
               </h3>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                 {questions[currentStep].options.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedAnswer(opt)}
                      style={{
                        padding: '16px', borderRadius: '8px', textAlign: 'left', fontSize: '16px',
                        background: selectedAnswer === opt ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-secondary)',
                        border: selectedAnswer === opt ? '2px solid var(--accent-primary)' : '2px solid var(--glass-border)',
                        color: selectedAnswer === opt ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        cursor: 'pointer', transition: 'all 0.2s', fontWeight: selectedAnswer === opt ? 'bold' : 'normal'
                      }}
                    >
                      {opt}
                    </button>
                 ))}
               </div>

               <button 
                  className="primary-btn" 
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                  style={{ width: '100%', padding: '14px', fontSize: '16px', borderRadius: '8px', opacity: !selectedAnswer ? 0.5 : 1 }}
                >
                  {currentStep === questions.length - 1 ? 'Finish & See Score' : 'Next Question ➔'}
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizModal;
