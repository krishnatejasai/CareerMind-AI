import heroImage from "../assets/hero.jpeg";

function Hero() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-20 py-14">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl"></div>
      <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl"></div>

      <section className="relative grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-md">
            🚀 Your AI Career Copilot
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight xl:text-6xl">
            Prepare{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smarter.
            </span>
            <br />
            Get Hired{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Faster.
            </span>
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-8 text-slate-600">
            CareerMind AI analyzes your resume, generates personalized interview
            questions, evaluates your answers, and helps you become
            interview-ready.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-bold text-white shadow-xl shadow-purple-200">
              Start Interview Prep →
            </button>

            <button className="rounded-2xl bg-white px-8 py-4 font-bold shadow-md">
              ▶ See How It Works
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="h-10 w-10 rounded-full border-2 border-white bg-pink-300"></div>
              <div className="h-10 w-10 rounded-full border-2 border-white bg-yellow-300"></div>
              <div className="h-10 w-10 rounded-full border-2 border-white bg-blue-300"></div>
              <div className="h-10 w-10 rounded-full border-2 border-white bg-green-300"></div>
            </div>

            <span className="text-yellow-500">★★★★★</span>

            <span className="text-sm text-slate-600">
              Trusted by aspiring engineers
            </span>
          </div>
        </div>

        <div className="relative flex min-h-[470px] items-center justify-center">
          <div className="absolute h-[430px] w-[430px] rounded-full bg-purple-200/50 blur-2xl"></div>

          <img
            src={heroImage}
            alt="CareerMind AI interview preparation illustration"
            className="relative z-10 w-[760px] max-w-full object-contain drop-shadow-2xl"
          />
        </div>
      </section>
    </main>
  );
}

export default Hero;