/**
 * A tiny, self-contained chat preview so changes to text size, density, and
 * bubble style are felt immediately while customizing — not just described.
 * Reads the same CSS vars the real chat UI reads, so it's a faithful preview.
 */
export function CustomizationPreview() {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface/60 p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted">Preview</p>
      <div className="flex flex-col" style={{ gap: "var(--message-gap)" }}>
        <div className="flex w-full justify-start">
          <div className="max-w-[80%] rounded-[var(--radius-bubble)] rounded-bl-md bg-background px-3 py-2 text-[calc(15px*var(--text-scale))] leading-snug shadow-sm">
            Hey, are we still on for later?
          </div>
        </div>
        <div className="flex w-full justify-end">
          <div className="max-w-[80%] rounded-[var(--radius-bubble)] rounded-br-md bg-accent px-3 py-2 text-[calc(15px*var(--text-scale))] leading-snug text-accent-foreground">
            Yes! Just wrapping up, see you soon.
          </div>
        </div>
      </div>
    </div>
  );
}