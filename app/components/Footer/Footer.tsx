export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-4 text-center text-sm text-gray-600">
        <p>
          Built by <span className="font-semibold">Shashank Shaurabh</span>
        </p>

        <div className="flex justify-center gap-4 mt-2">
          <a
            href="https://github.com/YOUR_GITHUB"
            target="_blank"
            className="hover:underline"
          >
            GitHub
          </a>

          <a
            href="https://linkedin.com/in/YOUR_LINKEDIN"
            target="_blank"
            className="hover:underline"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}   