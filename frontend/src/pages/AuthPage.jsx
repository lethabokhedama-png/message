import { AuthActionPanel } from "../features/auth/AuthActionPanel";
import AuthHeader from "../features/auth/AuthHeader";
import { AuthHeroPanel } from "../features/auth/AuthHeroPanel";
import { useWallpaper } from "../context/WallpaperContext";

function AuthPage() {
  const { frameStyle } = useWallpaper();

  return (
    <div
      className="h-dvh overflow-hidden bg-background lg:flex lg:items-center lg:justify-center lg:p-8"
      style={frameStyle}
    >
      <div className="flex h-full w-full flex-col overflow-hidden bg-background text-foreground lg:mx-auto lg:h-auto lg:max-h-[90dvh] lg:max-w-5xl lg:rounded-[var(--radius-sheet)] lg:border lg:border-border lg:shadow-2xl lg:shadow-black/10">
        <AuthHeader />

        <main className="relative flex flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          <AuthHeroPanel />
          <AuthActionPanel />
        </main>
      </div>
    </div>
  );
}
export default AuthPage;