"use client";

import { useState } from "react";
import { IconMail } from "./icons";
import { subscribeNewsletter } from "@/lib/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const res = await subscribeNewsletter(email);
    if (res.success) {
      setStatus("success");
      setMessage(res.message);
      setEmail("");
    } else {
      setStatus("error");
      setMessage(res.message);
    }
  };

  return (
    <div className="relative bg-grad-news rounded-[26px] overflow-hidden px-6 sm:px-12 py-12 sm:py-16 text-center">
      <div className="absolute left-[10%] top-8 w-[220px] h-[220px] rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute right-[6%] bottom-[-40px] w-[240px] h-[240px] rounded-full bg-white/10 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-white text-2xl sm:text-[30px] tracking-tight">
          Get restock alerts before anyone else
        </h2>
        <p className="text-[#FFE9E2] text-sm mt-3">
          Drop days, limited runs and subscriber-only bundles. One email a week.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center mt-8 max-w-lg mx-auto">
          <div className="flex items-center gap-2.5 bg-white rounded-full h-14 px-6 flex-1 shadow-inner">
            <IconMail className="w-4 h-4 text-[#736E9B] shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              disabled={status === "loading"}
              required
              className="outline-none text-sm text-[#171136] placeholder:text-[#736E9B] w-full bg-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-[#171136] hover:bg-[#251c4a] active:scale-95 disabled:opacity-75 transition-all text-white font-bold text-[15px] rounded-full h-14 px-8 shrink-0 shadow-md"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm font-semibold transition-all ${
              status === "success" ? "text-white bg-black/20 rounded-full py-1.5 px-4 inline-block" : "text-yellow-200"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
