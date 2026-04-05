import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-6xl font-extrabold text-[#1B4332] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#FF7300] hover:bg-[#FF9640] text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
        >
          View All Locations
        </Link>
      </div>
    </main>
  );
}
