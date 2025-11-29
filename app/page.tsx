import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 border rounded-lg shadow text-center">
        <h1 className="text-2xl font-semibold mb-6">JWT-1 Demo</h1>

        <div className="mb-6 text-left text-sm bg-gray-50 p-3 rounded border">
          <p className="font-semibold mb-1">
            Dane dla przetestowania:
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> user@example.com
            <br />
            <strong>Password:</strong> password123
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="block bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Go to Login
          </Link>

          <Link
            href="/profile"
            className="block border py-2 rounded hover:bg-gray-100"
          >
            Go to Profile{" "}
            <span className="text-gray-500 text-sm">(see after login)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
