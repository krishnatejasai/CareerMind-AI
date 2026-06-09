const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.0-flash";

const cleanJson = (text) => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

const isGibberish = (answer) => {
  const cleaned = answer.trim().toLowerCase();

  const weakAnswers = [
    "i don't know",
    "i dont know",
    "idk",
    "no idea",
    "not sure",
    "nothing",
    "na",
    "n/a",
    "no experience",
  ];

  if (!cleaned || weakAnswers.includes(cleaned)) return true;
  if (/\d{4,}/.test(cleaned)) return true;

  const words = cleaned.split(/\s+/);
  const meaningfulWords = words.filter(
    (word) => /^[a-z]+$/.test(word) && word.length > 2
  );

  const meaningfulRatio = meaningfulWords.length / Math.max(words.length, 1);

  return meaningfulRatio < 0.5;
};

const getFallbackFeedback = (answer) => {
  const cleaned = answer.trim();
const vaguePhrases = [
  "i want to make",
  "i made website",
  "i made a website",
  "that is the challenge",
  "this is my project",
  "i solved it",
];

const isVague = vaguePhrases.some((phrase) =>
  cleaned.toLowerCase().includes(phrase)
);

if (isVague && cleaned.length < 120) {
  return {
    score: 3,
    strengths: ["You mentioned a project, but the explanation is too vague."],
    improvements: [
      "Explain the actual technical challenge.",
      "Mention the tools, approach, issue faced, and final solution.",
    ],
    sampleAnswer:
      "A stronger answer would explain the problem clearly, such as building authentication, handling API errors, designing database models, improving UI responsiveness, or deploying the application, then describe how you solved it.",
  };
}
  if (isGibberish(cleaned)) {
    return {
      score: 1,
      strengths: ["You attempted to respond instead of leaving it blank."],
      improvements: [
        "Your answer does not meaningfully address the question.",
        "Explain the concept clearly and connect it to a real project or experience.",
      ],
      sampleAnswer:
        "A stronger answer should define the concept, explain how it works, describe where you used it, and mention the outcome or impact.",
    };
  }

  if (cleaned.length < 80) {
    return {
      score: 4,
      strengths: [
        "Your answer is somewhat relevant.",
        "You gave a brief response.",
      ],
      improvements: [
        "Add more technical explanation.",
        "Include a specific project example and measurable impact.",
      ],
      sampleAnswer:
        "A stronger answer should start with a clear definition, explain the technical details, describe where you used it, and mention the result or impact.",
    };
  }

  if (cleaned.length < 200) {
    return {
      score: 6,
      strengths: [
        "Your answer has relevant points.",
        "You explained the idea at a basic level.",
      ],
      improvements: [
        "Use a stronger structure such as STAR or Problem-Action-Result.",
        "Add more depth, tools used, trade-offs, and outcome.",
      ],
      sampleAnswer:
        "A stronger answer should explain the situation, the technical approach, the tools used, the challenges faced, and the final impact.",
    };
  }

  return {
    score: 8,
    strengths: [
      "Your answer is detailed and relevant.",
      "You provided enough context for the interviewer to understand your experience.",
    ],
    improvements: [
      "Make the answer more concise.",
      "Add measurable results or stronger technical trade-offs.",
    ],
    sampleAnswer:
      "A stronger answer would be concise, structured, technical, and include measurable impact such as performance improvement, reduced errors, or user benefit.",
  };
};

app.get("/", (req, res) => {
  res.send("CareerMind AI Backend is running");
});

app.post("/api/generate-questions", upload.single("resume"), async (req, res) => {
  try {
    const { targetRole, experienceLevel, interviewType, companyMode } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const resumeSummary = `
Skills: React.js, Node.js, Express.js, MongoDB, JavaScript, Python, Machine Learning
Projects: CareerMind AI, IGSA Portal, Full Stack Web Applications
Experience: Student / Fresher with project-based full-stack and AI experience
`;

    const prompt = `
You are CareerMind AI, an expert interviewer.

Resume Summary:
${resumeSummary}

Target Role: ${targetRole}
Experience Level: ${experienceLevel}
Interview Type: ${interviewType}
Company Mode: ${companyMode}

Generate exactly 10 personalized interview questions.
Include role-specific, project-based, behavioral, and company-style questions.
Return ONLY valid JSON array of strings.
`;

    let questions;

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const result = await model.generateContent(prompt);
      questions = JSON.parse(cleanJson(result.response.text()));
    } catch (error) {
      console.log("Gemini Question Error:");
      console.log(error.message);

      questions = [
        `Tell me about yourself for a ${targetRole} role.`,
        `Which project from your resume best matches ${targetRole}?`,
        `Explain one technical challenge you solved in your projects.`,
        `How would you design a scalable full-stack application?`,
        `Explain REST APIs and how you used them.`,
        `Describe your experience with React and backend development.`,
        `How would you debug a production issue?`,
        `Tell me about a time you learned a new technology quickly.`,
        `Why are you interested in ${companyMode} style interviews?`,
        `What topics should you improve before this interview?`,
      ];
    }

    res.json({ success: true, questions });
  } catch (error) {
    console.error("Generate questions error:", error.message);
    res.status(500).json({ message: "Failed to generate questions" });
  }
});

app.post("/api/evaluate-answer", async (req, res) => {
  try {
    const { question, answer, targetRole } = req.body;

    const prompt = `
You are CareerMind AI, a strict FAANG-style interview evaluator.

Target Role: ${targetRole}
Question: ${question}
Candidate Answer: ${answer}

Scoring rules:
- Empty, irrelevant, "I don't know", nonsense, random words, or random numbers = 1 to 2
- Very weak answer with almost no explanation = 3 to 4
- Basic answer with partial correctness = 5 to 6
- Good answer with technical detail and example = 7 to 8
- Excellent answer with structure, depth, trade-offs, and measurable impact = 9 to 10

Be strict. Do not give high scores for vague, short, random, or meaningless answers.

Return ONLY valid JSON:
{
  "score": number from 1 to 10,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "sampleAnswer": "a stronger sample answer"
}
`;

    let feedback;

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const result = await model.generateContent(prompt);
      feedback = JSON.parse(cleanJson(result.response.text()));
    } catch (error) {
      console.log("Gemini Evaluation Error:");
      console.log(error.message);

      console.log("USING FALLBACK");

feedback = getFallbackFeedback(answer);
    }

    res.json({ success: true, feedback });
  } catch (error) {
    console.error("Evaluate answer error:", error.message);
    res.status(500).json({ message: "Failed to evaluate answer" });
  }
});

app.post("/api/career-roadmap", async (req, res) => {
  try {
    const { targetRole, averageScore } = req.body;

    const roadmap = {
      role: targetRole,
      summary:
        averageScore >= 8
          ? "You are close to interview-ready. Focus on polishing communication and advanced topics."
          : "You have a good foundation, but need more focused practice before interviews.",
      skillsToImprove: [
        "Data Structures and Algorithms",
        "System Design Basics",
        "Project Explanation",
        "Behavioral Storytelling",
      ],
      weeklyPlan: [
        "Week 1: Revise DSA patterns and solve 15 problems.",
        "Week 2: Practice React, Node.js, REST APIs, and database design.",
        "Week 3: Prepare 5 strong project stories using STAR method.",
        "Week 4: Take mock interviews and improve weak areas.",
      ],
    };

    res.json({ success: true, roadmap });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate roadmap" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});