import { Fragment } from "react";

// Renders the tiny subset of Slack-style markdown Chilla uses: **bold** and `code`.
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) return <b key={i}>{p.slice(2, -2)}</b>;
        if (p.startsWith("`") && p.endsWith("`"))
          return (
            <code key={i} className="rounded-[5px] bg-blue-soft px-1.5 py-px text-[0.88em]">
              {p.slice(1, -1)}
            </code>
          );
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
