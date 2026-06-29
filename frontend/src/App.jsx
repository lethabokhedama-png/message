import { WallpaperProvider } from "./context/WallpaperContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CustomizationProvider } from "./context/CustomizationContext";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import SettingsPage from "./pages/SettingsPage";
import { useAuth } from "@clerk/react";
import PageLoader from "./ui/PageLoader";
import { useAuthStore } from "./store/useAuthStore";
import React, { useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  const clearAuth = useAuthStore((state) => state.clearAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) checkAuth();
    else clearAuth();
  }, [checkAuth, clearAuth, isLoaded, isSignedIn]);

  if (!isLoaded || (isSignedIn && isCheckingAuth)) return <PageLoader />;

  return (
    <ThemeProvider>
      <CustomizationProvider>
        <WallpaperProvider>
          <Routes>
            <Route
              path="/"
              element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace />}
            />
            <Route
              path="/settings"
              element={isSignedIn ? <SettingsPage /> : <Navigate to={"/auth"} replace />}
            />
            <Route
              path="/auth"
              element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />}
            />
          </Routes>
          <Toaster />
        </WallpaperProvider>
      </CustomizationProvider>
    </ThemeProvider>
  );
}

export default App;