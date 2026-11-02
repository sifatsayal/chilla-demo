// The Chilla chinchilla, the same SVG as the landing page mascot.
export function Mascot({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 200 190"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <ellipse cx="62" cy="42" rx="24" ry="32" fill="var(--color-fur)" />
      <ellipse cx="62" cy="44" rx="14" ry="21" fill="var(--color-ear)" />
      <ellipse cx="138" cy="42" rx="24" ry="32" fill="var(--color-fur)" />
      <ellipse cx="138" cy="44" rx="14" ry="21" fill="var(--color-ear)" />
      <path d="M42 112 a58 58 0 0 1 116 0 Z" fill="var(--color-fur)" />
      <ellipse cx="56" cy="128" rx="34" ry="26" fill="var(--color-fur)" />
      <ellipse cx="144" cy="128" rx="34" ry="26" fill="var(--color-fur)" />
      <ellipse cx="54" cy="128" rx="20" ry="13" fill="var(--color-ear)" />
      <ellipse cx="146" cy="128" rx="20" ry="13" fill="var(--color-ear)" />
      <path d="M58 150 L36 184 L86 162 Z" fill="var(--color-fur)" />
      <ellipse cx="100" cy="146" rx="42" ry="24" fill="var(--color-belly)" />
      <circle cx="82" cy="96" r="10" fill="var(--color-ink)" />
      <circle cx="118" cy="96" r="10" fill="var(--color-ink)" />
      <circle cx="85" cy="92" r="3.4" fill="#fff" />
      <circle cx="121" cy="92" r="3.4" fill="#fff" />
      <ellipse cx="100" cy="116" rx="6" ry="4.2" fill="var(--color-nose)" />
      <g stroke="var(--color-ink)" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round">
        <line x1="8" y1="112" x2="84" y2="124" />
        <line x1="6" y1="128" x2="84" y2="128" />
        <line x1="10" y1="146" x2="84" y2="132" />
        <line x1="192" y1="112" x2="116" y2="124" />
        <line x1="194" y1="128" x2="116" y2="128" />
        <line x1="190" y1="146" x2="116" y2="132" />
      </g>
    </svg>
  );
}

/** Chilla's square avatar, used for bot messages. */
export function ChillaAvatar({ size = 36 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[10px] border-[1.5px] border-ink bg-belly p-[3px]"
      style={{ width: size, height: size }}
    >
      <Mascot />
    </span>
  );
}
