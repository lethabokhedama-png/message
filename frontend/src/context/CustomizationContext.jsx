import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";

const CustomizationContext = createContext(null);

export const TEXT_SIZES = [
  { id: "small", label: "Small", scale: 0.92 },
  { id: "medium", label: "Default", scale: 1 },
  { id: "large", label: "Large", scale: 1.12 },
  { id: "xlarge", label: "Extra large", scale: 1.26 },
];

export const DENSITIES = [
  { id: "cozy", label: "Cozy", description: "More breathing room between messages" },
  { id: "compact", label: "Compact", description: "Tighter spacing, more on screen" },
];

export const BUBBLE_STYLES = [
  { id: "rounded", label: "Rounded", description: "Soft iMessage-style bubbles" },
  { id: "sharp", label: "Sharp", description: "Square, minimal corners" },
];

const DEFAULTS = {
  textSize: "medium",
  density: "cozy",
  bubbleStyle: "rounded",
};

function readStored(key, fallback) {
  const value = localStorage.getItem(key);
  return value ?? fallback;
}

function applyToDocument({ textSize, density, bubbleStyle }) {
  const root = document.documentElement;
  const sizeMatch = TEXT_SIZES.find((s) => s.id === textSize) ?? TEXT_SIZES[1];
  root.style.setProperty("--text-scale", String(sizeMatch.scale));
  root.setAttribute("data-density", density);
  root.setAttribute("data-bubble-style", bubbleStyle);
}

export function useCustomization() {
  const ctx = useContext(CustomizationContext);
  if (!ctx) {
    throw new Error("useCustomization must be used within CustomizationProvider");
  }
  return ctx;
}

export function CustomizationProvider({ children }) {
  const [textSize, setTextSizeState] = useState(() => readStored("textSize", DEFAULTS.textSize));
  const [density, setDensityState] = useState(() => readStored("density", DEFAULTS.density));
  const [bubbleStyle, setBubbleStyleState] = useState(() =>
    readStored("bubbleStyle", DEFAULTS.bubbleStyle),
  );

  useLayoutEffect(() => {
    applyToDocument({ textSize, density, bubbleStyle });
  }, [textSize, density, bubbleStyle]);

  useEffect(() => {
    localStorage.setItem("textSize", textSize);
    localStorage.setItem("density", density);
    localStorage.setItem("bubbleStyle", bubbleStyle);
  }, [textSize, density, bubbleStyle]);

  const resetCustomization = () => {
    setTextSizeState(DEFAULTS.textSize);
    setDensityState(DEFAULTS.density);
    setBubbleStyleState(DEFAULTS.bubbleStyle);
  };

  const value = {
    textSize,
    setTextSize: setTextSizeState,
    density,
    setDensity: setDensityState,
    bubbleStyle,
    setBubbleStyle: setBubbleStyleState,
    resetCustomization,
  };

  return <CustomizationContext.Provider value={value}>{children}</CustomizationContext.Provider>;
}