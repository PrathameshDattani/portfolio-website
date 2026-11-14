import { pad } from "@/lib/utils";

/** Original front-view helmet illustration. Used when no profile image is set. */
export function Helmet({ number, code }: { number: number; code: string }) {
  return (
    <svg viewBox="0 0 320 320" className="h-auto w-full" role="img" aria-label={`Helmet for car ${number}`}>
      <defs>
        <linearGradient id="shell" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f4f4f5" />
          <stop offset="1" stopColor="#a1a1aa" />
        </linearGradient>
        <linearGradient id="visor" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#2a2a30" />
          <stop offset="0.55" stopColor="#09090b" />
          <stop offset="1" stopColor="#1c1c20" />
        </linearGradient>
        <linearGradient id="visorTint" x1="0" x2="1">
          <stop offset="0" stopColor="var(--livery)" stopOpacity="0.0" />
          <stop offset="0.5" stopColor="var(--livery)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--livery-2)" stopOpacity="0.15" />
        </linearGradient>
        <clipPath id="dome">
          <path d="M44 156C44 76 96 26 160 26s116 50 116 130v70c0 40-30 72-70 72H114c-40 0-70-32-70-72Z" />
        </clipPath>
      </defs>
      <ellipse cx="160" cy="306" rx="110" ry="8" fill="#000" opacity=".5" />
      <path d="M44 156C44 76 96 26 160 26s116 50 116 130v70c0 40-30 72-70 72H114c-40 0-70-32-70-72Z" fill="url(#shell)" />
      <g clipPath="url(#dome)">
        {/* livery bands */}
        <path d="M20 96 L300 40 L300 74 L20 132Z" fill="var(--livery)" />
        <path d="M20 140 L300 82 L300 92 L20 150Z" fill="var(--livery-2)" />
        <path d="M120 230h80l20 90H100Z" fill="var(--livery)" />
        <rect x="0" y="0" width="320" height="320" fill="url(#visorTint)" opacity=".15" />
      </g>
      {/* visor */}
      <path
        d="M68 138c0-20 26-32 92-32s92 12 92 32l-6 44c-2 13-13 21-27 21H101c-14 0-25-8-27-21Z"
        fill="url(#visor)"
        stroke="#0a0a0b"
        strokeWidth="4"
      />
      <path d="M80 136c10-14 40-20 80-20" stroke="#fff" strokeOpacity=".35" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M68 150h184" stroke="url(#visorTint)" strokeWidth="18" opacity=".7" />
      {/* chin vents */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={138 + i * 16} y={236} width="8" height="26" rx="3" fill="#0a0a0b" opacity=".85" />
      ))}
      <text x="160" y="84" textAnchor="middle" fontFamily="var(--font-titillium)" fontStyle="italic" fontWeight="900" fontSize="34" fill="#0a0a0b">
        {pad(number)}
      </text>
      <text x="160" y="292" textAnchor="middle" fontFamily="var(--font-jetbrains)" fontWeight="700" fontSize="13" letterSpacing="4" fill="#0a0a0b" opacity=".7">
        {code}
      </text>
    </svg>
  );
}
