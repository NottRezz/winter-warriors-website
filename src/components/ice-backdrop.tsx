const SKATE_MARKS = [
  "M-40 120 Q 260 40 520 210",
  "M90 420 Q 300 250 640 330",
  "M210 760 Q 420 560 760 640",
  "M480 60 Q 760 180 1010 40",
  "M620 480 Q 880 360 1240 470",
  "M840 760 Q 980 600 1260 660",
  "M-30 610 Q 160 520 360 640",
  "M700 250 Q 900 200 1090 300",
  "M30 280 Q 120 180 300 170",
  "M960 140 Q 1100 240 1250 170",
];

const HASH_MARKS = [
  "M806 195 v-34 M854 195 v-34 M806 445 v34 M854 445 v34",
  "M706 306 h-34 M706 334 h-34 M954 306 h34 M954 334 h34",
];

/** Faceoff circle and skate cuts, drawn in currentColor behind a section. */
export function IceBackdrop({
  className = "",
  rink = true,
}: {
  className?: string;
  rink?: boolean;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="currentColor"
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
    >
      <g strokeWidth="1" opacity="0.55">
        {SKATE_MARKS.map((path) => (
          <path key={path} d={path} />
        ))}
      </g>
      {rink && (
        <g strokeWidth="4">
          <circle cx="830" cy="320" r="150" />
          <circle cx="830" cy="320" r="9" fill="currentColor" stroke="none" />
          {HASH_MARKS.map((path) => (
            <path key={path} d={path} />
          ))}
        </g>
      )}
    </svg>
  );
}
