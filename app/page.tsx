// app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        {/* Header content */}
      </header>

      <section className="hero bg-blue-50 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Task Management Made Simple</h1>
        <p className="text-lg text-gray-600 mb-8">
          Organize your work and life with ease
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg">
          Get Started
        </button>
      </section>

      <section className="features py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
          {/* Feature cards */}
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        {/* Footer content */}
      </footer>
    </div>
  );
}
