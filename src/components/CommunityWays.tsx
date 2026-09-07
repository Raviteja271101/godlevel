"use client";

import { useState } from "react";

export type Way = { label: string; body: string };

/**
 * "How you can be a part of it": the ways listed down the left, the chosen
 * one's copy held to the right. Below lg there is no room for two columns,
 * so each way stacks with its own copy beneath it.
 */
export default function CommunityWays({ items }: { items: readonly Way[] }) {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* ---- Phone: each way stacked with its copy ---- */}
      <div className="flex flex-col divide-y divide-hair lg:hidden">
        {items.map((item, i) => (
          <div key={item.label} className="py-6 first:pt-0">
            <div className="flex gap-3">
              <span className="text-ink-30">[{String(i + 1).padStart(2, "0")}]</span>
              <h3 className="display text-2xl">{item.label}</h3>
            </div>
            <p className="measure mt-3 opacity-60">{item.body}</p>
          </div>
        ))}
      </div>

      {/* ---- lg and up: headings listed down the left, the three copies held
             together on the right — the active one full-size, the other two a
             little smaller and dimmed. ---- */}
      <div className="hidden gap-12 lg:grid lg:grid-cols-12">
        <ul className="lg:col-span-5 lg:self-center">
          {items.map((item, i) => (
            <li key={item.label} className="hairline">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active}
                className="flex w-full items-baseline gap-3 py-5 text-left transition-opacity hover:opacity-100"
              >
                <span className="text-ink-30">[{String(i + 1).padStart(2, "0")}]</span>
                <span
                  className={`display transition-all ${
                    i === active ? "text-3xl opacity-100" : "text-xl opacity-40"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="space-y-5 lg:col-span-6 lg:col-start-7 lg:self-center">
          {items.map((item, i) => (
            <p
              key={item.label}
              className={`measure max-w-none transition-all duration-300 ${
                i === active ? "text-lg opacity-100" : "text-sm opacity-40"
              }`}
            >
              {item.body}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
