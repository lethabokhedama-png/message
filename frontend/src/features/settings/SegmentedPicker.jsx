import { Button } from "@heroui/react";

/**
 * A horizontal row of mutually-exclusive pill buttons. Built on the same
 * `Button` primitive already used elsewhere (ThemeToggle, etc.) rather than
 * a Select/RadioGroup component we haven't confirmed the API for.
 */
export function SegmentedPicker({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const isActive = option.id === value;
        return (
          <Button
            key={option.id}
            size="sm"
            variant={isActive ? "primary" : "ghost"}
            className="pressable"
            onPress={() => onChange(option.id)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}