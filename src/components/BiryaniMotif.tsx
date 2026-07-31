export default function BiryaniMotif(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" {...props}>
      <ellipse cx="100" cy="112" rx="78" ry="15" />
      <path d="M24,112 Q100,172 176,112" />
      <path d="M32,98 Q52,72 72,96 Q92,64 112,96 Q132,68 152,94 Q162,98 168,102" strokeWidth={2.5} opacity={0.8} />
      <path d="M72,58 Q60,42 72,26 Q82,12 72,0" strokeWidth={2.5} opacity={0.6} />
      <path d="M100,58 Q88,42 100,26 Q110,12 100,0" strokeWidth={2.5} opacity={0.6} />
      <path d="M128,58 Q116,42 128,26 Q138,12 128,0" strokeWidth={2.5} opacity={0.6} />
    </svg>
  );
}
