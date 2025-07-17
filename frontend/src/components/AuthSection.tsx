"use client";
import { useState } from "react";
import { Github } from "lucide-react";

export default function AuthSection() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    // Use environment variable for backend URL, fallback to localhost
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/api/auth/github`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Github className="h-6 w-6 text-white" aria-label="GitHub Icon" />
        <h2 className="text-2xl font-bold text-white">Authenticate</h2>
      </div>
      <p className="text-gray-300 mb-4">
        Sign in to enable secure access to private repositories and
        session-based customization.
      </p>
      <button
        type="button"
        onClick={handleSignIn}
        disabled={loading}
        className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60"
        aria-label="Sign in with GitHub"
      >
        <Github className="h-5 w-5" />
        {loading ? "Redirecting..." : "Sign in with GitHub"}
      </button>
    </div>
  );
}
