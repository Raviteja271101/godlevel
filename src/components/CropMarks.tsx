/** Four corner registration brackets framing the parent box. */
export default function CropMarks({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`marks ${className}`}>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
