import { Button } from "@heroui/react";
import { useClerk, useUser } from "@clerk/react";
import {
  BellIcon,
  ChevronLeftIcon,
  ImageIcon,
  InfoIcon,
  LogOutIcon,
  PaletteIcon,
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
import { SettingsRow, SettingsSection } from "../features/settings/SettingsRow";

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

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-border px-2 py-2.5">
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          className="pressable"
          aria-label="Back"
          onPress={() => navigate(-1)}
        >
          <ChevronLeftIcon className="size-6" strokeWidth={2.25} />
        </Button>
        <h1 className="text-[17px] font-semibold tracking-tight">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <SettingsSection title="Profile">
            <SettingsRow
              icon={undefined}
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
    </div>
  );
}

export default SettingsPage;