function InterviewHistory() {
  const history = JSON.parse(localStorage.getItem("careerMindHistory")) || [];

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 rounded-3xl bg-white p-6 shadow-lg">
      <h3 className="mb-5 text-2xl font-black text-slate-900">
        Interview History
      </h3>

      <div className="space-y-4">
        {history.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
          >
            <div>
              <p className="font-bold text-slate-900">{item.role}</p>
              <p className="text-sm text-slate-500">
                {item.company} • {item.date}
              </p>
            </div>

            <div className="text-right">
              <p className="font-black text-purple-600">{item.score}/10</p>
              <p className="text-sm text-slate-500">{item.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InterviewHistory;