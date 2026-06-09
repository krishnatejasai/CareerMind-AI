function Navbar() {
  return (
    <nav className="flex items-center justify-between px-12 py-7">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-xl text-white">
          🧠
        </div>

        <h1 className="text-3xl font-black">
          CareerMind <span className="text-purple-600">AI</span>
        </h1>
      </div>

      <div className="hidden items-center gap-10 font-semibold text-slate-700 lg:flex">
        <a href="#">Home</a>
        <a href="#">Features</a>
        <a href="#">How It Works</a>
        <a href="#">Roadmap</a>
        <a href="#">About</a>
      </div>

      <button className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3 font-semibold text-white shadow-lg shadow-purple-200">
        🚀 Get Started
      </button>
    </nav>
  );
}

export default Navbar;