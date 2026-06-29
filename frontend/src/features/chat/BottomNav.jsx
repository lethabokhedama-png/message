import { MessageSquareIcon, SettingsIcon, UsersIcon } from "lucide-react";

const TABS = [
  { id: "chats", label: "Chats", icon: MessageSquareIcon },
  { id: "groups", label: "Groups", icon: UsersIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

/**
 * Mobile-only bottom tab bar (Instagram/iOS Messages style). Hidden at the
 * `isLargeScreen` breakpoint where the sidebar takes over navigation.
 * The active tab's icon+label scale up slightly and the indicator bar
 * slides under it — pure CSS transform, no layout shift. Rendered both
 * inside ChatSidebar (chats/groups) and on SettingsPage, so the active
 * highlight stays correct regardless of which route you're actually on.
 */
export function BottomNav({ activeTab, onTabChange }) {
  const activeIndex = TABS.findIndex((tab) => tab.id === activeTab);

  return (
    <nav className="sticky bottom-0 z-20 shrink-0 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
      <div className="relative flex items-stretch">
        <div
          className="pointer-events-none absolute top-0 h-0.5 w-1/3 bg-accent transition-transform duration-[var(--duration-base)] ease-[var(--ease-spring)]"
          style={{ transform: `translateX(${Math.max(activeIndex, 0) * 100}%)` }}
          aria-hidden
        />
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="pressable flex flex-1 flex-col items-center gap-1 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`size-6 transition-all duration-[var(--duration-base)] ease-[var(--ease-spring)] ${
                  isActive ? "scale-110 text-accent" : "scale-100 text-muted"
                }`}
                strokeWidth={isActive ? 2.25 : 2}
              />
              <span
                className={`text-[11px] font-medium transition-colors duration-[var(--duration-base)] ${
                  isActive ? "text-accent" : "text-muted"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}