function isHeading(line: string) {
  const t = line.trim();
  return t.length > 2 && t.length < 60 && /[A-ZÀ-Ú]/.test(t) && t === t.toUpperCase() && !/\d/.test(t);
}

export function PrintableResume({ text }: { text: string }) {
  const lines = text.split("\n");
  let nameDone = false;
  return (
    <div id="print-area" aria-hidden="true">
      {lines.map((line, i) => {
        if (!nameDone && line.trim()) {
          nameDone = true;
          return <h1 key={i}>{line.trim()}</h1>;
        }
        if (isHeading(line)) return <h2 key={i}>{line.trim()}</h2>;
        return <p key={i}>{line || "\u00a0"}</p>;
      })}
    </div>
  );
}
