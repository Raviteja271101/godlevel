export default function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="hairline overflow-hidden border-b border-hair py-3">
      <div className="marquee-track flex w-max gap-8">
        {loop.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-8">
            {item}
            <span className="text-ink-30">&#9642;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
