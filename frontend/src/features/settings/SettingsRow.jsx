/**
 * A single tappable settings row: icon, label, optional subtitle, and a
 * trailing slot (toggle, chevron, swatch, etc). Shared shape so the whole
 * settings list reads consistently regardless of what each row controls.
 */
export function SettingsRow({ icon: Icon, label, subtitle, trailing, onPress, tone = "default" }) {
  const Wrapper = onPress ? "button" : "div";

  return (
    <Wrapper
      type={onPress ? "button" : undefined}
      onClick={onPress}
      className={`pressable flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-[var(--duration-fast)] ${
        onPress ? "hover:bg-surface" : ""
      }`}
    >
      {Icon ? (
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-tile)] ${
            tone === "danger" ? "bg-danger/12 text-danger" : "bg-accent-soft text-accent"
          }`}
        >
          <Icon className="size-[18px]" strokeWidth={2} aria-hidden />
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[15px] font-medium ${tone === "danger" ? "text-danger" : ""}`}
        >
          {label}
        </p>
        {subtitle ? <p className="truncate text-xs text-muted">{subtitle}</p> : null}
      </div>

      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </Wrapper>
  );
}

/** A labeled group of SettingsRows with a section heading, iOS-Settings style. */
export function SettingsSection({ title, children }) {
  return (
    <section className="animate-fade-in-up space-y-2">
      {title ? (
        <h2 className="px-4 text-[11px] font-semibold uppercase tracking-wide text-muted">
          {title}
        </h2>
      ) : null}
      <div className="divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-background">
        {children}
      </div>
    </section>
  );
}