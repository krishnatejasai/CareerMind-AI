import { useState } from "react";
import axios from "axios";
import MockInterview from "./MockInterview";
import InterviewHistory from "./InterviewHistory";

function InterviewForm() {
  const [resumeFile, setResumeFile] = useState(null);
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Fresher / Student");
  const [interviewType, setInterviewType] = useState("Technical + Behavioral");
  const [companyMode, setCompanyMode] = useState("General");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleGenerate = async () => {
    if (!resumeFile) {
      alert("Please upload your resume first.");
      return;
    }

    try {
      setLoading(true);
      setQuestions([]);

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("targetRole", targetRole);
      formData.append("experienceLevel", experienceLevel);
      formData.append("interviewType", interviewType);
      formData.append("companyMode", companyMode);

      const response = await axios.post(
        "https://careermind-ai-backend-g4u5.onrender.com/api/generate-questions",
        formData
      );

      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setQuestions([]);
  };

  return (
    <section className="px-16 pb-20">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-purple-100 bg-gradient-to-br from-white to-purple-50 p-8 shadow-2xl shadow-purple-100">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-purple-600">
            Try CareerMind AI
          </p>

          <h2 className="mt-2 text-4xl font-black text-slate-900">
            Generate Your Personalized Interview
          </h2>

          <p className="mt-3 text-slate-600">
            Upload your resume, choose your role, select a company mode, and
            start a realistic AI-powered mock interview.
          </p>
        </div>

        {questions.length === 0 && (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold text-slate-700">
                  Upload Resume
                </label>

                <div className="rounded-3xl border-2 border-dashed border-purple-300 bg-white p-8 text-center transition hover:border-purple-500">
                  <div className="mb-4 text-5xl">📄</div>

                  <h3 className="text-lg font-bold text-slate-800">
                    Upload Your Resume
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    PDF format only • Max 5MB
                  </p>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files[0] || null)}
                    className="mt-6 block w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600"
                  />

                  {resumeFile && (
                    <p className="mt-4 font-semibold text-green-600">
                      ✓ {resumeFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block font-bold text-slate-700">
                    Target Role
                  </label>

                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  >
                    <option>Software Engineer</option>
                    <option>Full Stack Developer</option>
                    <option>Machine Learning Engineer</option>
                    <option>Data Analyst</option>
                    <option>Backend Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-bold text-slate-700">
                    Experience Level
                  </label>

                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  >
                    <option>Fresher / Student</option>
                    <option>0 - 1 Year</option>
                    <option>1 - 3 Years</option>
                    <option>3+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-bold text-slate-700">
                    Interview Type
                  </label>

                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  >
                    <option>Technical + Behavioral</option>
                    <option>Technical Only</option>
                    <option>Behavioral Only</option>
                    <option>System Design</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-bold text-slate-700">
                    Company Mode
                  </label>

                  <select
                    value={companyMode}
                    onChange={(e) => setCompanyMode(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  >
                    <option>General</option>
                    <option>Amazon</option>
                    <option>Google</option>
                    <option>Microsoft</option>
                    <option>Meta</option>
                    <option>Adobe</option>
                    <option>NVIDIA</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-bold text-white shadow-xl shadow-purple-200 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Generating Questions..."
                    : "Generate Interview Questions ✨"}
                </button>
              </div>
            </div>

            <InterviewHistory />
          </>
        )}

        {questions.length > 0 && (
          <MockInterview
            questions={questions}
            targetRole={targetRole}
            companyMode={companyMode}
            onRestart={handleRestart}
          />
        )}
      </div>
    </section>
  );
}

export default InterviewForm;