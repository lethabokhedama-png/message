import { Button } from "@heroui/react";
import { useClerk, useUser } from "@clerk/react";
import {
  BellIcon,
  ChevronLeftIcon,
  ImageIcon,
  InfoIcon,
  LogOutIcon,
  PaletteIcon,
  RotateCcwIcon,
  TypeIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { useNavigate } from "react-router";
import { APP_NAME, AppLogo } from "../ui/AppLogo";
import { ThemeToggle } from "../ui/ThemeToggle";
import { WallpaperPicker } from "../ui/WallpaperPicker";
import { ThemePresetPicker } from "../ui/ThemePresetPicker";
import { useChatStore } from "../store/useChatStore";
import { useWallpaper } from "../context/WallpaperContext";
import {
  BUBBLE_STYLES,
  DENSITIES,
  TEXT_SIZES,
  useCustomization,
} from "../context/CustomizationContext";
import { SettingsRow, SettingsSection } from "../features/settings/SettingsRow";
import { SegmentedPicker } from "../features/settings/SegmentedPicker";
import { CustomizationPreview } from "../features/settings/CustomizationPreview";
import { BottomNav } from "../features/chat/BottomNav";

function SoundToggleButton() {
  const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
  const setSoundEnabled = useChatStore((state) => state.setSoundEnabled);

  return (
    <Button
      size="sm"
      variant={isSoundEnabled ? "primary" : "ghost"}
      className="pressable"
      onPress={() => setSoundEnabled(!isSoundEnabled)}
    >
      {isSoundEnabled ? (
        <span className="flex items-center gap-1.5">
          <Volume2Icon className="size-4" /> On
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <VolumeXIcon className="size-4" /> Off
        </span>
      )}
    </Button>
  );
}

function SettingsPage() {
  const navigate = useNavigate();
  const clerk = useClerk();
  const { user } = useUser();
  const { wallpaper } = useWallpaper();
  const setSidebarTab = useChatStore((state) => state.setSidebarTab);
  const {
    textSize,
    setTextSize,
    density,
    setDensity,
    bubbleStyle,
    setBubbleStyle,
    resetCustomization,
  } = useCustomization();

  const handleBottomNavChange = (tab) => {
    if (tab === "settings") return;
    setSidebarTab(tab);
    navigate("/");
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-border bg-background/95 px-2 py-2.5 backdrop-blur-md">
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          className="pressable lg:hidden"
          aria-label="Back"
          onPress={() => navigate("/")}
        >
          <ChevronLeftIcon className="size-6" strokeWidth={2.25} />
        </Button>
        <h1 className="text-[17px] font-semibold tracking-tight">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6 pb-6">
          <SettingsSection title="Profile">
            <SettingsRow
              label={user?.fullName || "Your account"}
              subtitle={user?.primaryEmailAddress?.emailAddress}
              trailing={
                user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt=""
                    className="size-10 rounded-full object-cover"
                    draggable={false}
                  />
                ) : null
              }
              onPress={() => clerk.openUserProfile()}
            />
          </SettingsSection>

          <SettingsSection title="Appearance">
            <SettingsRow
              icon={PaletteIcon}
              label="Light / Dark"
              subtitle="Switch the overall app brightness"
              trailing={<ThemeToggle />}
            />
            <SettingsRow
              icon={PaletteIcon}
              label="Accent theme"
              subtitle="Changes color, shape, and motion"
              trailing={<ThemePresetPicker />}
            />
            <SettingsRow
              icon={ImageIcon}
              label="Backdrop"
              subtitle={wallpaper?.label}
              trailing={<WallpaperPicker />}
            />
          </SettingsSection>

          <section className="animate-fade-in-up space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Customize chat
              </h2>
              <button
                type="button"
                onClick={resetCustomization}
                className="pressable flex items-center gap-1 text-xs font-medium text-accent"
              >
                <RotateCcwIcon className="size-3" />
                Reset
              </button>
            </div>

            <CustomizationPreview />

            <div className="space-y-4 rounded-[var(--radius-card)] border border-border bg-background p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TypeIcon className="size-4 text-accent" />
                  Text size
                </div>
                <SegmentedPicker options={TEXT_SIZES} value={textSize} onChange={setTextSize} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ImageIcon className="size-4 text-accent" />
                  Message spacing
                </div>
                <SegmentedPicker options={DENSITIES} value={density} onChange={setDensity} />
                <p className="text-xs text-muted">
                  {DENSITIES.find((d) => d.id === density)?.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <PaletteIcon className="size-4 text-accent" />
                  Bubble shape
                </div>
                <SegmentedPicker
                  options={BUBBLE_STYLES}
                  value={bubbleStyle}
                  onChange={setBubbleStyle}
                />
                <p className="text-xs text-muted">
                  {BUBBLE_STYLES.find((b) => b.id === bubbleStyle)?.description}
                </p>
              </div>
            </div>
          </section>

          <SettingsSection title="Notifications">
            <SettingsRow
              icon={BellIcon}
              label="Message sounds"
              subtitle="Play a sound while typing and sending"
              trailing={<SoundToggleButton />}
            />
          </SettingsSection>

          <SettingsSection title="About">
            <SettingsRow
              icon={InfoIcon}
              label={APP_NAME}
              subtitle="Version 1.0.0"
              trailing={<AppLogo size={28} className="rounded-[calc(var(--radius-tile)*0.6)]" />}
            />
          </SettingsSection>

          <SettingsSection>
            <SettingsRow
              icon={LogOutIcon}
              label="Sign out"
              tone="danger"
              onPress={() => clerk.signOut()}
            />
          </SettingsSection>
        </div>
      </div>

      <BottomNav activeTab="settings" onTabChange={handleBottomNavChange} />
    </div>
  );
}

export default SettingsPage;