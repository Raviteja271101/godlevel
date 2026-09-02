import Reveal from "./Reveal";
import ScrambleText from "./ScrambleText";
import SplitWords from "./SplitWords";

export default function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <header className="px-6 pt-32 pb-14 md:px-8 md:pt-40 md:pb-20">
      <Reveal>
        <p className="eyebrow">
          <ScrambleText text={eyebrow} trigger="view" />
        </p>
        <h1 className="display t-statement mt-5">
          <SplitWords text={title} stagger={70} />
        </h1>
        <p className="measure mt-8">{intro}</p>
      </Reveal>
    </header>
  );
}
