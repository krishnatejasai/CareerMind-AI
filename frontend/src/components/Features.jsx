const features = [
  {
    icon: "📄",
    title: "Resume Analysis",
    text: "Extract skills, strengths and improvement areas from your resume.",
  },
  {
    icon: "❓",
    title: "Question Generation",
    text: "Generate personalized technical and behavioral interview questions.",
  },
  {
    icon: "✨",
    title: "AI Feedback",
    text: "Receive detailed feedback, scores and improvement suggestions.",
  },
  {
    icon: "📊",
    title: "Readiness Report",
    text: "Track overall performance and identify weak areas.",
  },
  {
    icon: "💼",
    title: "Career Guidance",
    text: "Discover suitable career paths based on your profile.",
  },
];

function Features() {
  return (
    <section className="px-16 py-16">
      <h2 className="text-center text-4xl font-black">
        Everything you need to{" "}
        <span className="text-purple-600">ace your next interview</span>
      </h2>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-2xl text-white">
              {feature.icon}
            </div>

            <h3 className="mb-3 font-bold">{feature.title}</h3>

            <p className="text-sm leading-6 text-slate-600">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;