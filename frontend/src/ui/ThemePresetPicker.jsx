import { Button, Modal, useOverlayState } from "@heroui/react";
import { Check, Palette } from "lucide-react";
import { applyThemePresetToDocument, useTheme } from "../context/ThemeContext";
import { HERO_UI_THEME_PRESETS } from "../data/herouiThemePresets";

export function ThemePresetPicker() {
  const modal = useOverlayState();
  const { themePreset, setThemePreset } = useTheme();

  const handleSelect = (id) => {
    applyThemePresetToDocument(id);
    setThemePreset(id);
    modal.close();
  };

  return (
    <Modal.Root state={modal}>
      <Modal.Trigger>
        <Button variant="ghost" size="sm" isIconOnly className="pressable text-foreground">
          <Palette className="size-5" />
        </Button>
      </Modal.Trigger>

      <Modal.Backdrop variant="opaque" className="animate-backdrop-in">
        <Modal.Container size="md" scroll="inside" placement="center">
          <Modal.Dialog className="animate-sheet-up max-h-[85dvh] rounded-[var(--radius-sheet)] border border-white/10 bg-[#2a2a2c] text-foreground shadow-2xl">
            <Modal.Header className="flex flex-row items-center justify-between gap-3 border-b border-white/10 pb-3">
              <Modal.Heading className="text-lg font-semibold tracking-tight text-white">
                Accent theme
              </Modal.Heading>
              <Modal.CloseTrigger className="pressable" />
            </Modal.Header>

            <Modal.Body className="isolate pt-4">
              <p className="mb-4 text-sm text-zinc-400">
                Each accent also shifts the app's shape and motion to match its personality.
              </p>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                {HERO_UI_THEME_PRESETS.map((p) => {
                  const selected = themePreset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelect(p.id)}
                      className={[
                        "pressable relative flex flex-col items-center gap-2 rounded-[var(--radius-tile)] p-2 text-center",
                        "transition-colors duration-[var(--duration-fast)]",
                        selected
                          ? "bg-white/10 ring-2 ring-accent ring-offset-2 ring-offset-[#2a2a2c]"
                          : "hover:bg-white/6",
                      ].join(" ")}
                      aria-pressed={selected}
                    >
                      <span className="relative">
                        <span
                          className="block size-14 shrink-0 rounded-full shadow-md ring-1 ring-white/20 transition-transform duration-[var(--duration-base)] ease-[var(--ease-spring)]"
                          style={{ background: p.swatch }}
                        />

                        {selected ? (
                          <span className="animate-bubble-pop absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md">
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={[
                          "text-[11px] font-medium leading-tight",
                          selected ? "text-white" : "text-zinc-400",
                        ].join(" ")}
                      >
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}