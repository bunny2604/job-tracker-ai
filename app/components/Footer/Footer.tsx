export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white border-t mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-4 text-center text-sm">

        <p>
          Built by <span className="font-semibold">Shashank Shaurabh</span>
        </p>

        <div className="flex justify-center gap-6 mt-2">
          <a
            href="https://github.com/bunny2604/job-tracker-ai.git"
            target="_blank"
            className="hover:text-gray-200 transition"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/shashank-shaurabh-8524b0115"
            target="_blank"
            className="hover:text-gray-200 transition"
          >
            LinkedIn
          </a>
        </div>

      </div>
    </footer>
  );
}