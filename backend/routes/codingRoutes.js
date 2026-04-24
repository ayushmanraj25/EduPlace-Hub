const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const os = require("os");
const { exec } = require("child_process");
const supabase = require("../config/supabase");

const DATA_FILE = path.join(__dirname, "..", "data", "coding_questions.json");

function readLocal() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch (e) {}
  return [];
}

function writeLocal(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Map database column names to frontend
function mapQuestion(q) {
  return {
    id: q.id,
    title: q.title,
    difficulty: q.difficulty,
    description: q.description,
    testCases: q.test_cases ? (typeof q.test_cases === 'string' ? JSON.parse(q.test_cases) : q.test_cases) : [],
    createdAt: q.created_at
  };
}

// 1. GET /api/coding - Get all questions
router.get("/", async (req, res) => {
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('coding_questions').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          // Hide hidden testcases logic can go here if needed
          return res.json(data.map(mapQuestion));
        }
      } catch (e) {}
    }
    const local = readLocal();
    res.json(local.reverse().map(mapQuestion));
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. GET /api/coding/:id - Get specific question
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (supabase) {
      try {
        const { data, error } = await supabase.from('coding_questions').select('*').eq('id', id);
        if (!error && data && data.length > 0) {
          return res.json(mapQuestion(data[0]));
        }
      } catch (e) {}
    }
    const local = readLocal();
    const q = local.find(x => x.id === id || x.id === Number(id));
    if (q) return res.json(mapQuestion(q));
    
    res.status(404).json({ message: "Question not found" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 3. POST /api/coding/add - Admin only
router.post("/add", async (req, res) => {
  try {
    const { title, difficulty, description, testCases, role } = req.body;
    
    if (role !== "admin") {
      return res.status(403).json({ message: "Only admin can add coding questions" });
    }

    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: "Title, difficulty, and description are required" });
    }

    const newQ = {
      id: Date.now().toString(),
      title,
      difficulty,
      description,
      test_cases: testCases || [], // array of {input, output, isHidden}
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('coding_questions').insert([{
           title: newQ.title,
           difficulty: newQ.difficulty,
           description: newQ.description,
           test_cases: newQ.test_cases
        }]).select();
        
        if (!error && data && data.length > 0) {
          return res.status(201).json(mapQuestion(data[0]));
        }
      } catch (e) {}
    }

    const local = readLocal();
    local.push(newQ);
    writeLocal(local);
    res.status(201).json(mapQuestion(newQ));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Map standard languages to Piston API format
const LANGUAGE_VERSIONS = {
  "python": "3.10.0",
  "javascript": "18.15.0",
  "c++": "10.2.0",
  "java": "15.0.2"
};

const LANGUAGE_ALIASES = {
  "python": "python",
  "javascript": "javascript",
  "cpp": "c++",
  "c++": "c++",
  "java": "java"
};

// 4. POST /api/coding/draft
router.post("/draft", async (req, res) => {
  const { userId, questionId, language, code } = req.body;
  if (!userId || !questionId) return res.status(400).json({ message: "Missing params" });
  
  if (supabase) {
    try {
      // Assuming a coding_drafts table exists
      const { data, error } = await supabase.from('coding_drafts').upsert([{
         user_id: userId,
         question_id: questionId,
         language: LANGUAGE_ALIASES[language.toLowerCase()] || language.toLowerCase(),
         code: code,
         updated_at: new Date().toISOString()
      }], { onConflict: 'user_id,question_id,language' });
      
      if (error) {
        console.log("Supabase draft save error", error);
        return res.status(500).json({ success: false, error: error.message, details: error });
      }
    } catch(e) {
      console.log("Supabase draft save error", e.message);
      return res.status(500).json({ success: false, error: e.message });
    }
  }
  res.json({ success: true });
});

// 5. GET /api/coding/draft/:questionId/:userId/:language
router.get("/draft/:questionId/:userId/:language", async (req, res) => {
  const { questionId, userId, language } = req.params;
  const langName = LANGUAGE_ALIASES[language.toLowerCase()] || language.toLowerCase();
  
  if (supabase) {
    try {
      const { data, error } = await supabase.from('coding_drafts')
        .select('code')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .eq('language', langName)
        .order('updated_at', { ascending: false })
        .limit(1);
        
      if (!error && data && data.length > 0) {
         return res.json({ code: data[0].code });
      }
    } catch(e) {}
  }
  res.json({ code: null });
});

// Helper for local execution
async function executeLocal(language, code, input) {
  return new Promise((resolve) => {
    const tmpDir = os.tmpdir();
    const id = Date.now() + "_" + Math.floor(Math.random() * 10000);
    let filepath, command, compileCommand;

    if (language === 'python' || language === 'python3') {
      filepath = path.join(tmpDir, `test_${id}.py`);
      fs.writeFileSync(filepath, code);
      command = `python3 ${filepath}`;
    } else if (language === 'javascript' || language === 'node') {
      filepath = path.join(tmpDir, `test_${id}.js`);
      fs.writeFileSync(filepath, code);
      command = `node ${filepath}`;
    } else if (language === 'c++' || language === 'cpp') {
      filepath = path.join(tmpDir, `test_${id}.cpp`);
      const outpath = path.join(tmpDir, `test_${id}.out`);
      fs.writeFileSync(filepath, code);
      compileCommand = `g++ ${filepath} -o ${outpath}`;
      command = `${outpath}`;
    } else if (language === 'java') {
      const className = `Main_${id}`;
      filepath = path.join(tmpDir, `${className}.java`);
      const safeCode = code.replace(/public\s+class\s+Main/g, `public class ${className}`);
      fs.writeFileSync(filepath, safeCode);
      compileCommand = `javac ${filepath}`;
      command = `java -cp ${tmpDir} ${className}`;
    } else {
      resolve({ error: "Unsupported local language: " + language });
      return;
    }

    const runCmd = () => {
       const child = exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
         try {
           if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
           if (language === 'c++' || language === 'cpp') {
              const outpath = path.join(tmpDir, `test_${id}.out`);
              if (fs.existsSync(outpath)) fs.unlinkSync(outpath);
           }
           if (language === 'java') {
              const classpath = filepath.replace('.java', '.class');
              if (fs.existsSync(classpath)) fs.unlinkSync(classpath);
           }
         } catch(e) {}

         if (error && error.killed) {
           resolve({ error: "Time Limit Exceeded (3s timeout)" });
         } else if (error) {
           resolve({ error: stderr || stdout || error.message });
         } else {
           resolve({ stdout: stdout, stderr: stderr });
         }
       });

       if (input) {
         child.stdin.write(input);
         child.stdin.end();
       }
    };

    if (compileCommand) {
       exec(compileCommand, { timeout: 5000 }, (cErr, cStdout, cStderr) => {
          if (cErr) resolve({ error: "Compilation Error: \n" + (cStderr || cStdout) });
          else runCmd();
       });
    } else {
       runCmd();
    }
  });
}

