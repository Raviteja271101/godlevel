"use client";

import { useState } from "react";
import CropMarks from "./CropMarks";
import ScrambleText from "./ScrambleText";

const TOPICS = ["Partnerships", "Collaborations", "The Collective", "Events & Experiences", "Something Else"];

const FIELD =
  "mt-[10px] w-full border-b border-hair bg-transparent py-3 outline-none transition-colors duration-300 placeholder:text-ink-30 focus:border-ink";

/**
 * The message form, in the site's own vocabulary: grey ▪ tags for labels,
 * hairline fields, the topic choices set as [ bracketed ] tags with the
 * chosen one framed in crop marks (as the size picker is), and the red
 * button that scrambles on hover.
 *
 * There is no mail backend yet, so sending composes the message in the
 * visitor's own email app, addressed to the studio inbox.
 */
export default function ContactForm({ email }: { email: string }) {
  const [topic, setTopic] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `${topic ?? "Hello"} — ${name}`;
    const body = `${message}\n\n${name}\n${from}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-[46px]">
      <label className="block">
        <span className="eyebrow opacity-50">Name</span>
        <input name="name" type="text" required autoComplete="name" placeholder="Your name" className={FIELD} />
      </label>

      <label className="block">
        <span className="eyebrow opacity-50">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={FIELD}
        />
      </label>

      <fieldset>
        <legend className="eyebrow opacity-50">What would you like to talk about?</legend>
        <div role="radiogroup" className="mt-4 flex flex-wrap gap-x-2 gap-y-3">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={topic === t}
              onClick={() => setTopic((cur) => (cur === t ? null : t))}
              className={`relative px-2 py-2 transition-opacity duration-300 ${
                topic === t ? "opacity-100" : "opacity-50 hover:opacity-100"
              }`}
            >
              {topic === t && <CropMarks className="m-px" />}
              [ {t} ]
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="eyebrow opacity-50">Your message</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us about it"
          className={`${FIELD} resize-none leading-[1.5]`}
        />
      </label>

      <div>
        <button
          type="submit"
          className="arrow-link rounded-[2px] bg-bubble px-5 py-[13.3px] text-white"
        >
          <ScrambleText text="Send message" />
        </button>
        {sent && (
          <p className="mt-5 opacity-60" role="status">
            Your email app should open with the message ready to send. If it does not, write to{" "}
            <a href={`mailto:${email}`} className="underline underline-offset-4">
              {email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
