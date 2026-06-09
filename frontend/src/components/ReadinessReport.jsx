import jsPDF from "jspdf";

function ReadinessReport({ scores, role, company, onRestart }) {
  const average =
    scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;

  const status =
    average >= 8
      ? "Interview Ready"
      : average >= 6
      ? "Almost Ready"
      : "Needs More Practice";

  const saveToHistory = () => {
    const previous = JSON.parse(localStorage.getItem("careerMindHistory")) || [];

    const newSession = {
      role,
      company,
      score: average,
      status,
      date: new Date().toLocaleDateString(),
    };

    localStorage.setItem(
      "careerMindHistory",
      JSON.stringify([newSession, ...previous])
    );
  };

  const downloadPDF = () => {
    saveToHistory();

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("CareerMind AI - Readiness Report", 20, 25);

    doc.setFontSize(14);
    doc.text(`Target Role: ${role}`, 20, 45);
    doc.text(`Company Mode: ${company}`, 20, 55);
    doc.text(`Overall Score: ${average}/10`, 20, 65);
    doc.text(`Status: ${status}`, 20, 75);

    doc.text("Recommended Focus Areas:", 20, 95);
    doc.text("- Data Structures and Algorithms", 25, 105);
    doc.text("- System Design Basics", 25, 115);
    doc.text("- Project Explanation", 25, 125);
    doc.text("- Behavioral Storytelling", 25, 135);

    doc.save("CareerMind-AI-Readiness-Report.pdf");
  };

  saveToHistory();

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
      <p className="font-bold text-purple-600">FINAL REPORT</p>

      <h2 className="mt-2 text-4xl font-black">
        Your Interview Readiness Report
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-purple-50 p-6 text-center">
          <p className="font-bold text-slate-600">Overall Score</p>
          <h3 className="mt-3 text-5xl font-black text-purple-600">
            {average}/10
          </h3>
        </div>

        <div className="rounded-3xl bg-green-50 p-6 text-center">
          <p className="font-bold text-slate-600">Status</p>
          <h3 className="mt-3 text-2xl font-black text-green-600">
            {status}
          </h3>
        </div>

        <div className="rounded-3xl bg-orange-50 p-6 text-center">
          <p className="font-bold text-slate-600">Company Mode</p>
          <h3 className="mt-3 text-2xl font-black text-orange-500">
            {company}
          </h3>
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-slate-50 p-6">
        <h3 className="text-2xl font-black">Career Roadmap</h3>

        <ul className="mt-4 space-y-3 text-slate-700">
          <li>• Revise DSA patterns and solve role-specific problems.</li>
          <li>• Practice system design basics for scalable applications.</li>
          <li>• Prepare strong project stories using the STAR method.</li>
          <li>• Improve communication by giving concise structured answers.</li>
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          onClick={downloadPDF}
          className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-bold text-white"
        >
          Download PDF Report
        </button>

        <button
          onClick={onRestart}
          className="rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white"
        >
          Restart Interview
        </button>
      </div>
    </div>
  );
}

export default ReadinessReport;