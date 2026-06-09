import { useState, useEffect } from "react";
import axios from "axios";
import ReadinessReport from "./ReadinessReport";

function MockInterview({
  questions,
  targetRole,
  companyMode,
  onRestart,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [allScores, setAllScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (showReport) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 60;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showReport]);

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.start();

    recognition.onresult = (event) => {
      setAnswer(event.results[0][0].transcript);
    };
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please answer the question.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://careermind-ai-backend-g4u5.onrender.com/api/evaluate-answer",
        {
          question: questions[currentQuestion],
          answer,
          targetRole,
        }
      );

      setFeedback(response.data.feedback);

      setAllScores((prev) => [
        ...prev,
        response.data.feedback.score,
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    setAnswer("");
    setFeedback(null);
    setTimeLeft(60);

    if (currentQuestion + 1 >= questions.length) {
      setShowReport(true);
      return;
    }

    setCurrentQuestion((prev) => prev + 1);
  };

  if (showReport) {
    return (
      <ReadinessReport
        scores={allScores}
        role={targetRole}
        company={companyMode}
        onRestart={onRestart}
      />
    );
  }

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-bold text-purple-600">
            MOCK INTERVIEW
          </p>

          <h2 className="text-4xl font-black">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-purple-100 px-5 py-2 font-bold text-purple-700">
          {Math.round(
            ((currentQuestion + 1) / questions.length) * 100
          )}
          %
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <span className="font-bold text-red-500">
          ⏱ {timeLeft}s
        </span>

        <button
          onClick={startVoiceInput}
          className="rounded-xl bg-slate-900 px-4 py-2 text-white"
        >
          🎤 Speak
        </button>
      </div>

      <div className="rounded-3xl bg-purple-50 p-6">
        <h3 className="text-2xl font-bold">
          {questions[currentQuestion]}
        </h3>
      </div>

      <div className="mt-6">
        <label className="mb-2 block font-bold">
          Your Answer
        </label>

        <textarea
          rows="8"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full rounded-3xl border-2 border-purple-200 p-5 outline-none focus:border-purple-500"
          placeholder="Type your answer here..."
        />
      </div>

      {!feedback && (
        <button
          onClick={submitAnswer}
          disabled={loading}
          className="mt-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-bold text-white"
        >
          {loading ? "Evaluating..." : "Submit Answer"}
        </button>
      )}

      {feedback && (
        <div className="mt-8 rounded-3xl bg-slate-50 p-6">
          <h3 className="text-3xl font-black">
            Score: {feedback.score}/10
          </h3>

          <div className="mt-5">
            <h4 className="font-bold text-green-600">
              Strengths
            </h4>

            <ul className="mt-2 list-disc pl-5">
              {feedback.strengths.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <h4 className="font-bold text-red-500">
              Improvements
            </h4>

            <ul className="mt-2 list-disc pl-5">
              {feedback.improvements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-2xl bg-white p-4">
            <h4 className="font-bold">
              Sample Better Answer
            </h4>

            <p className="mt-2 text-slate-600">
              {feedback.sampleAnswer}
            </p>
          </div>

          <button
            onClick={nextQuestion}
            className="mt-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 font-bold text-white"
          >
            Next Question →
          </button>
        </div>
      )}
    </div>
  );
}

export default MockInterview;