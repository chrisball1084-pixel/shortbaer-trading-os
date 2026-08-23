/**
 * Logo als Inline-SVG. Als Bilddatei brach es unter dem GitHub-Pages-basePath und
 * der Browser zeigte stattdessen sein blaues Platzhalter-Fragezeichen.
 */
export function BrandMark({ size = 40 }: { size?: number }) {
  return <svg className="brand-mark" width={size} height={size} viewBox="0 0 512 512" role="img" aria-label="ShortBär">
    <defs>
      <linearGradient id="brand-mark-cyan" x1="0" x2="1">
        <stop stopColor="#0698bf"/>
        <stop offset="1" stopColor="#5ce5ff"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="112" fill="#07111f"/>
    <path d="M120 192 94 111l87 35c23-14 48-21 75-21s53 7 75 21l87-35-26 81c28 28 45 66 45 108 0 91-78 153-181 153S75 391 75 300c0-42 17-80 45-108Z" fill="url(#brand-mark-cyan)"/>
    <path d="M171 276c24-31 57-45 85-45s61 14 85 45c-12 59-42 99-85 99s-73-40-85-99Z" fill="#081420"/>
    <circle cx="179" cy="238" r="13" fill="#081420"/>
    <circle cx="333" cy="238" r="13" fill="#081420"/>
    <path d="M227 293h58l-29 35Z" fill="#5ce5ff"/>
  </svg>;
}
