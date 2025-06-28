"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // 1) Sign in via Supabase Auth
    const { data, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setErrorMsg(signInError.message);
      setLoading(false);
      return;
    }

    // 2) Upsert a profile row (if it doesn't exist)
    const user = data.user;
    const fullName = user.user_metadata?.full_name ?? "";

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName });
    if (profileError) {
      console.warn("Profile upsert failed:", profileError.message);
      // proceed anyway
    }

    // 3) Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded shadow">
      <h1 className="text-2xl font-semibold mb-6">Log In</h1>
      {errorMsg && <p className="mb-4 text-red-600">{errorMsg}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
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
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {loading ? "Logging in…" : "Log In"}
        </button>
      </form>
    </div>
  );
}
