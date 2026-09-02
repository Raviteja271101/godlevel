"use client";

/** Remounts on every navigation, so the wipe and lift replay per route. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-wipe" aria-hidden="true" />
      <div className="page-enter">{children}</div>
    </>
  );
}
