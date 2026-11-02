const PALETTE = ["bg-yellow", "bg-pink-soft", "bg-blue-soft", "bg-mint", "bg-ear", "bg-belly"];

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function colorFor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

const SIZES = {
  sm: "h-7 w-7 text-[0.62rem] rounded-[8px]",
  md: "h-9 w-9 text-[0.75rem] rounded-[10px]",
  lg: "h-14 w-14 text-base rounded-[14px]",
  xl: "h-20 w-20 text-2xl rounded-[18px] border-2",
};

export function Avatar({
  name,
  size = "md",
  status,
}: {
  name: string;
  size?: keyof typeof SIZES;
  status?: "available" | "busy" | "away";
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={`grid place-items-center border-[1.5px] border-ink font-extrabold text-ink ${colorFor(name)} ${SIZES[size]}`}
        aria-hidden
      >
        {initials(name)}
      </span>
      {status && <StatusDot status={status} className="absolute -right-1 -bottom-1" />}
    </span>
  );
}

const STATUS = {
  available: { cls: "bg-green", label: "Available" },
  busy: { cls: "bg-nose", label: "In meetings" },
  away: { cls: "bg-ear", label: "Away" },
};

export function StatusDot({
  status,
  className = "",
}: {
  status: keyof typeof STATUS;
  className?: string;
}) {
  return (
    <span
      title={STATUS[status].label}
      className={`inline-block h-3 w-3 rounded-full border-[1.5px] border-ink ${STATUS[status].cls} ${className}`}
    />
  );
}

export const statusLabel = (s: keyof typeof STATUS) => STATUS[s].label;
