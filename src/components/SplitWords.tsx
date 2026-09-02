"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Splits a string into inline-block words that rise into place on scroll,
 * staggered left-to-right. Words render server-side, so the text stays
 * selectable and readable to crawlers.
 */
export default function SplitWords({
  text,
  className = "",
  delay = 0,
  stagger = 34,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    // @ts-expect-error — Tag is a constrained union of intrinsic elements.
    <Tag ref={ref} className={`splitwords ${className}`} data-inview={inView}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="word" style={{ transitionDelay: `${delay + i * stagger}ms` }}>
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
