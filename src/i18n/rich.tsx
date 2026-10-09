import { Fragment, type ReactNode } from "react";

/**
 * Fill `{name}` placeholders with React nodes (hook-free: Server and Client Components).
 * Use it when part of a sentence needs markup, so translators keep the whole sentence in one string:
 *
 *   rich(t.common.feedback.seen, { shown: <b className="font-num">24</b>, total: <b>120</b>, noun: "promos" })
 *   rich("Every {accent} brand", { accent: <Accent>local</Accent> })
 *
 * Unknown placeholders stay visible as text.
 */
export function rich(template: string, nodes: Record<string, ReactNode>): ReactNode {
  const parts = template.split(/(\{\w+\})/g);
  return parts.map((part, i) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    if (key && key in nodes) return <Fragment key={i}>{nodes[key]}</Fragment>;
    return part ? <Fragment key={i}>{part}</Fragment> : null;
  });
}
