"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // No backend wired up — swap this for your provider's endpoint.
        setDone(true);
        setEmail("");
      }}
      className="w-full max-w-sm"
    >
      <label htmlFor="newsletter" className="eyebrow">
        Mailing list
      </label>

      <div className="mt-3 flex items-center gap-3 border-b border-current pb-2">
        <input
          id="newsletter"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setDone(false);
          }}
          placeholder="YOU@EMAIL.COM"
          className="w-full bg-transparent uppercase placeholder:opacity-40 focus:outline-none"
        />
        <button type="submit" className="arrow-link shrink-0 whitespace-nowrap">
          Sign up
        </button>
      </div>

      <p className="mt-2 h-5 opacity-60" role="status">
        {done ? "Thanks — check your inbox." : ""}
      </p>
    </form>
  );
}
