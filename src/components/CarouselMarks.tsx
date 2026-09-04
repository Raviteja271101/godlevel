/**
 * The row of position marks under a carousel.
 *
 * Drawn as one SVG so the marks keep fixed positions relative to each other
 * and the row never reflows as the current one moves. As separate elements
 * they sat at fractional offsets and any transition on them restarted on
 * every re-render while scrolling, which left the paint behind the state and
 * made the current mark look a different weight depending on its slot.
 *
 * Deliberately no crispEdges: it snaps each rect to the pixel grid on its
 * own, so at browser zoom levels that do not land on whole pixels the marks
 * snap to different widths and one comes out heavier than the rest. Ordinary
 * antialiasing treats them all alike at any zoom, which is what the layout
 * this follows does.
 *
 * Sizes are the reference's, measured at 390px: every mark one pixel wide,
 * five apart, on a shared baseline. Resting heights step through a repeating
 * pattern; the current mark is the tallest and the only one at full strength.
 */
const SLOT = 6; // 1px mark + 5px gap
const MARK_W = 1;
const RESTING_H = [14, 18, 10, 16, 12];
const CURRENT_H = 20;

export default function CarouselMarks({
  count,
  active,
  className = "",
}: {
  count: number;
  active: number;
  className?: string;
}) {
  const width = (count - 1) * SLOT + MARK_W;

  return (
    <svg
      aria-hidden="true"
      width={width}
      height={CURRENT_H}
      viewBox={`0 0 ${width} ${CURRENT_H}`}
      className={`shrink-0 overflow-visible ${className}`}
    >
      {Array.from({ length: count }, (_, i) => {
        const isActive = i === active;
        const h = isActive ? CURRENT_H : RESTING_H[i % RESTING_H.length];
        return (
          <rect
            key={i}
            data-active={isActive}
            x={i * SLOT}
            y={CURRENT_H - h}
            width={MARK_W}
            height={h}
            fill="currentColor"
            opacity={isActive ? 1 : 0.4}
          />
        );
      })}
    </svg>
  );
}
