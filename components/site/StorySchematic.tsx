/** Static diagram of the same scene states, used when no generated still exists. */
export function Schematic({ variant }: { variant: "connect" | "system" }) {
  const cells = [0, 1, 2].flatMap((c) => [0, 1].map((r) => ({ c, r })));
  const scattered = [
    [26, 40, -14], [104, 22, 9], [36, 140, 12], [126, 104, -6], [64, 204, -18], [150, 196, 15],
  ] as const;

  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" fill="none" strokeWidth="1.5">
      {variant === "connect" ? (
        <>
          {scattered.map(([x, y, rot], i) => (
            <rect key={i} x={x} y={y} width="54" height="34" rx="4" transform={`rotate(${rot} ${x + 27} ${y + 17})`} className="stroke-white/35" />
          ))}
          <path d="M222 150h22m-7-7 7 7-7 7" className="stroke-white/70" />
          {cells.map(({ c, r }) => (
            <rect key={`${c}${r}`} x={258 + c * 42} y={116 + r * 38} width="34" height="30" rx="3" className={c === 1 && r === 0 ? "stroke-accent" : "stroke-white/70"} />
          ))}
          <path d="M292 131h8m34 0h8M292 169h8m34 0h8M275 146v8m42-8v8m42-8v8" className="stroke-accent" />
        </>
      ) : (
        [2, 1, 0].map((t) => (
          <g key={t} transform={`translate(${104 + t * 28} ${70 + t * 46})`}>
            {cells.map(({ c, r }) => (
              <rect key={`${c}${r}`} x={c * 46} y={r * 26} width="38" height="20" rx="3" className={t === 1 ? "stroke-accent" : "stroke-white/60"} />
            ))}
          </g>
        ))
      )}
    </svg>
  );
}
