/**
 * First-visit loader: a percentage readout and a thin determinate bar, while
 * the hero video opens behind it.
 *
 * Deliberately has no client state. The count, the bar and the hero box are
 * all driven by the CSS animations in the "First load" block of globals.css,
 * so they begin as soon as the stylesheet applies. Driven from a React effect
 * instead, nothing moved until hydration finished and the readout sat at 0%
 * for as long as that took. The inline script in layout.tsx sets the
 * `data-loaded` flag that ends the sequence and clears this away.
 */
export default function Preloader() {
  return (
    <div
      aria-hidden="true"
      className="loader pointer-events-none fixed inset-0 z-[102] flex flex-col items-center justify-end pb-[16vh] text-ink"
    >
      {/* Text comes from ::after, counting a registered custom property. */}
      <p className="loader-count tabular-nums font-medium" />

      <div className="mt-3 h-px w-[170px] bg-ink/25">
        <div className="loader-fill h-px bg-ink" />
      </div>
    </div>
  );
}
