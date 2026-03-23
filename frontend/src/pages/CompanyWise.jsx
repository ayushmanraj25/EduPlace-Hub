import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CompanyWise() {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);

  const companies = [
    {
      name: "TCS",
      logo: "🟦",
      color: "#0070C0",
      difficulty: "Easy – Medium",
      rounds: "Online Test → Technical → HR",
      questions: [
        { type: "Aptitude", q: "A train 240m long passes a pole in 24 seconds. Find the speed of the train.", a: "Speed = 240/24 = 10 m/s = 36 km/h" },
        { type: "Technical", q: "What is the difference between DBMS and RDBMS?", a: "DBMS stores data as files, RDBMS stores data in tables with relationships. RDBMS supports SQL, ACID properties, and normalization." },
        { type: "Technical", q: "Explain the concept of Normalization and its types.", a: "Normalization reduces data redundancy: 1NF (atomic values), 2NF (remove partial dependency), 3NF (remove transitive dependency), BCNF (stricter 3NF)." },
        { type: "Coding", q: "Write a program to reverse a string without using built-in functions.", a: "Use two pointers (start and end), swap characters while start < end, increment start and decrement end." },
        { type: "HR", q: "Why do you want to join TCS?", a: "TCS is a global IT leader with diverse projects. I value their training programs and opportunities for growth in emerging technologies." },
        { type: "Aptitude", q: "If 20% of a number is 80, what is the number?", a: "Let number = x. 20% of x = 80, so x = 80 × 100/20 = 400" },
      ],
    },
    {
      name: "Infosys",
      logo: "🟪",
      color: "#007CC3",
      difficulty: "Medium",
      rounds: "Online Test → Technical → HR → Managerial",
      questions: [
        { type: "Aptitude", q: "In how many ways can 5 people be seated in a row?", a: "5! = 5 × 4 × 3 × 2 × 1 = 120 ways" },
        { type: "Technical", q: "What are the four pillars of OOPs?", a: "Encapsulation (data hiding), Abstraction (hiding complexity), Inheritance (reusing code), Polymorphism (one interface, many implementations)." },
        { type: "Technical", q: "Explain the difference between Stack and Queue.", a: "Stack is LIFO (Last In First Out) — push/pop from top. Queue is FIFO (First In First Out) — enqueue at rear, dequeue from front." },
        { type: "Coding", q: "Find the second largest element in an array.", a: "Traverse once to find max, traverse again ignoring max to find second max. O(n) time complexity." },
        { type: "HR", q: "Tell me about yourself.", a: "Brief intro covering education, skills, projects, and career goals relevant to the role." },
        { type: "Coding", q: "Check if a given string is a palindrome.", a: "Compare string with its reverse. If equal, it's a palindrome. Time: O(n), Space: O(1) with two pointers." },
      ],
    },
    {
      name: "Wipro",
      logo: "🟩",
      color: "#49166D",
      difficulty: "Easy – Medium",
      rounds: "Online Test → Technical → HR",
      questions: [
        { type: "Aptitude", q: "A man buys an article for ₹200 and sells it for ₹250. Find the profit percentage.", a: "Profit = 250 - 200 = 50. Profit% = (50/200) × 100 = 25%" },
        { type: "Technical", q: "What is the difference between TCP and UDP?", a: "TCP is connection-oriented, reliable, slower (handshake). UDP is connectionless, faster, unreliable. TCP for web, UDP for streaming." },
        { type: "Technical", q: "What is a Deadlock in OS? What are its conditions?", a: "Deadlock occurs when processes wait for each other indefinitely. 4 conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait." },
        { type: "Coding", q: "Write a program to find the factorial of a number using recursion.", a: "Base case: factorial(0) = 1. Recursive: factorial(n) = n × factorial(n-1)." },
        { type: "HR", q: "Are you willing to relocate?", a: "Yes, I am open to relocation as it presents an opportunity for personal and professional growth." },
      ],
    },
    {
      name: "Cognizant",
      logo: "🔷",
      color: "#003B71",
      difficulty: "Easy – Medium",
      rounds: "Online Test → Technical → HR",
      questions: [
        { type: "Aptitude", q: "The ratio of ages of A and B is 3:5. If the sum of their ages is 48, find the age of B.", a: "B's age = (5/8) × 48 = 30 years" },
        { type: "Technical", q: "What is the difference between Primary Key and Unique Key?", a: "Primary Key: unique + not null, only one per table. Unique Key: allows one null, multiple per table." },
        { type: "Coding", q: "Find the sum of digits of a number.", a: "Use modulus to extract last digit, add to sum, divide number by 10. Repeat until number becomes 0." },
        { type: "HR", q: "What are your strengths?", a: "Highlight technical skills, problem-solving ability, teamwork, and adaptability with concrete examples." },
      ],
    },
    {
      name: "Accenture",
      logo: "🟣",
      color: "#A100FF",
      difficulty: "Easy",
      rounds: "Online Assessment → Communication Test → HR",
      questions: [
        { type: "Aptitude", q: "If the price of a commodity increases by 20%, by what percent must consumption decrease to keep expenditure constant?", a: "Decrease = (20/120) × 100 = 16.67%" },
        { type: "Technical", q: "What is the difference between = and == in programming?", a: "= is the assignment operator. == is the equality comparison operator. === is strict equality (type + value)." },
        { type: "Coding", q: "Write code to find if a number is prime.", a: "Check divisibility from 2 to √n. If divisible by any, not prime. Time: O(√n)." },
        { type: "HR", q: "Why Accenture?", a: "Accenture is a leader in digital transformation and consulting. I admire their innovative culture and global reach." },
      ],
    },
    {
      name: "Amazon",
      logo: "📦",
      color: "#FF9900",
      difficulty: "Hard",
      rounds: "Online Assessment → Phone Screen → Onsite (4-5 rounds) → Bar Raiser",
      questions: [
        { type: "Technical", q: "Explain Amazon's Leadership Principles and give an example using 'Customer Obsession'.", a: "Customer Obsession means starting with the customer and working backwards. Example: building a feature based on user feedback rather than competition." },
        { type: "Coding", q: "Given an array of integers, find two numbers that add up to a specific target (Two Sum).", a: "Use a HashMap to store complements. For each number, check if (target - number) exists in the map. O(n) time." },
        { type: "Coding", q: "Design a LRU Cache.", a: "Use a doubly linked list for O(1) removal and a HashMap for O(1) lookup. Remove least recently used when capacity is exceeded." },
        { type: "System Design", q: "Design a URL shortener like bit.ly.", a: "Use Base62 encoding of auto-incremented ID. Store mapping in DB. Use cache (Redis) for hot URLs. Handle collisions and analytics." },
        { type: "Behavioral", q: "Tell me about a time you had to deal with ambiguity.", a: "Use STAR format: Situation, Task, Action, Result. Focus on how you clarified requirements and delivered results." },
      ],
    },
    {
      name: "Google",
      logo: "🔴",
      color: "#4285F4",
      difficulty: "Very Hard",
      rounds: "Phone Screen (2) → Onsite (5 rounds) → Hiring Committee",
      questions: [
        { type: "Coding", q: "Given a binary tree, check if it is a valid BST.", a: "Use in-order traversal ensuring values are strictly increasing. Or use min/max bounds recursively. O(n) time." },
        { type: "Coding", q: "Find the longest substring without repeating characters.", a: "Sliding window with a HashSet. Expand right pointer, shrink left when duplicate found. O(n) time." },
        { type: "System Design", q: "Design Google Search Autocomplete.", a: "Trie data structure for prefix matching. Rank suggestions by frequency. Use distributed cache and precompute top-K queries." },
        { type: "System Design", q: "How would you design YouTube?", a: "Video upload service, transcoding pipeline, CDN for delivery, recommendation engine, search indexing. Handle billions of views." },
        { type: "Behavioral", q: "Googleyness: Tell me about a time you went above and beyond.", a: "Focus on initiative, collaboration, and impact beyond your defined role." },
      ],
    },
    {
      name: "Microsoft",
      logo: "🟥",
      color: "#00A4EF",
      difficulty: "Hard",
      rounds: "Online Assessment → Phone Screen → Onsite (4 rounds)",
      questions: [
        { type: "Coding", q: "Implement a stack that supports getMin() in O(1) time.", a: "Use an auxiliary stack that tracks minimum values. Push to min stack when new element ≤ current min. O(1) for all operations." },
        { type: "Coding", q: "Find the diameter of a binary tree.", a: "For each node, diameter = leftHeight + rightHeight. Track maximum diameter across all nodes. O(n) time." },
        { type: "System Design", q: "Design Microsoft Teams messaging system.", a: "WebSocket for real-time messaging, message queue for reliability, NoSQL for chat storage, file storage service for attachments." },
        { type: "Technical", q: "Explain the difference between Process and Thread.", a: "Process: independent memory space, heavy context switch. Thread: shared memory, lightweight. Threads within same process can communicate faster." },
        { type: "Behavioral", q: "Describe a time you received critical feedback.", a: "Use STAR method. Show how you accepted feedback gracefully and used it to improve." },
      ],
    },
  ];

  const typeColors = {
    Aptitude: { bg: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", border: "rgba(245, 158, 11, 0.3)" },
    Technical: { bg: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", border: "rgba(59, 130, 246, 0.3)" },
    Coding: { bg: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "rgba(16, 185, 129, 0.3)" },
    HR: { bg: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "rgba(239, 68, 68, 0.3)" },
    Behavioral: { bg: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6", border: "rgba(139, 92, 246, 0.3)" },
    "System Design": { bg: "rgba(236, 72, 153, 0.1)", color: "#EC4899", border: "rgba(236, 72, 153, 0.3)" },
  };

  return (
    <div className="page-container">
      {/* Back Navigation */}
      <button
        className="secondary-btn animate-fade-in"
        style={{ marginBottom: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        onClick={() => navigate("/placement")}
      >
        ← Back to Placement
      </button>

      {!selectedCompany ? (
        <>
          <div className="animate-slide-up">
            <h2 className="gradient-text" style={{ fontSize: '42px', marginBottom: '10px' }}>Company Wise Preparation</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '50px' }}>
              Select a company to view real interview questions, patterns, and preparation strategies.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}>
            {companies.map((company, idx) => (
              <div
                key={idx}
                className={`glass-panel animate-slide-up delay-${(idx % 5 + 1) * 100}`}
                style={{
                  padding: "30px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderTop: `4px solid ${company.color}`,
                }}
                onClick={() => setSelectedCompany(company)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.1)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '36px' }}>{company.logo}</span>
                  <div>
                    <h3 style={{ fontSize: '22px', color: 'var(--text-primary)', margin: 0 }}>{company.name}</h3>
                    <span style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: 'var(--card-highlight)',
                      color: 'var(--text-muted)',
                      fontWeight: '600',
                    }}>{company.difficulty}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>
                  <strong>Rounds:</strong> {company.rounds}
                </p>
                <p style={{ color: 'var(--accent-primary)', fontSize: '14px', fontWeight: '600' }}>
                  {company.questions.length} Questions →
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* COMPANY DETAIL VIEW */
        <div className="animate-fade-in">
          <button
            className="secondary-btn"
            style={{ marginBottom: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setSelectedCompany(null)}
          >
            ← Back to All Companies
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
            <span style={{ fontSize: '48px' }}>{selectedCompany.logo}</span>
            <div>
              <h2 className="gradient-text" style={{ fontSize: '38px', margin: 0 }}>{selectedCompany.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                {selectedCompany.rounds} | Difficulty: <strong>{selectedCompany.difficulty}</strong>
              </p>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '40px' }}>
            Frequently asked questions from {selectedCompany.name} placement drives.
          </p>

          <div style={{ display: 'grid', gap: '20px' }}>
            {selectedCompany.questions.map((item, qIdx) => {
              const tc = typeColors[item.type] || { bg: 'var(--card-highlight)', color: 'var(--text-secondary)', border: 'var(--glass-border)' };
              return (
                <div
                  key={qIdx}
                  className={`glass-panel animate-slide-up`}
                  style={{
                    padding: '24px',
                    animationDelay: `${qIdx * 80}ms`,
                    borderLeft: `4px solid ${tc.color}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      background: tc.bg,
                      color: tc.color,
                      border: `1px solid ${tc.border}`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>{item.type}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Q{qIdx + 1}</span>
                  </div>
                  <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '10px', lineHeight: '1.5' }}>
                    {item.q}
                  </h4>
                  <div style={{
                    background: 'var(--bg-tertiary)',
                    padding: '14px 18px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.7',
                  }}>
                    <strong style={{ color: 'var(--success)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Answer Approach:</strong>
                    <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)' }}>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyWise;
