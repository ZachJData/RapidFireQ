"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // 1) Sign up via Supabase Auth
    const { data, error } = await supabase.auth.signUp(
      { email, password },
      { data: { full_name: fullName } } // store fullName in user_metadata
    );
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // 2) Success → prompt email confirmation
    setStep("checkEmail");
    setLoading(false);
  };

  if (step === "checkEmail") {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 border rounded shadow text-center">
        <h1 className="text-2xl font-semibold mb-4">Almost there!</h1>
        <p className="mb-6">
          We’ve sent a confirmation link to&nbsp;
          <strong>{email}</strong>. Please click that link to confirm your
          address, then come back here and <a href="/login" className="text-blue-600 underline">log in</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded shadow">
      <h1 className="text-2xl font-semibold mb-6">Sign Up</h1>
      {errorMsg && <p className="mb-4 text-red-600">{errorMsg}</p>}
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            className="w-full p-2 border rounded"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            className="w-full p-2 border rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            className="w-full p-2 border rounded"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
