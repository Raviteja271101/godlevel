/**
 * The frame that stays on screen across the whole site: four corner
 * brackets plus a tick at the midpoint of the left and right edges.
 * Fixed to the viewport, so it never scrolls and never changes between pages.
 */
export default function ViewportMarks() {
  return (
    <div className="viewport-marks" aria-hidden="true">
      <i className="tl" />
      <i className="tr" />
      <i className="bl" />
      <i className="br" />
      <i className="ml" />
      <i className="mr" />
    </div>
  );
}
