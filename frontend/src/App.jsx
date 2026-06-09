import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import InterviewForm from "./components/InterviewForm";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-300 p-3 text-slate-900">
      <div className="mx-auto w-[98%] overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <Navbar />
        <Hero />
        <Features />
        <InterviewForm />
      </div>
    </div>
  );
}

export default App;