// 6. POST /api/coding/execute
router.post("/execute", async (req, res) => {
  try {
    const { code, language, questionId, userId } = req.body;
    
    if (!code || !language || !questionId) {
      return res.status(400).json({ message: "Missing code, language, or questionId" });
    }

    // Find the question to get testcases
    let question = null;
    if (supabase) {
      try {
         const { data } = await supabase.from('coding_questions').select('*').eq('id', questionId);
         if (data && data.length > 0) question = data[0];
      } catch(e) {}
    }
    if (!question) {
       const local = readLocal();
       question = local.find(x => x.id === String(questionId) || x.id === Number(questionId));
    }

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const testCases = typeof question.test_cases === 'string' ? JSON.parse(question.test_cases) : (question.test_cases || []);
    if (testCases.length === 0) {
      return res.status(400).json({ message: "No test cases configured for this question." });
    }

    const langName = LANGUAGE_ALIASES[language.toLowerCase()] || language.toLowerCase();
    const langVersion = LANGUAGE_VERSIONS[langName];

    if (!langVersion) {
      return res.status(400).json({ message: "Unsupported language: " + language });
    }

    let results = [];
    let allPassed = true;

    // Run code against each testcase using local exec
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      
      const resData = await executeLocal(langName, code, String(tc.input || ""));
      
      if (resData.error) {
         results.push({
           testCase: i + 1,
           passed: false,
           input: tc.input,
           expectedOutput: tc.output,
           actualOutput: resData.error,
           error: true
         });
         allPassed = false;
         continue;
      }

      let actualOut = (resData.stdout || "").trim();
      const expectedOut = String(tc.output || "").trim();
      const passed = (actualOut === expectedOut);

      if (!passed) allPassed = false;

      results.push({
        testCase: i + 1,
        passed,
        input: tc.input,
        expectedOutput: expectedOut,
        actualOutput: actualOut,
        error: !!resData.stderr,
        isHidden: tc.isHidden
      });
    }

    // Optional: Save submission to Supabase if passed
    if (allPassed && userId && supabase) {
       try {
          await supabase.from('coding_submissions').insert([{
             user_id: userId,
             question_id: questionId,
             language: langName,
             code: code,
             passed: true
          }]);
       } catch(e) {}
    }

    res.json({
      success: allPassed,
      total: testCases.length,
      passed: results.filter(r => r.passed).length,
      results: results.map(r => r.isHidden ? { testCase: r.testCase, passed: r.passed, isHidden: true } : r)
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error during execution" });
  }
});

module.exports = router;
