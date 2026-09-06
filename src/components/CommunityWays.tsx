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
  const current = items[active];

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

      {/* ---- lg and up: list left, copy right ---- */}
      <div className="hidden gap-12 lg:grid lg:grid-cols-12">
        <ul className="lg:col-span-5">
          {items.map((item, i) => (
            <li key={item.label} className="hairline">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active}
                className="flex w-full items-baseline gap-3 py-4 text-left transition-opacity hover:opacity-100"
              >
                <span className="text-ink-30">[{String(i + 1).padStart(2, "0")}]</span>
                <span
                  className={`display text-3xl transition-opacity ${
                    i === active ? "opacity-100" : "opacity-40"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
          <p className="measure max-w-none text-lg">{current.body}</p>
        </div>
      </div>
    </>
  );
}
